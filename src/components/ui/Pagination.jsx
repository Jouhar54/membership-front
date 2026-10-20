import { useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from 'lucide-react'
import { cn } from '../../utils'

/**
 * Generate an array of page numbers and ellipsis tokens to render.
 * e.g. [1, 2, 3, '...', 10] or [1, '...', 4, 5, 6, '...', 10]
 */
function getPaginationRange(currentPage, totalPages, siblingCount = 1) {
  // If total pages is small, show all
  const totalPageNumbers = siblingCount * 2 + 5 // e.g. 1 + siblings + current + siblings + last + 2 ellipses
  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

  const shouldShowLeftDots = leftSiblingIndex > 2
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
    return [...leftRange, '...', totalPages]
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    )
    return [1, '...', ...rightRange]
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    )
    return [1, '...', ...middleRange, '...', totalPages]
  }

  return Array.from({ length: totalPages }, (_, i) => i + 1)
}

export default function Pagination({
  page = 1,
  limit = 10,
  total = 0,
  totalPages = 1,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  onLimitChange,
  limitOptions = [10, 20, 50, 100],
  isLoading = false,
  className = '',
}) {
  const safeTotalPages = Math.max(1, totalPages || 1)
  const currentPage = Math.min(Math.max(1, page || 1), safeTotalPages)

  const canGoPrev = hasPrevPage !== undefined ? hasPrevPage : currentPage > 1
  const canGoNext = hasNextPage !== undefined ? hasNextPage : currentPage < safeTotalPages

  const startRecord = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const endRecord = total === 0 ? 0 : Math.min(currentPage * limit, total)

  const pagesRange = useMemo(
    () => getPaginationRange(currentPage, safeTotalPages, 1),
    [currentPage, safeTotalPages]
  )

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3.5 border-t border-[var(--border-color)] bg-[var(--bg-card)]/50 select-none text-xs text-[var(--text-secondary)]',
        className
      )}
    >
      {/* Left: Summary text and records per page selector */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 w-full sm:w-auto">
        <span>
          Showing{' '}
          <strong className="font-semibold text-[var(--text-primary)]">
            {startRecord}
          </strong>{' '}
          to{' '}
          <strong className="font-semibold text-[var(--text-primary)]">
            {endRecord}
          </strong>{' '}
          of{' '}
          <strong className="font-semibold text-[var(--text-primary)]">
            {total}
          </strong>{' '}
          results
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-1.5 ml-0 sm:ml-2 pl-0 sm:pl-3 sm:border-l sm:border-[var(--border-color)]">
            <span className="text-[var(--text-tertiary)]">Rows:</span>
            <select
              value={limit}
              onChange={(e) => {
                const nextLimit = Number(e.target.value)
                onLimitChange(nextLimit)
              }}
              className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer transition-colors"
              aria-label="Records per page"
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / page
                </option>
              ))}
            </select>
          </div>
        )}

        {isLoading && (
          <span className="inline-flex items-center gap-1 text-[11px] text-primary-500 font-medium">
            <Loader2 className="w-3 h-3 animate-spin" />
            Updating...
          </span>
        )}
      </div>

      {/* Right: Controls & Page Numbers */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrev || isLoading}
          className="p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-1 focus:ring-primary-500"
          title="First Page"
          aria-label="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrev || isLoading}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Numbered buttons */}
        <div className="flex items-center gap-1 mx-1">
          {pagesRange.map((item, idx) => {
            if (item === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-[var(--text-tertiary)] font-bold tracking-widest text-xs"
                >
                  •••
                </span>
              )
            }

            const pageNum = Number(item)
            const isActive = pageNum === currentPage

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                disabled={isLoading}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500/30',
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm ring-1 ring-primary-500'
                    : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                )}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext || isLoading}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(safeTotalPages)}
          disabled={!canGoNext || isLoading}
          className="p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-1 focus:ring-primary-500"
          title="Last Page"
          aria-label="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
