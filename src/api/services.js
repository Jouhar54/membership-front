/**
 * API services — wired to the real AALIA Membership backend.
 *
 * Response normalisation:
 *  The backend wraps every response in { success, message, data: { ... } }.
 *  Each helper unwraps `.data.data` and maps fields to the flat shapes
 *  the UI components already expect (e.g. fullName, batchName, membershipStatus …).
 */
import apiClient from './client'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalise a membership document from the backend to the flat shape used
 * throughout the UI. The backend populates `user` and `batch` sub-documents.
 *
 *  Backend shape:
 *    { _id, user: {_id, fullName, email, phone, district}, batch: {_id, batchName, batchCode},
 *      status, paymentStatus, createdAt, approvedAt, posterUrl, … }
 *
 *  UI shape:
 *    { id, fullName, email, phone, district, batchId, batchName, batchCode,
 *      membershipStatus, paymentStatus, posterStatus, registeredAt, approvedAt }
 */
function normaliseMembership(m) {
  const user = m.user || {}
  const batch = m.batch || {}
  return {
    id: m._id || m.id,
    userId: user._id || user.id || m.user,
    fullName: user.fullName || m.fullName || '—',
    email: user.email || m.email || '',
    phone: user.phone || m.phone || '',
    district: user.district || m.district || '',
    batchId: batch._id || batch.id || m.batch,
    batchName: batch.batchName || m.batchName || '',
    batchCode: batch.batchCode || m.batchCode || '',
    membershipStatus: m.status || m.membershipStatus || 'pending',
    paymentStatus: m.paymentStatus || 'unpaid',
    posterStatus: m.posterUrl ? 'ready' : (m.posterStatus || 'not_generated'),
    posterUrl: m.posterUrl || null,
    registeredAt: m.createdAt || m.registeredAt || null,
    approvedAt: m.approvedAt || null,
  }
}

/**
 * Normalise a batch document.
 *  Backend: { _id, batchName, batchCode, joinLink, coordinators, memberCount, createdAt }
 *  UI:      { id, name, batchCode, joinLink, memberCount, joinCode }
 */
function normaliseBatch(b) {
  return {
    id: b._id || b.id,
    name: b.batchName || b.name || '',
    batchCode: b.batchCode || '',
    // The UI shows /join/<joinCode> — use batchCode as the join code
    joinCode: b.batchCode || b.joinCode || '',
    joinLink: b.joinLink || '',
    description: b.description || '',
    memberCount: b.memberCount ?? 0,
    coordinators: b.coordinators || [],
    createdAt: b.createdAt || null,
    // Legacy fields the BatchesPage uses
    year: b.year || (b.createdAt ? new Date(b.createdAt).getFullYear().toString() : ''),
  }
}

/**
 * Normalise a user document returned by /auth/me or /auth/login.
 *  Backend: { _id, fullName, email, phone, role, batch, district, … }
 *  UI: { id, fullName, email, phone, role, batchId, batchName, district, … }
 */
function normaliseUser(u) {
  const batch = u.batch || {}
  return {
    id: u._id || u.id,
    fullName: u.fullName || '',
    email: u.email || '',
    phone: u.phone || '',
    role: u.role || 'member',
    district: u.district || '',
    batchId: batch._id || batch.id || (typeof u.batch === 'string' ? u.batch : null),
    batchName: batch.batchName || u.batchName || '',
    // Spread any extra fields the backend may return
    membershipStatus: u.membershipStatus || undefined,
    paymentStatus: u.paymentStatus || undefined,
    posterStatus: u.posterStatus || undefined,
  }
}

/** Unwrap the standard backend envelope: { success, data: { key } } */
function unwrap(response, key) {
  const payload = response.data?.data ?? response.data
  return key ? payload?.[key] ?? payload : payload
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  /** POST /auth/login → { user, accessToken } */
  login: async ({ email, password }) => {
    const res = await apiClient.post('/auth/login', { email, password })
    const payload = unwrap(res)
    const user = normaliseUser(payload.user || payload)
    const accessToken = payload.accessToken || payload.token
    return { user, accessToken }
  },

  /** POST /auth/register */
  register: async (data) => {
    const res = await apiClient.post('/auth/register', data)
    const payload = unwrap(res)
    const user = normaliseUser(payload.user || payload)
    const accessToken = payload.accessToken || payload.token
    return { user, accessToken }
  },

  /** POST /auth/logout */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // Swallow — we clear local state regardless
    }
  },

  /** GET /auth/me → normalised user */
  getMe: async () => {
    const res = await apiClient.get('/auth/me')
    const payload = unwrap(res)
    return normaliseUser(payload.user || payload)
  },

  /** POST /auth/refresh-token — called automatically by the interceptor */
  refreshToken: async () => {
    const res = await apiClient.post('/auth/refresh-token')
    return unwrap(res)
  },
}

