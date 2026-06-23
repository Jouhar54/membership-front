import { delay } from '../utils'
import { dummyMembers, dummyBatches, dummyUsers, getStats } from '../lib/dummyData'

// Simulate API calls with dummy data for frontend testing
// Replace these with real API calls when backend is ready

// ─── Auth API ────────────────────────────────────────────
export const authApi = {
  login: async ({ email, password }) => {
    await delay(800)
    // Simulate login based on email
    if (email === 'admin@aalia.org') {
      return { user: dummyUsers.admin, token: 'fake-admin-token', refreshToken: 'fake-refresh' }
    }
    if (email === 'batchadmin@aalia.org') {
      return { user: dummyUsers.batchAdmin, token: 'fake-batch-token', refreshToken: 'fake-refresh' }
    }
    return { user: dummyUsers.member, token: 'fake-member-token', refreshToken: 'fake-refresh' }
  },

  register: async (data) => {
    await delay(1000)
    return {
      user: {
        id: 'mem-new',
        ...data,
        role: 'member',
        membershipStatus: 'pending',
        paymentStatus: 'unpaid',
        posterStatus: 'not_generated',
        registeredAt: new Date().toISOString(),
      },
      token: 'fake-new-token',
      refreshToken: 'fake-refresh',
    }
  },

  getProfile: async () => {
    await delay(400)
    return dummyUsers.member
  },
}

// ─── Members API ─────────────────────────────────────────
export const membersApi = {
  getAll: async ({ search, batch, status, page = 1 } = {}) => {
    await delay(600)
    let filtered = [...dummyMembers]
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          m.fullName.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.phone.includes(q)
      )
    }
    if (batch) filtered = filtered.filter((m) => m.batchId === batch)
    if (status) filtered = filtered.filter((m) => m.membershipStatus === status)
    return { members: filtered, total: filtered.length, page, totalPages: 1 }
  },

  getById: async (id) => {
    await delay(400)
    return dummyMembers.find((m) => m.id === id) || null
  },

  approve: async (id) => {
    await delay(600)
    return { success: true, message: 'Member approved successfully' }
  },

  reject: async (id) => {
    await delay(600)
    return { success: true, message: 'Member rejected' }
  },

  markPaid: async (id) => {
    await delay(600)
    return { success: true, message: 'Payment marked as paid' }
  },

  getPending: async () => {
    await delay(500)
    return dummyMembers.filter((m) => m.membershipStatus === 'pending')
  },

  getStats: async () => {
    await delay(400)
    return getStats()
  },

  getRecent: async () => {
    await delay(400)
    return dummyMembers.slice(0, 5)
  },
}

// ─── Batches API ─────────────────────────────────────────
export const batchesApi = {
  getAll: async () => {
    await delay(500)
    return dummyBatches
  },

  getById: async (id) => {
    await delay(400)
    return dummyBatches.find((b) => b.id === id) || null
  },

  create: async (data) => {
    await delay(800)
    return {
      id: `batch-${Date.now()}`,
      ...data,
      memberCount: 0,
      joinCode: `${data.name.slice(0, 2).toUpperCase()}${data.year}${Math.random().toString(36).slice(2, 4).toUpperCase()}`,
    }
  },

  update: async (id, data) => {
    await delay(600)
    return { id, ...data }
  },

  delete: async (id) => {
    await delay(600)
    return { success: true }
  },

  generateJoinLink: async (id) => {
    await delay(400)
    const batch = dummyBatches.find((b) => b.id === id)
    return { link: `${window.location.origin}/join/${batch?.joinCode || 'XXXX'}` }
  },
}

// ─── Poster API ──────────────────────────────────────────
export const posterApi = {
  getStatus: async (memberId) => {
    await delay(400)
    const member = dummyMembers.find((m) => m.id === memberId)
    return { status: member?.posterStatus || 'not_generated' }
  },

  generate: async (memberId) => {
    await delay(1500)
    return { status: 'ready', posterUrl: '/poster-preview.png' }
  },

  download: async (memberId) => {
    await delay(500)
    return { downloadUrl: '/poster-preview.png' }
  },
}
