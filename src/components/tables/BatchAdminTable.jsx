import DataTable from './DataTable'
import Button from '../ui/Button'
import { Eye, Edit3, Trash2, ShieldCheck } from 'lucide-react'

export default function BatchAdminTable({ admins, onView, onEdit, onDelete }) {
  const columns = [
    {
      key: 'fullName',
      label: 'Name',
      minWidth: '180px',
      render: (val) => (
        <span className="font-semibold text-[var(--text-primary)] whitespace-nowrap">
          {val}
        </span>
      ),
    },
    { key: 'email', label: 'Email', minWidth: '180px' },
    { key: 'phone', label: 'Phone', minWidth: '140px' },
    {
      key: 'batchName',
      label: 'Assigned Batch',
      minWidth: '160px',
      render: (val, row) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900/50 whitespace-nowrap">
          {val || 'None'}
          {row.batchCode && <span className="opacity-60 text-[10px]">({row.batchCode})</span>}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      minWidth: '130px',
      render: (val) => (val ? new Date(val).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }) : '—'),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      minWidth: '120px',
      render: (_, row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="xs"
            icon={Eye}
            onClick={() => onView(row)}
            title="View Details"
          />
          <Button
            variant="ghost"
            size="xs"
            icon={Edit3}
            onClick={() => onEdit(row)}
            title="Edit Admin"
          />
          <Button
            variant="ghost"
            size="xs"
            icon={Trash2}
            className="text-error hover:text-error hover:bg-error/10"
            onClick={() => onDelete(row)}
            title="Delete Admin"
          />
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={admins}
      minWidth="800px"
      emptyMessage="No batch admins found. Create one to get started."
      emptyIcon={ShieldCheck}
    />
  )
}