// ─── Memberships API ──────────────────────────────────────────────────────────
export const membersApi = {
  /** GET /memberships/my — current user's memberships */
  getMy: async () => {
    const res = await apiClient.get('/memberships/my')
    const payload = unwrap(res)
    const list = Array.isArray(payload) ? payload : payload?.memberships ?? []
    return list.map(normaliseMembership)
  },

  /**
   * GET /memberships/batch/:batchId  — admin/batch_admin only
   * Falls back to /dashboard/pending-memberships when no batchId given.
   */
  getAll: async ({ search, batch, status } = {}) => {
    let url = batch
      ? `/memberships/batch/${batch}`
      : '/dashboard/pending-memberships'

    // If neither filter applies and status is not pending, use a broader endpoint
    if (!batch && status && status !== 'pending') {
      // The backend doesn't expose a generic "all memberships" endpoint beyond batch-scoped ones.
      // Use batch stats to enumerate, or fall back to pending route without filter.
      url = '/dashboard/pending-memberships'
    }

    const res = await apiClient.get(url)
    const payload = unwrap(res)
    let list = Array.isArray(payload)
      ? payload
      : payload?.memberships ?? payload?.pendingMemberships ?? []

    list = list.map(normaliseMembership)

    // Client-side filter by search and status
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (m) =>
          m.fullName.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.phone.includes(q),
      )
    }
    if (status) {
      list = list.filter((m) => m.membershipStatus === status)
    }

    return { members: list, total: list.length }
  },

  /** GET /memberships/:id */
  getById: async (id) => {
    const res = await apiClient.get(`/memberships/${id}`)
    return normaliseMembership(unwrap(res)?.membership ?? unwrap(res))
  },

  /** GET /dashboard/pending-memberships */
  getPending: async () => {
    const res = await apiClient.get('/dashboard/pending-memberships')
    const payload = unwrap(res)
    const list = Array.isArray(payload)
      ? payload
      : payload?.memberships ?? payload?.pendingMemberships ?? []
    return list.map(normaliseMembership)
  },

  /** GET /dashboard/stats */
  getStats: async () => {
    const res = await apiClient.get('/dashboard/stats')
    const payload = unwrap(res)
    // Backend: { totalUsers, totalBatches, totalMemberships, approvedMemberships }
    // UI expects: { total, pending, approved, rejected, paid }
    return {
      total: payload.totalMemberships ?? payload.total ?? 0,
      approved: payload.approvedMemberships ?? payload.approved ?? 0,
      pending: payload.pendingMemberships ?? payload.pending ?? 0,
      rejected: payload.rejectedMemberships ?? payload.rejected ?? 0,
      paid: payload.paidMemberships ?? payload.paid ?? 0,
      totalUsers: payload.totalUsers ?? 0,
      totalBatches: payload.totalBatches ?? 0,
    }
  },

  /** GET /dashboard/stats — recent members (last 5 by date) */
  getRecent: async () => {
    const res = await apiClient.get('/dashboard/pending-memberships')
    const payload = unwrap(res)
    const list = Array.isArray(payload)
      ? payload
      : payload?.memberships ?? payload?.pendingMemberships ?? []
    return list.map(normaliseMembership).slice(0, 5)
  },

  /** PATCH /memberships/:id/approve */
  approve: async (id) => {
    const res = await apiClient.patch(`/memberships/${id}/approve`)
    return unwrap(res)
  },

  /** PATCH /memberships/:id/reject */
  reject: async (id) => {
    const res = await apiClient.patch(`/memberships/${id}/reject`)
    return unwrap(res)
  },

  /** PATCH /memberships/:id/mark-paid */
  markPaid: async (id) => {
    const res = await apiClient.patch(`/memberships/${id}/mark-paid`)
    return unwrap(res)
  },

  /** POST /memberships/register */
  registerToBatch: async (batchId) => {
    const res = await apiClient.post('/memberships/register', { batchId })
    return normaliseMembership(unwrap(res)?.membership ?? unwrap(res))
  },
}

