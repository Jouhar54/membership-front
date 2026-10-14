import { motion } from 'framer-motion'
import { EmptyState } from '../ui/LoadingStates'
import { TableIcon } from 'lucide-react'
import { cn } from '../../utils'

export default function DataTable({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No data found',
  emptyIcon,
  minWidth,
}) {
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon || TableIcon}
        title="No Results"
        description={emptyMessage}
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
      <table className="w-full text-sm" style={minWidth ? { minWidth } : {}}>
        <thead>
          <tr className="bg-[var(--bg-tertiary)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider whitespace-nowrap",
                  col.headerClassName
                )}
                style={{
                  ...(col.width ? { width: col.width } : {}),
                  ...(col.minWidth ? { minWidth: col.minWidth } : {}),
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {data.map((row, idx) => (
            <motion.tr
              key={row.id || idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "bg-[var(--bg-card)] hover:bg-[var(--bg-tertiary)] transition-colors duration-150",
                onRowClick && "cursor-pointer"
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-[var(--text-primary)] whitespace-nowrap align-middle",
                    col.cellClassName
                  )}
                  style={{
                    ...(col.width ? { width: col.width } : {}),
                    ...(col.minWidth ? { minWidth: col.minWidth } : {}),
                  }}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
