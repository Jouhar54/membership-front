import { motion } from 'framer-motion'
import { Download, Share2, Image, CheckCircle2, Clock } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { useAuth } from '../context/AuthContext'
import { dummyUsers } from '../lib/dummyData'
import toast from 'react-hot-toast'
import posterTemplateImg from '../assets/image.png'

export default function PosterPage() {
  const { user } = useAuth()
  const member = { ...dummyUsers.member, ...user }
  const isReady = member.posterStatus === 'ready' || member.membershipStatus === 'approved'

  const handleDownload = () => {
    if (member.posterUrl) {
      window.open(member.posterUrl, '_blank')
    } else {
      toast.success('Poster preview opened!')
    }
  }

  const handleShare = async () => {
    const shareTarget = member.posterUrl || window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AALIA Membership Campaign',
          text: `${member.fullName || 'Member'} has joined the AALIA Membership Campaign!`,
          url: shareTarget,
        })
      } catch {
        // cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareTarget)
        toast.success('Link copied to clipboard!')
      } catch {
        toast.error('Failed to copy link')
      }
    }
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] font-display">
          Membership Poster
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Your official AALIA membership campaign poster
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
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] aspect-[1003/1280] mb-5 shadow-lg flex items-center justify-center">
              {member.posterUrl ? (
                <img
                  src={member.posterUrl}
                  alt="AALIA Membership Campaign Poster"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={posterTemplateImg}
                    alt="AALIA Poster Template"
                    className="w-full h-full object-cover select-none"
                  />
                  {/* Member photo overlay inside the white rounded box */}
                  <div
                    className="absolute overflow-hidden rounded-[15%] shadow-inner flex items-center justify-center bg-primary-950/20"
                    style={{
                      left: '19.84%',
                      top: '22.18%',
                      width: '29.91%',
                      height: '29.60%',
                    }}
                  >
                    {member.profilePhoto || member.photo ? (
                      <img
                        src={member.profilePhoto || member.photo}
                        alt={member.fullName || 'Member'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#16213e] flex items-center justify-center text-white text-3xl font-bold font-display">
                        {member.fullName?.charAt(0) || 'A'}
                      </div>
                    )}
                  </div>
                </div>
              )}
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
