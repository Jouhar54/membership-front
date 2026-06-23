import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Users, UserCheck, Clock, CreditCard,
  TrendingUp, ArrowRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/ui/StatCard'
import Card, { CardHeader, CardTitle } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import { PageLoader } from '../components/ui/LoadingStates'
import { membersApi } from '../api/services'
import { formatDate } from '../utils'

export default function AdminDashboard() {
  const navigate = useNavigate()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: membersApi.getStats,
  })

  const { data: recentMembers, isLoading: recentLoading } = useQuery({
    queryKey: ['recent-members'],
    queryFn: membersApi.getRecent,
  })

  const { data: pendingMembers, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-members'],
    queryFn: membersApi.getPending,
  })

  if (statsLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-display">
            Dashboard
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Overview of membership campaign progress
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={TrendingUp}
          onClick={() => navigate('/admin/members')}
        >
          View All Members
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={stats?.total || 0}
          icon={Users}
          color="primary"
          trendLabel="all time"
        />
        <StatCard
          title="Pending Approval"
          value={stats?.pending || 0}
          icon={Clock}
          color="warning"
          trendLabel="awaiting review"
        />
        <StatCard
          title="Approved"
          value={stats?.approved || 0}
          icon={UserCheck}
          color="success"
          trendLabel="active members"
        />
        <StatCard
          title="Payments Received"
          value={stats?.paid || 0}
          icon={CreditCard}
          color="info"
          trendLabel="verified payments"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
            <Button
              variant="ghost"
              size="xs"
              iconRight={ArrowRight}
              onClick={() => navigate('/admin/members')}
            >
              View all
            </Button>
          </CardHeader>
          <div className="space-y-3">
            {recentMembers?.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={member.fullName} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {member.fullName}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {member.batchName} · {formatDate(member.registeredAt)}
                    </p>
                  </div>
                </div>
                <Badge variant={member.membershipStatus} />
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <Button
              variant="ghost"
              size="xs"
              iconRight={ArrowRight}
              onClick={() => navigate('/admin/approvals')}
            >
              View all
            </Button>
          </CardHeader>
          <div className="space-y-3">
            {pendingMembers?.length === 0 ? (
              <div className="py-8 text-center">
                <UserCheck className="w-8 h-8 text-success/40 mx-auto mb-2" />
                <p className="text-sm text-[var(--text-secondary)]">All caught up!</p>
                <p className="text-xs text-[var(--text-tertiary)]">No pending approvals</p>
              </div>
            ) : (
              pendingMembers?.slice(0, 5).map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={member.fullName} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {member.fullName}
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        {member.batchName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.paymentStatus} />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
