import { motion } from 'framer-motion'
import { Download, Share2, Image, CheckCircle2, Clock } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { useAuth } from '../context/AuthContext'
import { dummyUsers } from '../lib/dummyData'
import toast from 'react-hot-toast'

export default function PosterPage() {
  const { user } = useAuth()
  const member = { ...dummyUsers.member, ...user }
  const isReady = member.posterStatus === 'ready' || member.membershipStatus === 'approved'

  const handleDownload = () => {
    toast.success('Poster download started!')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AALIA Membership',
          text: `${member.fullName} is now a member of AALIA!`,
          url: window.location.href,
        })
      } catch {
        // cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      } catch {
        toast.error('Failed to copy link')
      }
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] font-display">
          Membership Poster
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Your personalized AALIA membership poster
        </p>
      </div>

      {isReady ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-success">Poster Ready</span>
              </div>
              <Badge variant="ready" />
            </div>

            {/* Poster Preview */}
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 aspect-[3/4] mb-5">
              {/* Decorative elements */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-300/10 rounded-full blur-3xl" />
                {/* Geometric pattern */}
                <div className="absolute top-8 left-8 w-16 h-16 border border-white/10 rounded-lg rotate-12" />
                <div className="absolute bottom-16 right-8 w-12 h-12 border border-white/10 rounded-full" />
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
                {/* Header */}
                <div className="mb-auto pt-8">
                  <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-xl font-display">A</span>
                  </div>
                  <p className="text-primary-200 text-xs tracking-[0.3em] uppercase font-medium">
                    Alumni Association
                  </p>
                </div>

                {/* Member Info */}
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/20">
                    <span className="text-white text-3xl font-bold font-display">
                      {member.fullName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white font-display">
                      {member.fullName}
                    </h2>
                    <p className="text-primary-200 text-sm mt-1">
                      {member.batchName || 'Al-Falah 2018'}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-medium text-white">Verified Member</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pb-8">
                  <p className="text-primary-300/60 text-[10px] tracking-wider uppercase">
                    AALIA Membership Campaign 2026
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="md"
                icon={Download}
                onClick={handleDownload}
                className="flex-1"
              >
                Download Poster
              </Button>
              <Button
                variant="secondary"
                size="md"
                icon={Share2}
                onClick={handleShare}
                className="flex-1"
              >
                Share
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : (
        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-[var(--text-tertiary)]" />
              </div>
            </motion.div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] font-display mb-2">
              Poster Not Available Yet
            </h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-sm">
              Your membership poster will be generated once your membership is approved and payment is verified. Please check back later.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
