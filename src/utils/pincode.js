import { DISTRICTS, STATES } from '../constants'

// In-memory cache to avoid repeated network calls for the same pincode
const pinCache = new Map()

const DISTRICT_ALIASES = {
  calicut: 'Kozhikode',
  trivandrum: 'Thiruvananthapuram',
  cochin: 'Ernakulam',
  ernakulam: 'Ernakulam',
  trichur: 'Thrissur',
  thrissur: 'Thrissur',
  palghat: 'Palakkad',
  palakkad: 'Palakkad',
  cannanore: 'Kannur',
  cannannore: 'Kannur',
  kannur: 'Kannur',
  kasargod: 'Kasaragod',
  kasaragod: 'Kasaragod',
  alleppey: 'Alappuzha',
  alappuzha: 'Alappuzha',
  quilon: 'Kollam',
  kollam: 'Kollam',
}

/**
 * Match a raw district name from API to the official DISTRICTS constant list.
 */
export function matchDistrict(rawDistrict) {
  if (!rawDistrict) return ''
  const trimmed = rawDistrict.trim()
  const lower = trimmed.toLowerCase()

  // 1. Direct alias lookup
  if (DISTRICT_ALIASES[lower]) {
    return DISTRICT_ALIASES[lower]
  }

  // 2. Case-insensitive match against official list
  const directMatch = DISTRICTS.find((d) => d.toLowerCase() === lower)
  if (directMatch) return directMatch

  // 3. Substring match (e.g. "Kasaragod District" -> "Kasaragod")
  const partialMatch = DISTRICTS.find(
    (d) => lower.length > 4 && (lower.includes(d.toLowerCase()) || d.toLowerCase().includes(lower))
  )
  if (partialMatch) return partialMatch

  // Return the actual raw district name (e.g. "Lakshadweep")
  return trimmed
}

/**
 * Match a raw state name from API to the official STATES constant list.
 */
export function matchState(rawState) {
  if (!rawState) return 'Kerala'
  const trimmed = rawState.trim()
  const lower = trimmed.toLowerCase()

  const directMatch = STATES.find((s) => s.toLowerCase() === lower)
  if (directMatch) return directMatch

  // Return the actual raw state/UT name (e.g. "Lakshadweep") instead of 'Others'
  return trimmed
}

/**
 * Fetch Indian postal details for a 6-digit PIN code.
 *
 * @param {string} pin - 6 digit postal code
 * @returns {Promise<{
 *   success: boolean,
 *   district: string,
 *   state: string,
 *   taluk: string,
 *   primaryPostOffice: string,
 *   postOffices: Array<{ name: string, branchType: string, block: string }>,
 *   error?: string
 * }>}
 */
export async function fetchLocationByPin(pin) {
  const cleanPin = String(pin || '').trim()

  if (!/^\d{6}$/.test(cleanPin)) {
    return { success: false, error: 'Please enter a valid 6-digit PIN code' }
  }

  if (pinCache.has(cleanPin)) {
    return pinCache.get(cleanPin)
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 7000)

    const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Postal API responded with status ${response.status}`)
    }

    const data = await response.json()

    if (!Array.isArray(data) || data.length === 0) {
      return { success: false, error: 'No data received from postal service' }
    }

    const resultBlock = data[0]

    if (resultBlock.Status !== 'Success' || !Array.isArray(resultBlock.PostOffice) || resultBlock.PostOffice.length === 0) {
      return {
        success: false,
        error: resultBlock.Message || 'No location details found for this PIN code',
      }
    }

    const offices = resultBlock.PostOffice
    // Pick the primary office (prefer Delivery branch or first in array)
    const primaryOffice = offices.find((o) => o.DeliveryStatus === 'Delivery') || offices[0]

    const matchedDist = matchDistrict(primaryOffice.District)
    const matchedSt = matchState(primaryOffice.State)
    const rawBlock = primaryOffice.Block && primaryOffice.Block !== 'NA' ? primaryOffice.Block : ''

    const postOfficesList = offices.map((o) => ({
      name: o.Name,
      branchType: o.BranchType,
      block: o.Block && o.Block !== 'NA' ? o.Block : '',
      deliveryStatus: o.DeliveryStatus,
    }))

    const result = {
      success: true,
      district: matchedDist,
      state: matchedSt,
      taluk: rawBlock,
      primaryPostOffice: primaryOffice.Name || '',
      postOffices: postOfficesList,
    }

    pinCache.set(cleanPin, result)
    return result
  } catch (err) {
    console.warn('[Pincode Lookup] Failed to fetch:', err?.message || err)
    return {
      success: false,
      error: err.name === 'AbortError' ? 'PIN code lookup timed out' : 'Unable to auto-fetch location details',
    }
  }
}