// ─── Batches API ──────────────────────────────────────────────────────────────
export const batchesApi = {
  /** GET /batches */
  getAll: async () => {
    const res = await apiClient.get('/batches')
    const payload = unwrap(res)
    const list = Array.isArray(payload) ? payload : payload?.batches ?? []
    return list.map(normaliseBatch)
  },

  /** GET /batches/:id */
  getById: async (id) => {
    const res = await apiClient.get(`/batches/${id}`)
    return normaliseBatch(unwrap(res)?.batch ?? unwrap(res))
  },

  /** POST /batches — body: { batchName, batchCode, joinLink, coordinators } */
  create: async (data) => {
    // The BatchesPage form uses { name, year, description }.
    // Map to what the backend expects.
    const body = {
      batchName: data.name || data.batchName,
      batchCode: data.batchCode || data.name?.slice(0, 2).toUpperCase() + (data.year || ''),
      joinLink: data.joinLink || '',
      coordinators: data.coordinators || [],
    }
    const res = await apiClient.post('/batches', body)
    return normaliseBatch(unwrap(res)?.batch ?? unwrap(res))
  },

  /** PATCH /batches/:id */
  update: async (id, data) => {
    const body = {
      batchName: data.name || data.batchName,
      batchCode: data.batchCode,
      joinLink: data.joinLink,
      coordinators: data.coordinators,
    }
    // Remove undefined keys so we do a true partial PATCH
    Object.keys(body).forEach((k) => body[k] === undefined && delete body[k])
    const res = await apiClient.patch(`/batches/${id}`, body)
    return normaliseBatch(unwrap(res)?.batch ?? unwrap(res))
  },

  /** DELETE /batches/:id */
  delete: async (id) => {
    const res = await apiClient.delete(`/batches/${id}`)
    return unwrap(res)
  },
}

// ─── Dashboard API ────────────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: membersApi.getStats,

  getPendingMemberships: membersApi.getPending,

  /** GET /dashboard/batch-stats */
  getBatchStats: async () => {
    const res = await apiClient.get('/dashboard/batch-stats')
    return unwrap(res)
  },
}

// ─── Poster API (derived from membership data) ────────────────────────────────
export const posterApi = {
  /** Get poster info from the membership record */
  getStatus: async (membershipId) => {
    const res = await apiClient.get(`/applications/${membershipId}`)
    const app = unwrap(res)?.application || unwrap(res)
    return {
      status: app.membershipStatus === 'approved' ? 'ready' : 'not_generated',
      posterUrl: app.posterUrl,
    }
  },

  /** Download poster — returns a URL to open */
  getDownloadUrl: (membership) => {
    return membership?.posterUrl || null
  },
}

// ─── Applications API ─────────────────────────────────────────────────────────
export function normaliseApplication(app) {
  if (!app) return null
  const batch = app.batch || {}
  return {
    id: app._id || app.id,
    fullName: app.fullName || '',
    email: app.email || '',
    phone: app.phone || '',
    district: app.district || '',
    batchId: batch._id || batch.id || app.batch,
    batchName: batch.batchName || app.batchName || '',
    batchCode: batch.batchCode || app.batchCode || '',
    profilePhoto: app.profilePhoto || null,
    membershipStatus: app.membershipStatus || 'pending',
    paymentStatus: app.paymentStatus || 'pending',
    posterStatus: app.posterUrl ? 'ready' : (app.posterGenerated ? 'ready' : 'not_generated'),
    posterUrl: app.posterUrl || null,
    membershipId: app.membershipId || null,
    registeredAt: app.createdAt || null,
    approvedAt: app.approvedAt || null,
  }
}

export const applicationsApi = {
  /** POST /applications */
  create: async (data) => {
    const formData = new FormData()
    formData.append('fullName', data.fullName)
    formData.append('email', data.email)
    formData.append('phone', data.phone)
    formData.append('district', data.district || '')
    formData.append('batchId', data.batchId)
    if (data.profilePhoto) {
      formData.append('profilePhoto', data.profilePhoto)
    }

    const res = await apiClient.post('/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    const payload = unwrap(res)
    return normaliseApplication(payload.application || payload)
  },

  /** POST /applications/status */
  checkStatus: async (searchKey) => {
    const res = await apiClient.post('/applications/status', { identifier: searchKey })
    return unwrap(res)
  },

  /** GET /applications/:id */
  getById: async (id) => {
    const res = await apiClient.get(`/applications/${id}`)
    const payload = unwrap(res)
    return normaliseApplication(payload.application || payload)
  },

  /** GET /admin/applications/:batchId */
  getByBatch: async (batchId) => {
    const res = await apiClient.get(`/admin/applications/${batchId}`)
    const payload = unwrap(res)
    const list = Array.isArray(payload) ? payload : payload?.applications ?? []
    return list.map(normaliseApplication)
  },

  /** PATCH /admin/applications/:id/mark-paid */
  markPaid: async (id) => {
    const res = await apiClient.patch(`/admin/applications/${id}/mark-paid`)
    const payload = unwrap(res)
    return normaliseApplication(payload.application || payload)
  },

  /** PATCH /admin/applications/:id/approve */
  approve: async (id) => {
    const res = await apiClient.patch(`/admin/applications/${id}/approve`)
    const payload = unwrap(res)
    return normaliseApplication(payload.application || payload)
  },

  /** PATCH /admin/applications/:id/reject */
  reject: async (id) => {
    const res = await apiClient.patch(`/admin/applications/${id}/reject`)
    const payload = unwrap(res)
    return normaliseApplication(payload.application || payload)
  },
}
