import { motion } from 'framer-motion'
import { cn } from '../../utils'

export default function StatCard({ title, value, icon: Icon, trend, trendLabel, color = 'primary', className = '' }) {
  const colorStyles = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400',
    success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
    warning: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
    danger: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400',
    info: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-[var(--text-secondary)] font-medium">{title}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] font-display tracking-tight">
            {value}
          </p>
          {trendLabel && (
            <p className="text-xs text-[var(--text-tertiary)]">
              {trend && (
                <span className={trend > 0 ? 'text-success' : 'text-error'}>
                  {trend > 0 ? '+' : ''}{trend}%{' '}
                </span>
              )}
              {trendLabel}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('p-2.5 rounded-xl', colorStyles[color])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </motion.div>
  )
}
