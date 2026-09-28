import { useState, useRef, useEffect, forwardRef, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Search, X } from 'lucide-react'
import { cn } from '../../utils'

const Select = forwardRef(
  (
    {
      label,
      error,
      options = [],
      placeholder = 'Select...',
      className = '',
      id,
      name,
      value: controlledValue,
      defaultValue = '',
      onChange,
      onBlur,
      disabled = false,
      searchable = true,
      icon: Icon,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const selectId = id || generatedId
    const containerRef = useRef(null)
    const hiddenSelectRef = useRef(null)
    const searchInputRef = useRef(null)

    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [internalValue, setInternalValue] = useState(
      controlledValue !== undefined ? controlledValue : defaultValue
    )

    // Synchronize internal value when controlled value prop changes
    useEffect(() => {
      if (controlledValue !== undefined) {
        setInternalValue(controlledValue)
      }
    }, [controlledValue])

    // Find current selected option
    const selectedOption = options.find(
      (opt) => String(opt.value) === String(internalValue)
    )

    // Filter options if searchable (exclude empty value which is already represented by default top item)
    const filteredOptions = options
      .filter((opt) => opt.value !== '' && opt.value !== null && opt.value !== undefined)
      .filter((opt) =>
        opt.label?.toLowerCase().includes(searchTerm.toLowerCase())
      )

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false)
          setSearchTerm('')
          if (onBlur) {
            onBlur({ target: { name, value: internalValue } })
          }
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen, internalValue, name, onBlur])

    // Focus search input when opened
    useEffect(() => {
      if (isOpen && searchable && options.length > 6 && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 50)
      }
    }, [isOpen, searchable, options.length])

    // Handle selecting an option
    const handleSelect = (optionValue) => {
      setInternalValue(optionValue)
      setIsOpen(false)
      setSearchTerm('')

      // Trigger change for React Hook Form / synthetic event
      if (hiddenSelectRef.current) {
        hiddenSelectRef.current.value = optionValue
      }

      if (onChange) {
        onChange({
          target: {
            name,
            value: optionValue,
          },
        })
      }
    }

    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (disabled) return

      if (e.key === 'Escape') {
        setIsOpen(false)
        setSearchTerm('')
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (!isOpen) {
          e.preventDefault()
          setIsOpen(true)
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        }
      }
    }

    // Assign forwarded ref to hidden select for react-hook-form integration
    const setRefs = (node) => {
      hiddenSelectRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }

    const showSearch = searchable && options.length > 6

    return (
      <div className="space-y-1.5 w-full" ref={containerRef}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[var(--text-secondary)] select-none"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {/* Trigger Button */}
          <button
            type="button"
            id={selectId}
            disabled={disabled}
            onClick={() => !disabled && setIsOpen((prev) => !prev)}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className={cn(
              'w-full flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-3.5 py-2.5 text-sm transition-all duration-200 cursor-pointer text-left',
              'hover:border-[var(--border-hover)] focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isOpen && 'border-primary-500 ring-2 ring-primary-500/30',
              error && 'border-error focus:ring-error/30 focus:border-error',
              className
            )}
          >
            <div className="flex items-center gap-2.5 truncate pr-2">
              {Icon && <Icon className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />}
              <span
                className={cn(
                  'truncate font-medium',
                  selectedOption
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-tertiary)] font-normal'
                )}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>

            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="flex-shrink-0"
            >
              <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
            </motion.div>
          </button>

          {/* Hidden native select for react-hook-form & form submission */}
          <select
            ref={setRefs}
            name={name}
            value={internalValue}
            onChange={(e) => handleSelect(e.target.value)}
            tabIndex={-1}
            aria-hidden="true"
            className="sr-only pointer-events-none absolute opacity-0"
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom Animated Dropdown Popover */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 min-w-full sm:min-w-[180px] w-max max-w-[320px] z-50 mt-1.5 overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-xl backdrop-blur-xl"
                style={{
                  maxHeight: '320px',
                  boxShadow:
                    '0 12px 30px -4px rgba(0, 0, 0, 0.25), 0 4px 12px -2px rgba(0, 0, 0, 0.15)',
                }}
              >
                {/* Search Bar for dropdowns with several options */}
                {showSearch && (
                  <div className="p-2 border-b border-[var(--border-color)] sticky top-0 bg-[var(--bg-primary)]/90 backdrop-blur-md z-10">
                    <div className="relative flex items-center">
                      <Search className="absolute left-2.5 w-3.5 h-3.5 text-[var(--text-tertiary)] pointer-events-none" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg bg-[var(--bg-tertiary)] border border-transparent focus:border-primary-500/50 focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => setSearchTerm('')}
                          className="absolute right-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Option List */}
                <div
                  role="listbox"
                  className="p-1.5 overflow-y-auto max-h-56 space-y-0.5 custom-scrollbar"
                >
                  {/* Default / Unselect item */}
                  <button
                    type="button"
                    role="option"
                    aria-selected={!internalValue}
                    onClick={() => handleSelect('')}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer text-left',
                      !internalValue
                        ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold'
                        : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-secondary)]'
                    )}
                  >
                    <span>{placeholder}</span>
                    {!internalValue && <Check className="w-3.5 h-3.5 text-primary-500" />}
                  </button>

                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt) => {
                      const isSelected = String(opt.value) === String(internalValue)
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelect(opt.value)}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer text-left',
                            isSelected
                              ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400 font-medium'
                              : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                          )}
                        >
                          <span className="truncate">{opt.label}</span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-primary-500 flex-shrink-0 ml-2" />
                          )}
                        </button>
                      )
                    })
                  ) : (
                    <div className="py-4 px-3 text-center text-xs text-[var(--text-tertiary)]">
                      No matching options found
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && <p className="text-xs text-error mt-1">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
