import { forwardRef } from 'react'
import { cn } from '../../utils'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(
  ({ label, error, options = [], placeholder = 'Select...', className = '', id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3.5 py-2.5 pr-10 text-sm text-[var(--text-primary)] transition-all duration-200 cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-error focus:ring-error/30 focus:border-error',
              className
            )}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
        </div>
        {error && (
          <p className="text-xs text-error mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
