import { cn } from '../../utils'
import { getStatusColor, formatStatus } from '../../utils'

export default function Badge({ children, variant, className = '' }) {
  const colorClass = variant ? getStatusColor(variant) : 'bg-primary-100 text-primary-700'

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        colorClass,
        className
      )}
    >
      {children || formatStatus(variant)}
    </span>
  )
}
