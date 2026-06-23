import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Plus, Edit3, Trash2, Link2, Copy, Users,
  GraduationCap, Calendar, MoreHorizontal, Check,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { batchSchema } from '../lib/validations'
import { batchesApi } from '../api/services'
import Card, { CardHeader, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import { ConfirmModal } from '../components/ui/Modal'
import { PageLoader, EmptyState } from '../components/ui/LoadingStates'
import toast from 'react-hot-toast'

export default function BatchesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editBatch, setEditBatch] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [copiedLink, setCopiedLink] = useState(null)
  const queryClient = useQueryClient()

  const { data: batches, isLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: batchesApi.getAll,
  })

  const createMutation = useMutation({
    mutationFn: batchesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      toast.success('Batch created successfully')
      setModalOpen(false)
      reset()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => batchesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      toast.success('Batch updated successfully')
      setEditBatch(null)
      reset()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: batchesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      toast.success('Batch deleted')
      setDeleteId(null)
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(batchSchema),
    defaultValues: { name: '', year: '', description: '' },
  })

  const onSubmit = (data) => {
    if (editBatch) {
      updateMutation.mutate({ id: editBatch.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const openEdit = (batch) => {
    setEditBatch(batch)
    setValue('name', batch.name)
    setValue('year', batch.year)
    setValue('description', batch.description || '')
  }

  const handleCopyLink = async (batch) => {
    const link = `${window.location.origin}/join/${batch.joinCode}`
    try {
      await navigator.clipboard.writeText(link)
      setCopiedLink(batch.id)
      toast.success('Join link copied!')
      setTimeout(() => setCopiedLink(null), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-display">
            Batches
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage batches and generate join links
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => { reset(); setModalOpen(true) }}
        >
          Create Batch
        </Button>
      </div>

      {/* Batches Grid */}
      {batches?.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No batches yet"
          description="Create your first batch to start organizing alumni groups"
          action={
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
              Create Batch
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches?.map((batch, idx) => (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card hover className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={Edit3}
                      onClick={() => openEdit(batch)}
                    />
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={Trash2}
                      className="text-error hover:text-error"
                      onClick={() => setDeleteId(batch.id)}
                    />
                  </div>
                </div>

                <h3 className="font-semibold text-[var(--text-primary)] font-display mb-1">
                  {batch.name}
                </h3>
                {batch.description && (
                  <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2">
                    {batch.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)] mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {batch.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {batch.memberCount} members
                  </span>
                </div>

                {/* Join Link */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                  <Link2 className="w-3.5 h-3.5 text-[var(--text-tertiary)] flex-shrink-0" />
                  <span className="text-xs text-[var(--text-secondary)] truncate flex-1 font-mono">
                    /join/{batch.joinCode}
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={copiedLink === batch.id ? Check : Copy}
                    onClick={() => handleCopyLink(batch)}
                    className={copiedLink === batch.id ? 'text-success' : ''}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen || !!editBatch}
        onClose={() => { setModalOpen(false); setEditBatch(null); reset() }}
        title={editBatch ? 'Edit Batch' : 'Create New Batch'}
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Batch Name"
            placeholder="e.g., Al-Falah 2024"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Year"
            placeholder="e.g., 2024"
            error={errors.year?.message}
            {...register('year')}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[var(--text-secondary)]">
              Description
            </label>
            <textarea
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all duration-200 min-h-[80px] resize-none"
              placeholder="Optional description..."
              {...register('description')}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { setModalOpen(false); setEditBatch(null); reset() }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editBatch ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Batch"
        message="Are you sure you want to delete this batch? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteId)}
      />
    </div>
  )
}
