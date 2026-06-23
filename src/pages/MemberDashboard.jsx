import { motion } from 'framer-motion'
import {
  CheckCircle2, Clock, CreditCard, Image, Download,
  User, Mail, Phone, MapPin, GraduationCap, Calendar,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import Card, { CardHeader, CardTitle } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import { PageLoader } from '../components/ui/LoadingStates'
import { useAuth } from '../context/AuthContext'
import { membersApi } from '../api/services'
import { formatDate, formatPhone } from '../utils'

export default function MemberDashboard() {
  const { user } = useAuth()

  // Fetch the current user's membership record(s) from the backend
  const { data: memberships, isLoading } = useQuery({
    queryKey: ['my-memberships'],
    queryFn: membersApi.getMy,
    enabled: !!user,
  })

  if (isLoading) return <PageLoader />

  // Use the first membership (most recent if multiple)
  const membership = memberships?.[0]

  // Compose a merged view: auth user data + membership data
  const member = {
    fullName: user?.fullName || '—',
    email: user?.email || '',
    phone: user?.phone || '',
    district: user?.district || '',
    batchName: membership?.batchName || user?.batchName || '—',
    registeredAt: membership?.registeredAt || null,
    approvedAt: membership?.approvedAt || null,
    membershipStatus: membership?.membershipStatus || 'pending',
    paymentStatus: membership?.paymentStatus || 'unpaid',
    posterStatus: membership?.posterStatus || 'not_generated',
    posterUrl: membership?.posterUrl || null,
  }

  const statusSteps = [
    {
      label: 'Registration',
      status: 'completed',
      icon: User,
      detail: 'Submitted',
    },
    {
      label: 'Payment',
      status:
        member.paymentStatus === 'paid' || member.paymentStatus === 'verified'
          ? 'completed'
          : 'pending',
      icon: CreditCard,
      detail:
        member.paymentStatus === 'paid'
          ? 'Paid'
          : member.paymentStatus === 'verified'
          ? 'Verified'
          : 'Awaiting',
    },
    {
      label: 'Approval',
      status:
        member.membershipStatus === 'approved'
          ? 'completed'
          : member.membershipStatus === 'rejected'
          ? 'rejected'
          : 'pending',
      icon: CheckCircle2,
      detail:
        member.membershipStatus === 'approved'
          ? 'Approved'
          : member.membershipStatus === 'rejected'
          ? 'Rejected'
          : 'Pending',
    },
    {
      label: 'Poster',
      status: member.posterStatus === 'ready' ? 'completed' : 'pending',
      icon: Image,
      detail: member.posterStatus === 'ready' ? 'Ready' : 'Pending',
    },
  ]

  const handleDownloadPoster = () => {
    if (member.posterUrl) {
      window.open(member.posterUrl, '_blank')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] font-display">
          My Dashboard
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Track your membership status and manage your profile
        </p>
      </div>

      {/* Status Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Progress</CardTitle>
          <Badge variant={member.membershipStatus} />
        </CardHeader>

        <div className="flex items-center justify-between mt-4">
          {statusSteps.map((step, idx) => {
            const isCompleted = step.status === 'completed'
            const isRejected = step.status === 'rejected'
            const StepIcon = step.icon

            return (
              <div key={step.label} className="flex items-center flex-1">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all ${
                      isCompleted
                        ? 'bg-success/10 text-success'
                        : isRejected
                        ? 'bg-error/10 text-error'
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
                    }`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-[var(--text-primary)]">{step.label}</p>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      isCompleted
                        ? 'text-success'
                        : isRejected
                        ? 'text-error'
                        : 'text-[var(--text-tertiary)]'
                    }`}
                  >
                    {step.detail}
                  </p>
                </motion.div>
                {idx < statusSteps.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] mx-3 mt-[-20px] rounded-full ${
                      isCompleted ? 'bg-success/30' : 'bg-[var(--border-color)]'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <div className="flex items-center gap-4 mb-5">
            <Avatar name={member.fullName} size="lg" />
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] font-display">
                {member.fullName}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">{member.batchName}</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { icon: Mail, label: 'Email', value: member.email },
              { icon: Phone, label: 'Phone', value: formatPhone(member.phone) },
              { icon: MapPin, label: 'District', value: member.district },
              { icon: GraduationCap, label: 'Batch', value: member.batchName },
              { icon: Calendar, label: 'Registered', value: formatDate(member.registeredAt) },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-sm">
                <item.icon className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
                <span className="text-[var(--text-secondary)] w-20 flex-shrink-0">
                  {item.label}
                </span>
                <span className="text-[var(--text-primary)] font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Poster Card */}
        <Card>
          <CardHeader>
            <CardTitle>Membership Poster</CardTitle>
            <Badge variant={member.posterStatus} />
          </CardHeader>

          {member.posterStatus === 'ready' ? (
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/30 dark:to-primary-900/20 rounded-xl flex items-center justify-center border border-[var(--border-color)]">
                {member.posterUrl ? (
                  <img
                    src={member.posterUrl}
                    alt="Membership Poster"
                    className="h-full w-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mb-3">
                      <Image className="w-8 h-8 text-primary-500" />
                    </div>
                    <p className="text-sm font-medium text-[var(--text-primary)] font-display">
                      Poster Ready
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Your membership poster has been generated
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Download}
                  className="flex-1"
                  onClick={handleDownloadPoster}
                >
                  Download
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  Share
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mb-3">
                <Clock className="w-7 h-7 text-[var(--text-tertiary)]" />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {member.membershipStatus === 'approved'
                  ? 'Poster is being generated…'
                  : 'Poster will be generated after approval'}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Please check back later</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
