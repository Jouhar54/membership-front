/**
 * Merge class names conditionally
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Format date to readable string
 */
export function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Format phone number
 */
export function formatPhone(phone) {
  if (!phone) return '—'
  if (phone.startsWith('+91')) {
    return `+91 ${phone.slice(3, 8)} ${phone.slice(8)}`
  }
  return phone
}

/**
 * Get initials from full name
 */
export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * Get status color classes
 */
export function getStatusColor(status) {
  const colors = {
    pending: 'bg-warning/10 text-warning',
    approved: 'bg-success/10 text-success',
    rejected: 'bg-error/10 text-error',
    paid: 'bg-success/10 text-success',
    unpaid: 'bg-surface-400/10 text-surface-500',
    verified: 'bg-info/10 text-info',
    ready: 'bg-success/10 text-success',
    not_generated: 'bg-surface-400/10 text-surface-500',
    generating: 'bg-warning/10 text-warning',
  }
  return colors[status] || 'bg-surface-400/10 text-surface-500'
}

/**
 * Format status label
 */
export function formatStatus(status) {
  if (!status) return '—'
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

/**
 * Delay utility for simulating API
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generate a random ID
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 11)
}
