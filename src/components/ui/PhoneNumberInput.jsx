import { forwardRef, useState, useRef, useEffect, useId, useMemo } from 'react'
import {
  usePhoneInput,
  defaultCountries,
  parseCountry,
  FlagImage,
} from 'react-international-phone'
import 'react-international-phone/style.css'
import { ChevronDown, Search, Check, X } from 'lucide-react'
import { cn } from '../../utils'

// ISO2 codes for prominent countries requested: India, UAE, UK, US
const PREFERRED_COUNTRY_ISO2S = ['in', 'ae', 'gb', 'us']

// Pre-parse default countries once
const ALL_PARSED_COUNTRIES = defaultCountries.map((c) => parseCountry(c))

const PREFERRED_COUNTRIES = PREFERRED_COUNTRY_ISO2S.map((iso) =>
  ALL_PARSED_COUNTRIES.find((c) => c.iso2 === iso)
).filter(Boolean)

const OTHER_COUNTRIES = ALL_PARSED_COUNTRIES.filter(
  (c) => !PREFERRED_COUNTRY_ISO2S.includes(c.iso2)
).sort((a, b) => a.name.localeCompare(b.name))

const PhoneNumberInput = forwardRef(
  (
    {
      label,
      error,
      id,
      name,
      value = '',
      onChange,
      onBlur,
      defaultCountry = 'in',
      required = false,
      disabled = false,
      placeholder = 'Enter phone number',
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || (name ? `phone-input-${name}` : generatedId)

    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const containerRef = useRef(null)
    const searchInputRef = useRef(null)

    const {
      phone,
      inputValue,
      country,
      setCountry,
      handlePhoneValueChange,
      inputRef,
    } = usePhoneInput({
      defaultCountry,
      value: value || '',
      countries: defaultCountries,
      onChange: (data) => {
        onChange?.(data.phone, data)
      },
    })

    // Ref-forwarding helper
    const setRefs = (element) => {
      inputRef.current = element
      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
    }

    // Auto-focus search input when dropdown opens
    useEffect(() => {
      if (isOpen) {
        const timer = setTimeout(() => {
          searchInputRef.current?.focus()
        }, 50)
        return () => clearTimeout(timer)
      } else {
        setSearchQuery('')
      }
    }, [isOpen])

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false)
        }
      }
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    // Close on Escape key
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape' && isOpen) {
          setIsOpen(false)
          inputRef.current?.focus()
        }
      }
      if (isOpen) {
        window.addEventListener('keydown', handleKeyDown)
      }
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }, [isOpen])

    // Filter countries based on search query
    const filteredCountries = useMemo(() => {
      const query = searchQuery.trim().toLowerCase()
      if (!query) return null
      const cleanDial = query.replace(/^\+/, '')
      return ALL_PARSED_COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.dialCode.includes(cleanDial) ||
          c.iso2.toLowerCase() === query
      )
    }, [searchQuery])

    const handleSelectCountry = (countryIso2) => {
      setCountry(countryIso2)
      setIsOpen(false)
      setSearchQuery('')
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }

    const renderCountryItem = (c) => {
      const isSelected = country?.iso2 === c.iso2
      return (
        <button
          key={c.iso2}
          type="button"
          onClick={() => handleSelectCountry(c.iso2)}
          className={cn(
            'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer text-xs',
            isSelected
              ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-semibold'
              : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          )}
        >
          <div className="flex items-center gap-2.5 truncate">
            <FlagImage
              iso2={c.iso2}
              style={{
                width: '20px',
                height: '14px',
                borderRadius: '2px',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
            <span className="truncate">{c.name}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 text-[var(--text-tertiary)] font-mono text-[11px]">
            <span>+{c.dialCode}</span>
            {isSelected && (
              <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            )}
          </div>
        </button>
      )
    }

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div ref={containerRef} className="relative">
          {/* Main Input Container */}
          <div
            className={cn(
              'group flex items-center w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] transition-all duration-200',
              'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500/30 focus-within:border-primary-500',
              disabled && 'opacity-50 cursor-not-allowed bg-[var(--bg-secondary)]',
              error && 'border-error focus-within:ring-error/30 focus-within:border-error',
              className
            )}
          >
            {/* Country Selector Button */}
            <button
              type="button"
              onClick={() => !disabled && setIsOpen((prev) => !prev)}
              disabled={disabled}
              aria-label={`Selected country: ${country?.name || 'India'} (+${country?.dialCode || '91'}). Click to choose country.`}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              className="flex items-center gap-1.5 px-3 py-2.5 border-r border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-sm font-medium text-[var(--text-primary)] transition-colors rounded-l-xl focus:outline-none cursor-pointer flex-shrink-0 select-none"
            >
              <FlagImage
                iso2={country?.iso2 || defaultCountry}
                style={{
                  width: '22px',
                  height: '15px',
                  borderRadius: '2px',
                  objectFit: 'cover',
                }}
              />
              <span className="text-xs font-semibold text-[var(--text-secondary)]">
                +{country?.dialCode || '91'}
              </span>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-[var(--text-tertiary)] transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Phone Input Field */}
            <input
              ref={setRefs}
              id={inputId}
              name={name}
              type="tel"
              value={inputValue}
              onChange={handlePhoneValueChange}
              onBlur={onBlur}
              disabled={disabled}
              placeholder={placeholder}
              className="w-full bg-transparent px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none disabled:cursor-not-allowed rounded-r-xl"
              {...props}
            />
          </div>

          {/* Country Selector Dropdown */}
          {isOpen && (
            <div
              role="listbox"
              className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-2xl z-50 overflow-hidden flex flex-col max-h-80 transition-all duration-150 animate-in fade-in"
            >
              {/* Search bar */}
              <div className="p-2 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/40">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search country or code..."
                    className="w-full pl-8 pr-7 py-1.5 text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Countries List */}
              <div className="overflow-y-auto divide-y divide-[var(--border-color)]/30 text-xs flex-1">
                {filteredCountries ? (
                  filteredCountries.length > 0 ? (
                    <div className="p-1 space-y-0.5">
                      {filteredCountries.map(renderCountryItem)}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-[var(--text-tertiary)]">
                      No countries found for "{searchQuery}"
                    </div>
                  )
                ) : (
                  <>
                    {/* Preferred countries */}
                    <div className="p-1 space-y-0.5">
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                        Popular
                      </div>
                      {PREFERRED_COUNTRIES.map(renderCountryItem)}
                    </div>

                    {/* All other countries */}
                    <div className="p-1 space-y-0.5">
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                        All Countries
                      </div>
                      {OTHER_COUNTRIES.map(renderCountryItem)}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-xs text-error mt-1">{error}</p>}
      </div>
    )
  }
)

PhoneNumberInput.displayName = 'PhoneNumberInput'

export default PhoneNumberInput
