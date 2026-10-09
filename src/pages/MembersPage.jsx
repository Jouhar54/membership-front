import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Search, CheckCircle2, XCircle, CreditCard,
  Eye, Users, RotateCcw,
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
import RejectReasonModal from '../components/ui/RejectReasonModal'
import { PageLoader } from '../components/ui/LoadingStates'
import { formatPhone, formatDate, cn, showApiErrorToast } from '../utils'
import toast from 'react-hot-toast'

export default function MembersPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [batchFilter, setBatchFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
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
    }
  }, [user, isBatchAdmin])

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications', batchFilter],
    queryFn: () => {
      if (isBatchAdmin && user?.batchId) {
        return applicationsApi.getByBatch(user.batchId)
      }
      return applicationsApi.getByBatch(batchFilter || 'all')
    },
  })

  const approveMutation = useMutation({
    mutationFn: applicationsApi.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success('Application approved and poster generated!')
      setConfirmAction(null)
    },
    onError: (err) => {
      showApiErrorToast(err, 'Approval failed.')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: applicationsApi.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success('Application rejected.')
      setConfirmAction(null)
    },
    onError: (err) => {
      showApiErrorToast(err, 'Rejection failed.')
    },
  })

  const markPaidMutation = useMutation({
    mutationFn: applicationsApi.markPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success('Payment marked as paid.')
      setConfirmAction(null)
    },
    onError: (err) => {
      showApiErrorToast(err, 'Marking paid failed.')
    },
  })

  const hasActiveFilters = Boolean(
    search || (!isBatchAdmin && batchFilter) || statusFilter || paymentFilter
  )

  const handleResetFilters = () => {
    setSearch('')
    if (!isBatchAdmin) setBatchFilter('')
    setStatusFilter('')
    setPaymentFilter('')
  }

  // Filter application list client-side
  const filteredApplications = applications.filter((app) => {
    const q = search.toLowerCase().trim()
    const matchesSearch = !q || (
      app.fullName?.toLowerCase().includes(q) ||
      app.email?.toLowerCase().includes(q) ||
      app.phone?.includes(q)
    )
    const matchesStatus = statusFilter ? app.membershipStatus === statusFilter : true
    const matchesPayment = paymentFilter ? app.paymentStatus === paymentFilter : true
    return matchesSearch && matchesStatus && matchesPayment
  })

  const columns = [
    {
      key: 'fullName',
      label: 'Name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.fullName} src={row.profilePhoto} size="sm" />
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
      key: 'bloodGroup',
      label: 'Blood Group',
      render: (val, row) => (
        <span className="text-[var(--text-secondary)] font-medium">{row.bloodGroup || '—'}</span>
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
      render: (val, row) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant={val} />
          {row.membershipStatus === 'rejected' && row.rejectionReason && (
            <span
              className="text-[10px] text-error font-medium px-1.5 py-0.5 rounded bg-error/10 border border-error/20 max-w-[140px] truncate"
              title={`Rejection Reason: ${row.rejectionReason}`}
            >
              {row.rejectionReason}
            </span>
          )}
        </div>
      ),
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
          {row.paymentStatus === 'pending' && row.membershipStatus !== 'rejected' && (
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
                disabled={row.paymentStatus !== 'paid'}
                className={cn(
                  'text-success hover:text-success',
                  row.paymentStatus !== 'paid' && 'opacity-30 cursor-not-allowed hover:bg-transparent text-[var(--text-tertiary)] hover:text-[var(--text-tertiary)]'
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  if (row.paymentStatus !== 'paid') return
                  setConfirmAction({ type: 'approve', member: row })
                }}
                title={row.paymentStatus === 'paid' ? 'Approve' : 'Payment must be marked as paid before approval'}
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-display">
            Membership Applications
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage all incoming applications and approval states
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-card)] px-3 py-1.5 rounded-xl border border-[var(--border-color)] self-start sm:self-auto shadow-sm">
          <Users className="w-3.5 h-3.5 text-primary-500" />
          <span>
            Showing <strong className="text-[var(--text-primary)]">{filteredApplications.length}</strong> of{' '}
            <strong className="text-[var(--text-primary)]">{applications.length}</strong> applications
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-2.5 items-center">
            {!isBatchAdmin && (
              <div className="w-full sm:w-52 flex-shrink-0">
                <Select
                  placeholder="All Batches"
                  options={batches.map((b) => ({ value: b.id, label: b.name }))}
                  value={batchFilter}
                  onChange={(e) => setBatchFilter(e.target.value)}
                />
              </div>
            )}
            <div className="w-full sm:w-36 flex-shrink-0">
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
            <div className="w-full sm:w-36 flex-shrink-0">
              <Select
                placeholder="All Payment"
                options={[
                  { value: 'paid', label: 'Paid' },
                  { value: 'pending', label: 'Pending' },
                ]}
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              />
            </div>
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

      {/* Table */}
      <Card padding={false}>
        <DataTable
          columns={columns}
          data={filteredApplications}
          emptyMessage="No applications found matching your selected filters"
          emptyIcon={Users}
        />
      </Card>

      {/* Reject Reason Modal */}
      <RejectReasonModal
        isOpen={confirmAction?.type === 'reject'}
        onClose={() => setConfirmAction(null)}
        member={confirmAction?.member}
        loading={rejectMutation.isPending}
        onConfirm={({ id, reason }) => {
          rejectMutation.mutate({ id, reason })
        }}
      />

      {/* Confirm Modal for Approve / Mark Paid */}
      <ConfirmModal
        isOpen={!!confirmAction && confirmAction.type !== 'reject'}
        onClose={() => setConfirmAction(null)}
        title={
          confirmAction?.type === 'approve'
            ? 'Approve Application'
            : 'Mark as Paid'
        }
        message={
          confirmAction?.type === 'approve'
            ? `Are you sure you want to approve ${confirmAction?.member?.fullName}? This will generate their member poster.`
            : `Mark payment as received for ${confirmAction?.member?.fullName}?`
        }
        confirmText={
          confirmAction?.type === 'approve' ? 'Approve' : 'Mark Paid'
        }
        variant={confirmAction?.type === 'approve' ? 'success' : 'primary'}
        loading={approveMutation.isPending || markPaidMutation.isPending}
        onConfirm={() => {
          if (confirmAction?.type === 'approve') approveMutation.mutate(confirmAction.member.id)
          if (confirmAction?.type === 'pay') markPaidMutation.mutate(confirmAction.member.id)
        }}
      />

      {/* View Details Modal */}
      <Modal
        isOpen={!!viewApplication}
        onClose={() => setViewApplication(null)}
        title="Application Details"
        size="lg"
      >
        {viewApplication && (
          <div className="space-y-5">
            {/* Header with Photo */}
            <div className="flex items-center gap-4 p-3 bg-[var(--bg-tertiary)]/60 rounded-xl border border-[var(--border-color)]">
              <Avatar name={viewApplication.fullName} src={viewApplication.profilePhoto} size="lg" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[var(--text-primary)] font-display text-lg truncate">
                  {viewApplication.fullName}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">{viewApplication.batchName}</p>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  <Badge variant={viewApplication.membershipStatus} />
                  <Badge variant={viewApplication.paymentStatus} />
                </div>
              </div>
            </div>

            {/* Rejection Details Banner if Rejected */}
            {viewApplication.membershipStatus === 'rejected' && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-error font-semibold text-xs uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" />
                    Application Rejected
                  </span>
                  {viewApplication.rejectedAt && (
                    <span className="text-[var(--text-tertiary)] font-normal text-[11px] lowercase first-letter:uppercase">
                      {formatDate(viewApplication.rejectedAt)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-primary)] mt-1">
                  <span className="text-[var(--text-tertiary)] font-medium">Reason: </span>
                  <span className="font-medium text-error">{viewApplication.rejectionReason || 'No specific reason provided'}</span>
                </p>
              </div>
            )}

            {/* Personal & Contact Grid */}
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider text-[11px] text-primary-600 dark:text-primary-400">
                  Personal & Academic Info
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[var(--bg-tertiary)]/30 p-3 rounded-xl border border-[var(--border-color)]">
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Father's Name</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.fatherName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Date of Birth</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.dob ? formatDate(viewApplication.dob) : '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Blood Group</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.bloodGroup || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Job Type / Profession</span>
                    <span className="font-medium text-[var(--text-primary)]">
                      {viewApplication.jobType === 'Others' && viewApplication.jobTypeOther
                        ? `Other (${viewApplication.jobTypeOther})`
                        : viewApplication.jobType || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Batch</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.batchName || '—'}</span>
                  </div>
                  {viewApplication.membershipId && (
                    <div>
                      <span className="text-[var(--text-tertiary)] block">Membership ID</span>
                      <span className="font-bold text-success">{viewApplication.membershipId}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider text-[11px] text-primary-600 dark:text-primary-400">
                  Contact Information
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[var(--bg-tertiary)]/30 p-3 rounded-xl border border-[var(--border-color)]">
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Mobile (Mob)</span>
                    <span className="font-medium text-[var(--text-primary)]">{formatPhone(viewApplication.phone)}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">WhatsApp</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.whatsapp ? formatPhone(viewApplication.whatsapp) : '—'}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[var(--text-tertiary)] block">Email</span>
                    <span className="font-medium text-[var(--text-primary)] break-all">{viewApplication.email || '—'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider text-[11px] text-primary-600 dark:text-primary-400">
                  Address & Local Body
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[var(--bg-tertiary)]/30 p-3 rounded-xl border border-[var(--border-color)]">
                  <div>
                    <span className="text-[var(--text-tertiary)] block">House Name</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.houseName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Place</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.place || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Post Office</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.post || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">PIN Code</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.pin || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Panchayath</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.panchayath || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Mandalam</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.mandalam || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Thalukk (Taluk)</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.thaluk || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">District</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.district || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">State</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.state || 'Kerala'}</span>
                  </div>
                </div>
              </div>

              {/* Payment Proof / Screenshot */}
              {(viewApplication.paymentScreenshot || viewApplication.paymentProof) && (
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider text-[11px] text-primary-600 dark:text-primary-400">
                    Payment Proof / Screenshot
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3 items-center bg-[var(--bg-tertiary)]/30 p-3 rounded-xl border border-[var(--border-color)]">
                    <a
                      href={viewApplication.paymentScreenshot || viewApplication.paymentProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0"
                    >
                      <img
                        src={viewApplication.paymentScreenshot || viewApplication.paymentProof}
                        alt="Payment Screenshot"
                        className="h-24 w-auto max-w-[160px] rounded-lg border border-[var(--border-color)] bg-white dark:bg-slate-900 object-contain p-1 shadow-sm hover:opacity-90 transition-opacity"
                      />
                    </a>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs text-[var(--text-primary)] font-medium">
                        Payment receipt / transaction screenshot submitted by applicant.
                      </p>
                      <a
                        href={viewApplication.paymentScreenshot || viewApplication.paymentProof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                      >
                        Open Full Image &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Declaration & Signature */}
              <div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider text-[11px] text-primary-600 dark:text-primary-400">
                  Declaration & Signature
                </h4>
                <div className="flex flex-col sm:flex-row gap-3 items-start bg-[var(--bg-tertiary)]/30 p-3 rounded-xl border border-[var(--border-color)]">
                  <div className="flex-1 space-y-1">
                    <p className="text-[var(--text-secondary)] italic">
                      "I accept and agree to be bound by the bylaw of AALIA and Anvariyya."
                    </p>
                    <p className="text-[var(--text-tertiary)]">
                      Declaration Date:{' '}
                      <span className="font-medium text-[var(--text-primary)]">
                        {viewApplication.declarationDate ? formatDate(viewApplication.declarationDate) : formatDate(viewApplication.registeredAt)}
                      </span>
                    </p>
                  </div>
                  {viewApplication.signature && (
                    <div className="flex-shrink-0">
                      <span className="text-[var(--text-tertiary)] block mb-1">Signature:</span>
                      <img
                        src={viewApplication.signature}
                        alt="Member Signature"
                        className="h-12 w-auto max-w-[140px] rounded border border-[var(--border-color)] bg-white dark:bg-slate-900 object-contain p-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
