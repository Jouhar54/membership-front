import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../api/admin.api'

export function useBatchAdmins(filters) {
  return useQuery({
    queryKey: ['batch-admins', filters],
    queryFn: () => adminApi.getBatchAdmins(filters),
    placeholderData: (previousData) => previousData,
  })
}

export function useBatchAdmin(id) {
  return useQuery({
    queryKey: ['batch-admin', id],
    queryFn: () => adminApi.getBatchAdminById(id),
    enabled: !!id,
  })
}

export function useCreateBatchAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminApi.createBatchAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batch-admins'] })
    },
  })
}

export function useUpdateBatchAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => adminApi.updateBatchAdmin(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['batch-admins'] })
      queryClient.invalidateQueries({ queryKey: ['batch-admin', variables.id] })
    },
  })
}

export function useDeleteBatchAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: adminApi.deleteBatchAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batch-admins'] })
    },
  })
}
