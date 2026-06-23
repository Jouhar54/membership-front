import { motion } from 'framer-motion'
import { cn } from '../../utils'

export default function Card({ children, className = '', hover = false, padding = true, ...props }) {
  const Component = hover ? motion.div : 'div'
  const hoverProps = hover
    ? { whileHover: { y: -2, boxShadow: 'var(--shadow-lg)' }, transition: { duration: 0.2 } }
    : {}

  return (
    <Component
      className={cn(
        'bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl transition-all duration-200',
        padding && 'p-5',
        'shadow-[var(--shadow-sm)]',
        className
      )}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={cn('text-base font-semibold text-[var(--text-primary)] font-display', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={cn('text-sm text-[var(--text-secondary)] mt-0.5', className)}>
      {children}
    </p>
  )
}
