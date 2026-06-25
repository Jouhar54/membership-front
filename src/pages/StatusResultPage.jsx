import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Clock, CheckCircle2, XCircle, Download, ArrowLeft, AlertCircle } from 'lucide-react'
import { applicationsApi } from '../api/services'
import { PageLoader } from '../components/ui/LoadingStates'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

export default function StatusResultPage() {
  const { id } = useParams()

  const { data: application, isLoading, error } = useQuery({
    queryKey: ['application-status', id],
    queryFn: () => applicationsApi.getById(id),
    retry: 1,
  })

  if (isLoading) return <PageLoader />

  if (error || !application) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-error-50 dark:bg-error-950/30 text-error mb-2">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] font-display">
          Application Not Found
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
          The requested application could not be retrieved. Please check the URL or try searching again.
        </p>
        <Link to="/status-check" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Status Check
        </Link>
      </div>
    )
  }

  const {
    fullName,
    email,
    phone,
    district,
    batchName,
    paymentStatus,
    membershipStatus,
    membershipId,
    posterUrl,
  } = application

  // Determine which status visual and message to display
  let statusIcon = <Clock className="w-12 h-12 text-warning animate-pulse" />
  let statusTitle = 'Under Review'
  let statusDescription = 'Your application is under review'
  let statusColorClass = 'text-warning bg-warning-50 dark:bg-warning-950/20'

  if (membershipStatus === 'rejected') {
    statusIcon = <XCircle className="w-12 h-12 text-error" />
    statusTitle = 'Rejected'
    statusDescription = 'Application rejected'
    statusColorClass = 'text-error bg-error-50 dark:bg-error-950/20'
  } else if (membershipStatus === 'approved') {
    statusIcon = <CheckCircle2 className="w-12 h-12 text-success" />
    statusTitle = 'Approved'
    statusDescription = `Welcome to the Alumni Association! Your Membership ID is ${membershipId || 'Generating...'}`
    statusColorClass = 'text-success bg-success-50 dark:bg-success-950/20'
  } else if (paymentStatus === 'paid' && membershipStatus === 'pending') {
    statusIcon = <CheckCircle2 className="w-12 h-12 text-info" />
    statusTitle = 'Payment Verified'
    statusDescription = 'Payment received. Waiting for approval'
    statusColorClass = 'text-info bg-info-50 dark:bg-info-950/20'
  }

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
  const posterDownloadEndpoint = `${apiBaseUrl}/applications/poster/${id}`

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          to="/status-check"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Status Check</span>
        </Link>
        <Badge variant={membershipStatus} />
      </div>

      {/* Main Status Header */}
      <div className={`p-6 rounded-2xl flex flex-col items-center text-center space-y-4 ${statusColorClass} border border-current/10`}>
        {statusIcon}
        <div>
          <h2 className="text-xl font-bold font-display">{statusTitle}</h2>
          <p className="text-sm mt-1 opacity-90">{statusDescription}</p>
        </div>
      </div>

      {/* Application Details Card */}
      <Card>
        <h3 className="text-base font-semibold text-[var(--text-primary)] font-display mb-4 border-b border-[var(--border-color)] pb-2">
          Application Details
        </h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
          <div>
            <span className="block text-xs text-[var(--text-tertiary)] uppercase font-semibold">Full Name</span>
            <span className="font-medium text-[var(--text-primary)]">{fullName}</span>
          </div>
          <div>
            <span className="block text-xs text-[var(--text-tertiary)] uppercase font-semibold">Batch</span>
            <span className="font-medium text-[var(--text-primary)]">{batchName}</span>
          </div>
          <div>
            <span className="block text-xs text-[var(--text-tertiary)] uppercase font-semibold">Email</span>
            <span className="font-medium text-[var(--text-primary)] truncate block">{email}</span>
          </div>
          <div>
            <span className="block text-xs text-[var(--text-tertiary)] uppercase font-semibold">Phone</span>
            <span className="font-medium text-[var(--text-primary)]">{phone}</span>
          </div>
          <div>
            <span className="block text-xs text-[var(--text-tertiary)] uppercase font-semibold">District</span>
            <span className="font-medium text-[var(--text-primary)]">{district}</span>
          </div>
          <div>
            <span className="block text-xs text-[var(--text-tertiary)] uppercase font-semibold">Payment</span>
            <span className="inline-block mt-0.5"><Badge variant={paymentStatus} /></span>
          </div>
        </div>
      </Card>

      {/* Poster Preview and Download (If Approved) */}
      {membershipStatus === 'approved' && (
        <Card className="flex flex-col items-center space-y-4">
          <h3 className="text-base font-semibold text-[var(--text-primary)] font-display self-start border-b border-[var(--border-color)] pb-2 w-full">
            Your Alumni Poster
          </h3>
          <div className="w-full max-w-[280px] aspect-[4/5] rounded-xl overflow-hidden shadow-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] relative group">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt="Alumni Poster"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                <Clock className="w-8 h-8 text-[var(--text-tertiary)] mb-2 animate-spin" />
                <span className="text-xs text-[var(--text-tertiary)]">Generating your poster...</span>
              </div>
            )}
          </div>
          <Button
            variant="primary"
            className="w-full"
            icon={Download}
            onClick={() => window.open(posterDownloadEndpoint, '_blank')}
          >
            Download Poster
          </Button>
        </Card>
      )}
    </div>
  )
}
