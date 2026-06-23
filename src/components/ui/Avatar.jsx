import { getInitials } from '../../utils'
import { cn } from '../../utils'

const sizeClasses = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-9 h-9 text-sm',
  md: 'w-11 h-11 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-xl',
}

export default function Avatar({ name, src, size = 'md', className = '' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover ring-2 ring-[var(--border-color)]',
          sizeClasses[size],
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold bg-primary-100 text-primary-700 ring-2 ring-[var(--border-color)]',
        sizeClasses[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}
