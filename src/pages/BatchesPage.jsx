import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Plus, Edit3, Trash2, Link2, Copy, Users,
  GraduationCap, Calendar, MoreHorizontal, Check,
  Search, RotateCcw, X, ArrowUpDown,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { batchSchema } from '../lib/validations'
import { batchesApi } from '../api/services'
import Card, { CardHeader, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Modal, { ConfirmModal, PasswordConfirmModal } from '../components/ui/Modal'
import { PageLoader, EmptyState } from '../components/ui/LoadingStates'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { showApiErrorToast } from '../utils'

export default function BatchesPage() {
  const { user } = useAuth()
  const isBatchAdmin = user?.role === 'batch_admin'
  const [modalOpen, setModalOpen] = useState(false)
  const [editBatch, setEditBatch] = useState(null)
  const [deleteBatch, setDeleteBatch] = useState(null)
  const [copiedLink, setCopiedLink] = useState(null)

  // Search, filter, and sort states
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('all')
  const [memberFilter, setMemberFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name-asc')

  const queryClient = useQueryClient()

  const { data: batches, isLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: batchesApi.getAll,
  })

  // Base list depending on user role
  const baseBatches = useMemo(() => {
    return isBatchAdmin
      ? (batches || []).filter((b) => b.id === user?.batchId)
      : (batches || [])
  }, [batches, isBatchAdmin, user?.batchId])

  // Extract unique years from batches for filtering
  const availableYears = useMemo(() => {
    if (!batches || !Array.isArray(batches)) return []
    const yearsSet = new Set()
    batches.forEach((b) => {
      if (b.year && String(b.year).trim()) {
        yearsSet.add(String(b.year).trim())
      }
      const match = (b.name || '').match(/\b(19\d\d|20\d\d)\b/)
      if (match) {
        yearsSet.add(match[0])
      }
    })
    return Array.from(yearsSet).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
  }, [batches])

  // Processed batches after search, filter, and sort
  const processedBatches = useMemo(() => {
    let list = [...baseBatches]

    // 1. Search filter (name, year, description, batchCode)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((b) => {
        const name = (b.name || '').toLowerCase()
        const year = String(b.year || '').toLowerCase()
        const desc = (b.description || '').toLowerCase()
        const code = (b.batchCode || '').toLowerCase()
        return name.includes(q) || year.includes(q) || desc.includes(q) || code.includes(q)
      })
    }

    // 2. Year filter
    if (yearFilter && yearFilter !== 'all') {
      list = list.filter((b) => {
        const yStr = String(b.year || '').trim()
        const nameMatch = (b.name || '').match(/\b(19\d\d|20\d\d)\b/)
        return yStr === yearFilter || (nameMatch && nameMatch[0] === yearFilter)
      })
    }

    // 3. Member count filter
    if (memberFilter === 'has-members') {
      list = list.filter((b) => Number(b.memberCount || 0) > 0)
    } else if (memberFilter === 'no-members') {
      list = list.filter((b) => Number(b.memberCount || 0) === 0)
    }

    // 4. Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' })
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '', undefined, { numeric: true, sensitivity: 'base' })
        case 'year-desc': {
          const getY = (item) => {
            if (item.year && !isNaN(parseInt(item.year, 10))) return parseInt(item.year, 10)
            const m = (item.name || '').match(/\b(19\d\d|20\d\d)\b/)
            return m ? parseInt(m[0], 10) : 0
          }
          const diff = getY(b) - getY(a)
          if (diff !== 0) return diff
          return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true })
        }
        case 'year-asc': {
          const getY = (item) => {
            if (item.year && !isNaN(parseInt(item.year, 10))) return parseInt(item.year, 10)
            const m = (item.name || '').match(/\b(19\d\d|20\d\d)\b/)
            return m ? parseInt(m[0], 10) : 0
          }
          const diff = getY(a) - getY(b)
          if (diff !== 0) return diff
          return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true })
        }
        case 'members-desc': {
          const mA = Number(a.memberCount || 0)
          const mB = Number(b.memberCount || 0)
          if (mB !== mA) return mB - mA
          return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true })
        }
        case 'members-asc': {
          const mA = Number(a.memberCount || 0)
          const mB = Number(b.memberCount || 0)
          if (mA !== mB) return mA - mB
          return (a.name || '').localeCompare(b.name || '', undefined, { numeric: true })
        }
        default:
          return 0
      }
    })

    return list
  }, [baseBatches, search, yearFilter, memberFilter, sortBy])

  const hasActiveFilters = Boolean(
    search.trim() ||
    (yearFilter && yearFilter !== 'all') ||
    (memberFilter && memberFilter !== 'all') ||
    sortBy !== 'name-asc'
  )

  const handleResetFilters = () => {
    setSearch('')
    setYearFilter('all')
    setMemberFilter('all')
    setSortBy('name-asc')
  }

  const createMutation = useMutation({
    mutationFn: batchesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      toast.success('Batch created successfully')
      setModalOpen(false)
      reset()
    },
    onError: (err) => {
      showApiErrorToast(err, 'Failed to create batch')
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
    onError: (err) => {
      showApiErrorToast(err, 'Failed to update batch')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: batchesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] })
      toast.success('Batch deleted successfully')
      setDeleteBatch(null)
    },
    onError: (err) => {
      showApiErrorToast(err, 'Failed to delete batch')
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
            {isBatchAdmin ? 'View details of your assigned batch' : 'Manage batches and generate join links'}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          {baseBatches.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-card)] px-3 py-1.5 rounded-xl border border-[var(--border-color)] shadow-sm">
              <Users className="w-3.5 h-3.5 text-primary-500" />
              <span>
                Showing <strong className="text-[var(--text-primary)]">{processedBatches.length}</strong> of{' '}
                <strong className="text-[var(--text-primary)]">{baseBatches.length}</strong> batches
              </span>
            </div>
          )}
          {!isBatchAdmin && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => { reset(); setModalOpen(true) }}
            >
              Create Batch
            </Button>
          )}
        </div>
      </div>

      {/* Batches Content */}
      {!baseBatches || baseBatches.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={isBatchAdmin ? 'No Assigned Batch' : 'No batches yet'}
          description={isBatchAdmin ? 'You are not assigned to any batch as coordinator.' : 'Create your first batch to start organizing alumni groups'}
          action={
            !isBatchAdmin && (
              <Button variant="primary" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
                Create Batch
              </Button>
            )
          }
        />
      ) : (
        <>
          {/* Search, Filter & Sort Bar */}
          <Card>
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search input with clear button */}
              <div className="relative flex-1">
                <Input
                  icon={Search}
                  placeholder="Search batches by name, year, or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={search ? 'pr-9' : ''}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filters & Sort */}
              <div className="flex flex-wrap sm:flex-nowrap gap-2.5 items-center">
                {/* Year Filter */}
                {availableYears.length > 0 && (
                  <div className="w-full sm:w-36 flex-shrink-0">
                    <Select
                      icon={Calendar}
                      placeholder="All Years"
                      options={[
                        { value: 'all', label: 'All Years' },
                        ...availableYears.map((y) => ({ value: y, label: `Year ${y}` })),
                      ]}
                      value={yearFilter}
                      onChange={(e) => setYearFilter(e.target.value)}
                    />
                  </div>
                )}

                {/* Member Count Filter */}
                <div className="w-full sm:w-44 flex-shrink-0">
                  <Select
                    icon={Users}
                    placeholder="All Batches"
                    options={[
                      { value: 'all', label: 'All Batches' },
                      { value: 'has-members', label: 'With Members' },
                      { value: 'no-members', label: 'No Members' },
                    ]}
                    value={memberFilter}
                    onChange={(e) => setMemberFilter(e.target.value)}
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="w-full sm:w-48 flex-shrink-0">
                  <Select
                    icon={ArrowUpDown}
                    placeholder="Sort by"
                    options={[
                      { value: 'name-asc', label: 'Name (A to Z)' },
                      { value: 'name-desc', label: 'Name (Z to A)' },
                      { value: 'year-desc', label: 'Year (Newest)' },
                      { value: 'year-asc', label: 'Year (Oldest)' },
                      { value: 'members-desc', label: 'Members (High to Low)' },
                      { value: 'members-asc', label: 'Members (Low to High)' },
                    ]}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  />
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={RotateCcw}
                    onClick={handleResetFilters}
                    className="text-xs text-[var(--text-secondary)] hover:text-primary-600 dark:hover:text-primary-400 whitespace-nowrap"
                    title="Reset all filters"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Batches Grid or No Matches State */}
          {processedBatches.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No matching batches found"
              description="No batches match your current search and filter criteria. Try clearing some filters or searching for something else."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  icon={RotateCcw}
                  onClick={handleResetFilters}
                >
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {processedBatches.map((batch, idx) => (
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
                      {!isBatchAdmin && (
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
                            onClick={() => setDeleteBatch(batch)}
                          />
                        </div>
                      )}
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
                    {/* <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
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
                    </div> */}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </>
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

      {/* Password Protected Delete Modal */}
      <PasswordConfirmModal
        isOpen={!!deleteBatch}
        onClose={() => setDeleteBatch(null)}
        title="Delete Batch"
        message="This will permanently delete the batch. Please enter your administrator password to authorize deletion."
        itemName={deleteBatch?.name}
        itemType="Batch"
        confirmText="Delete Batch"
        loading={deleteMutation.isPending}
        onConfirm={(password) => {
          if (deleteBatch) {
            deleteMutation.mutate({ id: deleteBatch.id, password })
          }
        }}
      />
    </div>
  )
}
