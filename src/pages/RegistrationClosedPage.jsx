import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  CalendarX2,
  Search,
  ArrowRight,
  ShieldCheck,
  LogIn,
  Clock,
} from 'lucide-react'
import Button from '../components/ui/Button'

export default function RegistrationClosedPage() {
  const navigate = useNavigate()

  return (
    <div className="h-full flex flex-col justify-center overflow-y-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="my-auto max-w-lg mx-auto w-full space-y-6"
      >
        {/* Status Badge & Icon */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Application Window Ended
          </div>

          <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-500/10 to-amber-600/5 dark:from-amber-400/20 dark:to-transparent border border-amber-500/25 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-lg shadow-amber-500/5">
            <CalendarX2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-display tracking-tight">
              No More New Applications Allowed
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
              The membership registration period has officially ended today. We are no longer accepting new membership applications at this time.
            </p>
          </div>
        </div>

        {/* Existing applicant card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-sm)] space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0 text-primary-600 dark:text-primary-400 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-[var(--text-primary)] font-display">
                Already submitted an application?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                If you already applied before the deadline, your submission is currently being processed. You can check your application review and membership status anytime.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            icon={Search}
            iconRight={ArrowRight}
            onClick={() => navigate('/status-check')}
          >
            Check Application Status
          </Button>
        </div>

        {/* Footer info & Admin Portal Link */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-[var(--text-secondary)] border-t border-[var(--border-color)]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span>Applications closed today</span>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Admin / Batch Portal
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

