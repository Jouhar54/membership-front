import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Users, UserCheck, Clock, CreditCard,
  GraduationCap, ShieldCheck,
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
import DeveloperCTA from '../components/common/DeveloperCTA'

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
            Overview of membership campaign progress & system metrics
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

      {/* Stats Grid - Super Admin Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Memberships"
          value={stats?.totalMemberships ?? stats?.total ?? 0}
          icon={Users}
          color="primary"
          trendLabel="all applications"
        />
        <StatCard
          title="Approved Memberships"
          value={stats?.approvedMemberships ?? stats?.approved ?? 0}
          icon={UserCheck}
          color="success"
          trendLabel={`${stats?.pendingMemberships || 0} pending review`}
        />
        <StatCard
          title="Total Batches"
          value={stats?.totalBatches ?? 0}
          icon={GraduationCap}
          color="info"
          trendLabel="active batches"
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={ShieldCheck}
          color="warning"
          trendLabel="admins & coordinators"
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
            {!recentMembers || recentMembers.length === 0 ? (
              <div className="py-8 text-center">
                <Users className="w-8 h-8 text-[var(--text-tertiary)]/40 mx-auto mb-2" />
                <p className="text-sm text-[var(--text-secondary)]">No registrations yet</p>
                <p className="text-xs text-[var(--text-tertiary)]">New member submissions will appear here</p>
              </div>
            ) : (
              recentMembers.map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={member.fullName} size="sm" src={member.profilePhoto} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {member.fullName}
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)] truncate">
                        {[member.batchName, member.registeredAt ? formatDate(member.registeredAt) : null]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={member.membershipStatus} />
                </motion.div>
              ))
            )}
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

      {/* Developer support CTA — admin only */}
      <DeveloperCTA variant="admin" />
    </div>
  )
}
