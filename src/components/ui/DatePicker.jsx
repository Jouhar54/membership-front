import { useState, useRef, useEffect, forwardRef, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  RotateCcw,
} from 'lucide-react'
import { cn } from '../../utils'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

/**
 * Format Date object to YYYY-MM-DD
 */
function formatDateToISO(date) {
  if (!date || isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Parse YYYY-MM-DD string into a valid local Date object
 */
function parseISODate(str) {
  if (!str || typeof str !== 'string') return null
  const parts = str.split('-')
  if (parts.length !== 3) return null
  const y = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10) - 1
  const d = parseInt(parts[2], 10)
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null
  const date = new Date(y, m, d)
  return isNaN(date.getTime()) ? null : date
}

/**
 * Display format (e.g. "28 Sep 2026" or "28-09-2026")
 */
function formatDisplayDate(date) {
  if (!date) return ''
  const day = String(date.getDate()).padStart(2, '0')
  const month = MONTH_SHORT[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

const DatePicker = forwardRef(
  (
    {
      label,
      error,
      placeholder = 'Select date...',
      className = '',
      id,
      name,
      value: controlledValue,
      defaultValue = '',
      onChange,
      onBlur,
      disabled = false,
      min,
      max,
      icon: CustomIcon,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || generatedId
    const containerRef = useRef(null)
    const hiddenInputRef = useRef(null)

    const [isOpen, setIsOpen] = useState(false)
    const [viewMode, setViewMode] = useState('days') // 'days' | 'months' | 'years'

    // Internal value as YYYY-MM-DD string
    const [internalValue, setInternalValue] = useState(
      controlledValue !== undefined ? controlledValue : defaultValue
    )

    // Synchronize internal value when controlled value changes
    useEffect(() => {
      if (controlledValue !== undefined) {
        setInternalValue(controlledValue || '')
      }
    }, [controlledValue])

    const selectedDate = parseISODate(internalValue)

    // Current displayed month & year in the calendar view
    const today = new Date()
    const [viewYear, setViewYear] = useState(
      selectedDate ? selectedDate.getFullYear() : today.getFullYear()
    )
    const [viewMonth, setViewMonth] = useState(
      selectedDate ? selectedDate.getMonth() : today.getMonth()
    )

    // Year range for the year picker grid (e.g. 1940 to 2035)
    const [yearPageStart, setYearPageStart] = useState(
      Math.floor((viewYear || today.getFullYear()) / 12) * 12
    )

    // Whenever calendar opens or selected date changes, sync the view
    useEffect(() => {
      if (selectedDate) {
        setViewYear(selectedDate.getFullYear())
        setViewMonth(selectedDate.getMonth())
        setYearPageStart(Math.floor(selectedDate.getFullYear() / 12) * 12)
      }
    }, [internalValue])

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false)
          setViewMode('days')
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

    // Update value handler
    const handleSelectDate = (date) => {
      const isoStr = formatDateToISO(date)
      setInternalValue(isoStr)
      setIsOpen(false)
      setViewMode('days')

      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = isoStr
      }

      if (onChange) {
        onChange({
          target: {
            name,
            value: isoStr,
          },
        })
      }
    }

    const handleClear = (e) => {
      e?.stopPropagation()
      setInternalValue('')
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = ''
      }
      if (onChange) {
        onChange({
          target: {
            name,
            value: '',
          },
        })
      }
    }

    const handleToday = () => {
      handleSelectDate(new Date())
    }

    const handlePrevMonth = () => {
      if (viewMonth === 0) {
        setViewMonth(11)
        setViewYear((y) => y - 1)
      } else {
        setViewMonth((m) => m - 1)
      }
    }

    const handleNextMonth = () => {
      if (viewMonth === 11) {
        setViewMonth(0)
        setViewYear((y) => y + 1)
      } else {
        setViewMonth((m) => m + 1)
      }
    }

    // Assign ref for react-hook-form
    const setRefs = (node) => {
      hiddenInputRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }

    // Build the 42-day calendar matrix (6 weeks)
    const getCalendarDays = () => {
      const firstDayOfMonth = new Date(viewYear, viewMonth, 1)
      const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0)

      // Get starting day index (0 = Monday, ..., 6 = Sunday)
      let startDayIndex = firstDayOfMonth.getDay() - 1
      if (startDayIndex === -1) startDayIndex = 6 // Sunday is last in ISO week

      const days = []

      // Previous month filler days
      const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate()
      for (let i = startDayIndex - 1; i >= 0; i--) {
        const d = prevMonthLastDay - i
        days.push({
          date: new Date(viewYear, viewMonth - 1, d),
          isCurrentMonth: false,
        })
      }

      // Current month days
      const totalDays = lastDayOfMonth.getDate()
      for (let d = 1; d <= totalDays; d++) {
        days.push({
          date: new Date(viewYear, viewMonth, d),
          isCurrentMonth: true,
        })
      }

      // Next month filler days to complete rows (up to 42)
      const remaining = 42 - days.length
      for (let d = 1; d <= remaining; d++) {
        days.push({
          date: new Date(viewYear, viewMonth + 1, d),
          isCurrentMonth: false,
        })
      }

      return days
    }

    const calendarDays = getCalendarDays()
    const Icon = CustomIcon || CalendarIcon

    return (
      <div className="space-y-1.5 w-full relative" ref={containerRef}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--text-secondary)] select-none"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {/* Custom Input Trigger */}
          <button
            type="button"
            id={inputId}
            disabled={disabled}
            onClick={() => !disabled && setIsOpen((prev) => !prev)}
            aria-haspopup="dialog"
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
              <Icon className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
              <span
                className={cn(
                  'truncate font-medium',
                  selectedDate
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-tertiary)] font-normal'
                )}
              >
                {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {selectedDate && !disabled && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => e.key === 'Enter' && handleClear(e)}
                  className="p-1 rounded-md text-[var(--text-tertiary)] hover:text-error hover:bg-error/10 transition-colors"
                  title="Clear date"
                >
                  <X className="w-3.5 h-3.5" />
                </span>
              )}
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-[var(--text-tertiary)] transition-transform duration-200',
                  isOpen && 'rotate-180 text-primary-500'
                )}
              />
            </div>
          </button>

          {/* Hidden native input for react-hook-form integration */}
          <input
            ref={setRefs}
            type="hidden"
            name={name}
            value={internalValue}
            onChange={() => {}}
            {...props}
          />

          {/* Popover Calendar Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 z-50 mt-1.5 w-72 sm:w-80 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-3.5 shadow-2xl backdrop-blur-xl select-none"
                style={{
                  boxShadow:
                    '0 16px 36px -4px rgba(0, 0, 0, 0.3), 0 4px 16px -2px rgba(0, 0, 0, 0.15)',
                }}
              >
                {/* Header: Controls */}
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)] mb-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setViewMode(viewMode === 'months' ? 'days' : 'months')}
                      className="px-2 py-1 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{MONTH_NAMES[viewMonth]}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setYearPageStart(Math.floor(viewYear / 12) * 12)
                        setViewMode(viewMode === 'years' ? 'days' : 'years')
                      }}
                      className="px-2 py-1 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{viewYear}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                    </button>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (viewMode === 'years') setYearPageStart((y) => y - 12)
                        else if (viewMode === 'months') setViewYear((y) => y - 1)
                        else handlePrevMonth()
                      }}
                      className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (viewMode === 'years') setYearPageStart((y) => y + 12)
                        else if (viewMode === 'months') setViewYear((y) => y + 1)
                        else handleNextMonth()
                      }}
                      className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* ─── Mode 1: Month Selector Grid ───────────────── */}
                {viewMode === 'months' && (
                  <div className="grid grid-cols-3 gap-2 py-2">
                    {MONTH_NAMES.map((name, idx) => {
                      const isCurrent = idx === viewMonth
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            setViewMonth(idx)
                            setViewMode('days')
                          }}
                          className={cn(
                            'py-2 px-1 text-xs font-semibold rounded-xl transition-all cursor-pointer',
                            isCurrent
                              ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                          )}
                        >
                          {MONTH_SHORT[idx]}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* ─── Mode 2: Year Selector Grid ────────────────── */}
                {viewMode === 'years' && (
                  <div>
                    <div className="text-[11px] font-medium text-[var(--text-tertiary)] text-center mb-2">
                      {yearPageStart} – {yearPageStart + 11}
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-1">
                      {Array.from({ length: 12 }, (_, i) => yearPageStart + i).map((yr) => {
                        const isCurrent = yr === viewYear
                        return (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => {
                              setViewYear(yr)
                              setViewMode('days')
                            }}
                            className={cn(
                              'py-2 px-1 text-xs font-semibold rounded-xl transition-all cursor-pointer',
                              isCurrent
                                ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/30'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                            )}
                          >
                            {yr}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* ─── Mode 3: Days Matrix Grid ──────────────────── */}
                {viewMode === 'days' && (
                  <>
                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                      {WEEKDAYS.map((wd) => (
                        <div
                          key={wd}
                          className="text-[11px] font-semibold text-[var(--text-tertiary)] py-1"
                        >
                          {wd}
                        </div>
                      ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {calendarDays.map(({ date, isCurrentMonth }, idx) => {
                        const isSelected =
                          selectedDate &&
                          selectedDate.getFullYear() === date.getFullYear() &&
                          selectedDate.getMonth() === date.getMonth() &&
                          selectedDate.getDate() === date.getDate()

                        const isToday =
                          today.getFullYear() === date.getFullYear() &&
                          today.getMonth() === date.getMonth() &&
                          today.getDate() === date.getDate()

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectDate(date)}
                            className={cn(
                              'h-8 w-8 sm:h-9 sm:w-9 mx-auto flex items-center justify-center rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer',
                              !isCurrentMonth && 'text-[var(--text-tertiary)]/40 hover:text-[var(--text-secondary)]',
                              isCurrentMonth && !isSelected && 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
                              isToday && !isSelected && 'border border-primary-500 text-primary-500 font-bold',
                              isSelected && 'bg-primary-500 text-white font-bold shadow-md shadow-primary-500/30 scale-105'
                            )}
                          >
                            {date.getDate()}
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}

                {/* Footer Controls: Clear & Today */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[var(--border-color)] text-xs">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-2.5 py-1 text-[var(--text-tertiary)] hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-medium"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleToday}
                    className="px-2.5 py-1 text-primary-600 dark:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors cursor-pointer font-semibold"
                  >
                    Today
                  </button>
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

DatePicker.displayName = 'DatePicker'

export default DatePicker
