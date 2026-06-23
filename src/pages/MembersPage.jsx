import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Search, Filter, CheckCircle2, XCircle, CreditCard,
  Eye, MoreHorizontal, Users,
} from 'lucide-react'
import { membersApi, batchesApi } from '../api/services'
import Card, { CardHeader, CardTitle } from '../components/ui/Card'
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
  const [search, setSearch] = useState('')
  const [batchFilter, setBatchFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [confirmAction, setConfirmAction] = useState(null)
  const [viewMember, setViewMember] = useState(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['members', search, batchFilter, statusFilter],
    queryFn: () => membersApi.getAll({ search, batch: batchFilter, status: statusFilter }),
  })

  const { data: batches = [] } = useQuery({
    queryKey: ['batches'],
    queryFn: batchesApi.getAll,
  })

  const approveMutation = useMutation({
    mutationFn: membersApi.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
      toast.success('Member approved successfully')
      setConfirmAction(null)
    },
  })

  const rejectMutation = useMutation({
    mutationFn: membersApi.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
      toast.success('Member rejected')
      setConfirmAction(null)
    },
  })

  const markPaidMutation = useMutation({
    mutationFn: membersApi.markPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
      toast.success('Payment marked as paid')
      setConfirmAction(null)
    },
  })

  const columns = [
    {
      key: 'fullName',
      label: 'Member',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.fullName} size="sm" />
          <div>
            <p className="font-medium text-[var(--text-primary)]">{row.fullName}</p>
            <p className="text-xs text-[var(--text-tertiary)]">{row.email}</p>
          </div>
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
      key: 'batchName',
      label: 'Batch',
      render: (val) => (
        <span className="text-[var(--text-secondary)] text-xs font-medium">{val}</span>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (val) => <Badge variant={val} />,
    },
    {
      key: 'membershipStatus',
      label: 'Status',
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
            onClick={(e) => { e.stopPropagation(); setViewMember(row) }}
            title="View profile"
          />
          {row.paymentStatus === 'unpaid' && (
            <Button
              variant="ghost"
              size="xs"
              icon={CreditCard}
              onClick={(e) => {
                e.stopPropagation()
                setConfirmAction({ type: 'pay', member: row })
              }}
              title="Mark as paid"
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
          Members
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage all registered members
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
            <Select
              placeholder="All Batches"
              options={batches.map((b) => ({ value: b.id, label: b.name }))}
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
            />
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
          data={data?.members || []}
          emptyMessage="No members found matching your filters"
          emptyIcon={Users}
        />
      </Card>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title={
          confirmAction?.type === 'approve'
            ? 'Approve Member'
            : confirmAction?.type === 'reject'
            ? 'Reject Member'
            : 'Mark as Paid'
        }
        message={
          confirmAction?.type === 'approve'
            ? `Are you sure you want to approve ${confirmAction?.member?.fullName}?`
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

      {/* View Member Modal */}
      <Modal
        isOpen={!!viewMember}
        onClose={() => setViewMember(null)}
        title="Member Profile"
        size="md"
      >
        {viewMember && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={viewMember.fullName} size="lg" />
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] font-display">
                  {viewMember.fullName}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">{viewMember.batchName}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[var(--text-tertiary)]">Email</p>
                <p className="font-medium text-[var(--text-primary)]">{viewMember.email}</p>
              </div>
              <div>
                <p className="text-[var(--text-tertiary)]">Phone</p>
                <p className="font-medium text-[var(--text-primary)]">{formatPhone(viewMember.phone)}</p>
              </div>
              <div>
                <p className="text-[var(--text-tertiary)]">District</p>
                <p className="font-medium text-[var(--text-primary)]">{viewMember.district}</p>
              </div>
              <div>
                <p className="text-[var(--text-tertiary)]">Registered</p>
                <p className="font-medium text-[var(--text-primary)]">{formatDate(viewMember.registeredAt)}</p>
              </div>
              <div>
                <p className="text-[var(--text-tertiary)]">Payment</p>
                <Badge variant={viewMember.paymentStatus} />
              </div>
              <div>
                <p className="text-[var(--text-tertiary)]">Membership</p>
                <Badge variant={viewMember.membershipStatus} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
