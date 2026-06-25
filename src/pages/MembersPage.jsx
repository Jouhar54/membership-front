import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Search, CheckCircle2, XCircle, CreditCard,
  Eye, Users,
} from 'lucide-react'
import { applicationsApi, batchesApi } from '../api/services'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import DataTable from '../components/tables/DataTable'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { ConfirmModal } from '../components/ui/Modal'
import Modal from '../components/ui/Modal'
import { PageLoader } from '../components/ui/LoadingStates'
import { formatPhone, formatDate } from '../utils'
import toast from 'react-hot-toast'

export default function MembersPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [batchFilter, setBatchFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [confirmAction, setConfirmAction] = useState(null)
  const [viewApplication, setViewApplication] = useState(null)
  const queryClient = useQueryClient()

  const isBatchAdmin = user?.role === 'batch_admin'

  const { data: batches = [] } = useQuery({
    queryKey: ['batches'],
    queryFn: batchesApi.getAll,
  })

  // Set default batch filter depending on role
  useEffect(() => {
    if (isBatchAdmin && user?.batchId) {
      setBatchFilter(user.batchId)
    } else if (!isBatchAdmin && batches.length > 0 && !batchFilter) {
      setBatchFilter(batches[0].id)
    }
  }, [user, batches, batchFilter, isBatchAdmin])

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications', batchFilter],
    queryFn: () => {
      if (!batchFilter) return []
      return applicationsApi.getByBatch(batchFilter)
    },
    enabled: !!batchFilter,
  })

  const approveMutation = useMutation({
    mutationFn: applicationsApi.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      toast.success('Application approved and poster generated!')
      setConfirmAction(null)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Approval failed.')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: applicationsApi.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      toast.success('Application rejected.')
      setConfirmAction(null)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Rejection failed.')
    },
  })

  const markPaidMutation = useMutation({
    mutationFn: applicationsApi.markPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      toast.success('Payment marked as paid.')
      setConfirmAction(null)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Marking paid failed.')
    },
  })

  // Filter application list client-side
  const filteredApplications = applications.filter((app) => {
    const q = search.toLowerCase()
    const matchesSearch =
      app.fullName.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.phone.includes(q)
    const matchesStatus = statusFilter ? app.membershipStatus === statusFilter : true
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      key: 'fullName',
      label: 'Name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.fullName} size="sm" />
          <span className="font-medium text-[var(--text-primary)]">{row.fullName}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (val) => (
        <span className="text-[var(--text-secondary)]">{formatPhone(val)}</span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (val) => (
        <span className="text-[var(--text-secondary)]">{val}</span>
      ),
    },
    {
      key: 'batchName',
      label: 'Batch',
      render: (val) => (
        <span className="text-[var(--text-secondary)] text-xs font-medium">{val}</span>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      render: (val) => <Badge variant={val} />,
    },
    {
      key: 'membershipStatus',
      label: 'Membership Status',
      render: (val) => <Badge variant={val} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="xs"
            icon={Eye}
            onClick={(e) => { e.stopPropagation(); setViewApplication(row) }}
            title="View Details"
          />
          {row.paymentStatus === 'pending' && (
            <Button
              variant="ghost"
              size="xs"
              icon={CreditCard}
              onClick={(e) => {
                e.stopPropagation()
                setConfirmAction({ type: 'pay', member: row })
              }}
              title="Mark Paid"
            />
          )}
          {row.membershipStatus === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="xs"
                icon={CheckCircle2}
                className="text-success hover:text-success"
                onClick={(e) => {
                  e.stopPropagation()
                  setConfirmAction({ type: 'approve', member: row })
                }}
                title="Approve"
              />
              <Button
                variant="ghost"
                size="xs"
                icon={XCircle}
                className="text-error hover:text-error"
                onClick={(e) => {
                  e.stopPropagation()
                  setConfirmAction({ type: 'reject', member: row })
                }}
                title="Reject"
              />
            </>
          )}
        </div>
      ),
    },
  ]

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] font-display">
          Membership Applications
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage all incoming applications and approval states
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            {!isBatchAdmin && (
              <Select
                placeholder="Select Batch"
                options={batches.map((b) => ({ value: b.id, label: b.name }))}
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
              />
            )}
            <Select
              placeholder="All Status"
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding={false}>
        <DataTable
          columns={columns}
          data={filteredApplications}
          emptyMessage="No applications found matching your filters"
          emptyIcon={Users}
        />
      </Card>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title={
          confirmAction?.type === 'approve'
            ? 'Approve Application'
            : confirmAction?.type === 'reject'
            ? 'Reject Application'
            : 'Mark as Paid'
        }
        message={
          confirmAction?.type === 'approve'
            ? `Are you sure you want to approve ${confirmAction?.member?.fullName}? This will generate their member poster.`
            : confirmAction?.type === 'reject'
            ? `Are you sure you want to reject ${confirmAction?.member?.fullName}? This action cannot be undone.`
            : `Mark payment as received for ${confirmAction?.member?.fullName}?`
        }
        confirmText={
          confirmAction?.type === 'approve' ? 'Approve' : confirmAction?.type === 'reject' ? 'Reject' : 'Mark Paid'
        }
        variant={confirmAction?.type === 'reject' ? 'danger' : confirmAction?.type === 'approve' ? 'success' : 'primary'}
        loading={approveMutation.isPending || rejectMutation.isPending || markPaidMutation.isPending}
        onConfirm={() => {
          if (confirmAction?.type === 'approve') approveMutation.mutate(confirmAction.member.id)
          if (confirmAction?.type === 'reject') rejectMutation.mutate(confirmAction.member.id)
          if (confirmAction?.type === 'pay') markPaidMutation.mutate(confirmAction.member.id)
        }}
      />

      {/* View Details Modal */}
      <Modal
        isOpen={!!viewApplication}
        onClose={() => setViewApplication(null)}
        title="Application details"
        size="md"
      >
        {viewApplication && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={viewApplication.fullName} size="lg" />
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] font-display">
                  {viewApplication.fullName}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">{viewApplication.batchName}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[var(--text-tertiary)]">Email</p>
                <p className="font-medium text-[var(--text-primary)]">{viewApplication.email}</p>
              </div>
              <div>
                <p className="text-[var(--text-tertiary)]">Phone</p>
                <p className="font-medium text-[var(--text-primary)]">{formatPhone(viewApplication.phone)}</p>
              </div>
              <div>
                <p className="text-[var(--text-tertiary)]">District</p>
                <p className="font-medium text-[var(--text-primary)]">{viewApplication.district}</p>
              </div>
              <div>
                <p className="text-[var(--text-tertiary)]">Submitted</p>
                <p className="font-medium text-[var(--text-primary)]">{formatDate(viewApplication.registeredAt)}</p>
              </div>
              <div>
                <p className="text-[var(--text-tertiary)]">Payment Status</p>
                <Badge variant={viewApplication.paymentStatus} />
              </div>
              <div>
                <p className="text-[var(--text-tertiary)]">Membership Status</p>
                <Badge variant={viewApplication.membershipStatus} />
              </div>
              {viewApplication.membershipId && (
                <div>
                  <p className="text-[var(--text-tertiary)]">Membership ID</p>
                  <p className="font-medium text-success">{viewApplication.membershipId}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
