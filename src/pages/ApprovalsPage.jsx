import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Clock, Users, Filter } from 'lucide-react'
import { membersApi } from '../api/services'
import Card, { CardHeader, CardTitle } from '../components/ui/Card'
import DataTable from '../components/tables/DataTable'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import { ConfirmModal } from '../components/ui/Modal'
import RejectReasonModal from '../components/ui/RejectReasonModal'
import { PageLoader, EmptyState } from '../components/ui/LoadingStates'
import { formatDate } from '../utils'
import toast from 'react-hot-toast'

export default function ApprovalsPage() {
  const [confirmAction, setConfirmAction] = useState(null)
  const queryClient = useQueryClient()

  const { data: pendingMembers, isLoading } = useQuery({
    queryKey: ['pending-members'],
    queryFn: membersApi.getPending,
  })

  const approveMutation = useMutation({
    mutationFn: membersApi.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-members'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success('Member approved successfully')
      setConfirmAction(null)
    },
  })

  const rejectMutation = useMutation({
    mutationFn: membersApi.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-members'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success('Member rejected')
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
            <p className="text-xs text-[var(--text-tertiary)]">{row.batchName}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'district',
      label: 'District',
      render: (val) => (
        <span className="text-[var(--text-secondary)] text-sm">{val}</span>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (val) => <Badge variant={val} />,
    },
    {
      key: 'registeredAt',
      label: 'Applied On',
      render: (val) => (
        <span className="text-[var(--text-secondary)] text-sm">{formatDate(val)}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="success"
            size="xs"
            icon={CheckCircle2}
            disabled={row.paymentStatus !== 'paid'}
            className={row.paymentStatus !== 'paid' ? 'opacity-40 cursor-not-allowed' : ''}
            onClick={(e) => {
              e.stopPropagation()
              if (row.paymentStatus !== 'paid') return
              setConfirmAction({ type: 'approve', member: row })
            }}
            title={row.paymentStatus === 'paid' ? 'Approve' : 'Payment required before approval'}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            size="xs"
            icon={XCircle}
            onClick={(e) => {
              e.stopPropagation()
              setConfirmAction({ type: 'reject', member: row })
            }}
          >
            Reject
          </Button>
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
            Pending Approvals
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Review and approve membership applications
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Clock className="w-4 h-4" />
          <span>{pendingMembers?.length || 0} pending</span>
        </div>
      </div>

      {/* Table */}
      <Card padding={false}>
        {pendingMembers?.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="All caught up!"
            description="There are no pending membership applications to review."
          />
        ) : (
          <DataTable
            columns={columns}
            data={pendingMembers || []}
            emptyMessage="No pending approvals"
          />
        )}
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

      {/* Confirm Modal for Approve */}
      <ConfirmModal
        isOpen={confirmAction?.type === 'approve'}
        onClose={() => setConfirmAction(null)}
        title="Approve Member"
        message={`Approve ${confirmAction?.member?.fullName} as a member?`}
        confirmText="Approve"
        variant="success"
        loading={approveMutation.isPending}
        onConfirm={() => {
          if (confirmAction?.type === 'approve') approveMutation.mutate(confirmAction.member.id)
        }}
      />
    </div>
  )
}
