import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12' }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin text-primary-500`} />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full border-2 border-primary-200 dark:border-primary-800" />
          <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-2 border-transparent border-t-primary-500 animate-spin" />
        </div>
        <p className="text-sm text-[var(--text-tertiary)]">Loading...</p>
      </motion.div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {Icon && (
        <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] mb-4">
          <Icon className="w-8 h-8 text-[var(--text-tertiary)]" />
        </div>
      )}
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1 font-display">
        {title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] text-center max-w-sm mb-4">
        {description}
      </p>
      {action}
    </motion.div>
  )
}

export function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="p-4 rounded-2xl bg-error/10 mb-4">
        <svg className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">Error</h3>
      <p className="text-sm text-[var(--text-secondary)] text-center max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
        >
          Try again
        </button>
      )}
    </div>
  )
}
