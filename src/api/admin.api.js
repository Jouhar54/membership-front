import apiClient from './client'

function normaliseBatchAdmin(u) {
  if (!u) return null
  const batch = u.batch || {}
  return {
    id: u._id || u.id,
    fullName: u.fullName || '',
    email: u.email || '',
    phone: u.phone || '',
    role: u.role || 'batch_admin',
    batchId: batch._id || batch.id || (typeof u.batch === 'string' ? u.batch : null),
    batchName: batch.batchName || u.batchName || '',
    batchCode: batch.batchCode || '',
    createdAt: u.createdAt || null,
  }
}

/** Unwrap the standard backend envelope: { success, data: { key } } */
function unwrap(response, key) {
  const payload = response.data?.data ?? response.data
  return key ? payload?.[key] ?? payload : payload
}

export const adminApi = {
  /** GET /admin/batch-admins */
  getBatchAdmins: async ({ search, page = 1, limit = 10 } = {}) => {
    const res = await apiClient.get('/admin/batch-admins', {
      params: { search, page, limit },
    })
    const payload = unwrap(res)
    return {
      admins: (payload.admins || []).map(normaliseBatchAdmin),
      total: payload.total ?? 0,
      page: payload.page ?? 1,
      limit: payload.limit ?? 10,
      totalPages: payload.totalPages ?? 1,
    }
  },

  /** GET /admin/batch-admins/:id */
  getBatchAdminById: async (id) => {
    const res = await apiClient.get(`/admin/batch-admins/${id}`)
    const payload = unwrap(res)
    return normaliseBatchAdmin(payload.admin || payload)
  },

  /** POST /admin/create-batch-admin */
  createBatchAdmin: async (data) => {
    const res = await apiClient.post('/admin/create-batch-admin', data)
    const payload = unwrap(res)
    return normaliseBatchAdmin(payload.user || payload)
  },

  /** PATCH /admin/batch-admins/:id */
  updateBatchAdmin: async (id, data) => {
    const res = await apiClient.patch(`/admin/batch-admins/${id}`, data)
    const payload = unwrap(res)
    return normaliseBatchAdmin(payload.admin || payload)
  },

  /** DELETE /admin/batch-admins/:id */
  deleteBatchAdmin: async (id) => {
    const res = await apiClient.delete(`/admin/batch-admins/${id}`)
    return unwrap(res)
  },
}
