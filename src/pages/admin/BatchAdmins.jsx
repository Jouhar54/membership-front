import { useState } from 'react'
import { Plus, Search, ShieldCheck, Mail, Phone, Calendar, GraduationCap } from 'lucide-react'
import toast from 'react-hot-toast'

import {
  useBatchAdmins,
  useCreateBatchAdmin,
  useUpdateBatchAdmin,
  useDeleteBatchAdmin,
} from '../../hooks/useBatchAdmins'
import BatchAdminForm from '../../components/forms/BatchAdminForm'
import BatchAdminTable from '../../components/tables/BatchAdminTable'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal, { ConfirmModal } from '../../components/ui/Modal'
import DeveloperCTA from '../../components/common/DeveloperCTA'

export default function BatchAdmins() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [viewingAdmin, setViewingAdmin] = useState(null)
  const [deletingAdmin, setDeletingAdmin] = useState(null)

  // Fetch Batch Admins
  const { data, isLoading } = useBatchAdmins({ search, page, limit: 10 })
  const { admins = [], totalPages = 1, total = 0 } = data || {}

  // Mutations
  const createMutation = useCreateBatchAdmin()
  const updateMutation = useUpdateBatchAdmin()
  const deleteMutation = useDeleteBatchAdmin()

  const handleMutationError = (err, fallback) => {
    const errorData = err.response?.data
    if (errorData?.errors && Array.isArray(errorData.errors)) {
      errorData.errors.forEach((e) => {
        toast.error(e.msg || e.message || 'Validation error')
      })
    } else if (errorData?.message) {
      toast.error(errorData.message)
    } else {
      toast.error(fallback)
    }
  }

  const handleCreateSubmit = (formData) => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Batch admin created successfully')
        setIsCreateOpen(false)
      },
      onError: (err) => {
        handleMutationError(err, 'Failed to create batch admin')
      },
    })
  }

  const handleEditSubmit = (formData) => {
    updateMutation.mutate(
      { id: editingAdmin.id, data: formData },
      {
        onSuccess: () => {
          toast.success('Batch admin updated successfully')
          setEditingAdmin(null)
        },
        onError: (err) => {
          handleMutationError(err, 'Failed to update batch admin')
        },
      }
    )
  }

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(deletingAdmin.id, {
      onSuccess: () => {
        toast.success('Batch admin deleted successfully')
        setDeletingAdmin(null)
      },
      onError: (err) => {
        handleMutationError(err, 'Failed to delete batch admin')
      },
    })
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1) // Reset to first page on search
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-display">
            Batch Admins
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage admins and their assigned batches
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsCreateOpen(true)}
        >
          Add Batch Admin
        </Button>
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl shadow-[var(--shadow-sm)]">
        <div className="relative w-full sm:max-w-xs">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={handleSearchChange}
            icon={Search}
            className="w-full"
          />
        </div>
        <div className="text-xs text-[var(--text-secondary)] font-medium">
          Showing {admins.length} of {total} batch admins
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-10 bg-[var(--bg-tertiary)] rounded-xl w-full" />
          <div className="h-12 bg-[var(--bg-card)] rounded-xl w-full" />
          <div className="h-12 bg-[var(--bg-card)] rounded-xl w-full" />
          <div className="h-12 bg-[var(--bg-card)] rounded-xl w-full" />
        </div>
      ) : (
        <div className="space-y-4">
          <BatchAdminTable
            admins={admins}
            onView={(admin) => setViewingAdmin(admin)}
            onEdit={(admin) => setEditingAdmin(admin)}
            onDelete={(admin) => setDeletingAdmin(admin)}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </Button>
              <span className="text-xs text-[var(--text-secondary)] font-medium">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Developer support CTA — admin only */}
      <DeveloperCTA variant="admin" />

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Batch Admin"
        size="md"
      >
        <BatchAdminForm
          onSubmit={handleCreateSubmit}
          isPending={createMutation.isPending}
          isEdit={false}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingAdmin}
        onClose={() => setEditingAdmin(null)}
        title="Edit Batch Admin"
        size="md"
      >
        {editingAdmin && (
          <BatchAdminForm
            defaultValues={{
              fullName: editingAdmin.fullName,
              email: editingAdmin.email,
              phone: editingAdmin.phone,
              batchId: editingAdmin.batchId,
            }}
            onSubmit={handleEditSubmit}
            isPending={updateMutation.isPending}
            isEdit={true}
          />
        )}
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={!!viewingAdmin}
        onClose={() => setViewingAdmin(null)}
        title="Batch Admin Details"
        size="md"
      >
        {viewingAdmin && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-[var(--border-color)]">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl font-bold font-display shadow-md">
                {viewingAdmin.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] font-display uppercase">
                  {viewingAdmin.fullName}
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-950 text-primary-800 dark:text-primary-400 mt-1 border border-primary-200 dark:border-primary-900/50">
                  Batch Admin
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                <Mail className="w-5 h-5 text-[var(--text-tertiary)]" />
                <div className="min-w-0">
                  <p className="text-[10px] text-[var(--text-tertiary)] font-semibold uppercase tracking-wider">Email</p>
                  <p className="text-sm text-[var(--text-primary)] truncate font-medium">{viewingAdmin.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                <Phone className="w-5 h-5 text-[var(--text-tertiary)]" />
                <div>
                  <p className="text-[10px] text-[var(--text-tertiary)] font-semibold uppercase tracking-wider">Phone</p>
                  <p className="text-sm text-[var(--text-primary)] font-medium">{viewingAdmin.phone || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                <GraduationCap className="w-5 h-5 text-[var(--text-tertiary)]" />
                <div>
                  <p className="text-[10px] text-[var(--text-tertiary)] font-semibold uppercase tracking-wider">Assigned Batch</p>
                  <p className="text-sm text-[var(--text-primary)] font-medium">
                    {viewingAdmin.batchName || '—'}{' '}
                    {viewingAdmin.batchCode && (
                      <span className="text-xs text-[var(--text-tertiary)]">({viewingAdmin.batchCode})</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                <Calendar className="w-5 h-5 text-[var(--text-tertiary)]" />
                <div>
                  <p className="text-[10px] text-[var(--text-tertiary)] font-semibold uppercase tracking-wider">Created At</p>
                  <p className="text-sm text-[var(--text-primary)] font-medium">
                    {viewingAdmin.createdAt
                      ? new Date(viewingAdmin.createdAt).toLocaleString()
                      : '—'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--border-color)]">
              <Button variant="secondary" size="sm" onClick={() => setViewingAdmin(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingAdmin}
        onClose={() => setDeletingAdmin(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Batch Admin"
        message={`Are you sure you want to delete ${deletingAdmin?.fullName}? This admin will lose access to the panel and their batch coordinator status will be updated.`}
        confirmText="Delete Admin"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
