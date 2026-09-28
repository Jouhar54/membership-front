import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Check } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'
import Avatar from './Avatar'
import { REJECTION_REASONS } from '../../constants'
import { cn } from '../../utils'

export default function RejectReasonModal({
  isOpen,
  onClose,
  onConfirm,
  member,
  loading = false,
}) {
  const [selectedReason, setSelectedReason] = useState(REJECTION_REASONS[0])
  const [customRemarks, setCustomRemarks] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setSelectedReason(REJECTION_REASONS[0])
      setCustomRemarks('')
      setError('')
    }
  }, [isOpen])

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!selectedReason) {
      setError('Please select a reason for rejection.')
      return
    }

    if (selectedReason === 'Other' && !customRemarks.trim()) {
      setError('Please specify the reason in the remarks field.')
      return
    }

    const finalReason = selectedReason === 'Other' 
      ? customRemarks.trim() 
      : (customRemarks.trim() ? `${selectedReason} - ${customRemarks.trim()}` : selectedReason)

    onConfirm({
      id: member?.id,
      reason: finalReason,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Membership Application"
      size="md"
    >
      <div className="space-y-4">
        {/* Applicant summary header */}
        {member && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-error/5 border border-error/20">
            <Avatar name={member.fullName} src={member.profilePhoto} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                {member.fullName}
              </p>
              <p className="text-xs text-[var(--text-tertiary)]">
                {member.batchName || 'Batch Applicant'}
              </p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-medium bg-error/10 text-error rounded-full border border-error/20">
              Pending Rejection
            </span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Select Rejection Reason <span className="text-error">*</span>
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 py-0.5 custom-scrollbar">
            {REJECTION_REASONS.map((reason) => {
              const isSelected = selectedReason === reason
              return (
                <button
                  key={reason}
                  type="button"
                  onClick={() => {
                    setSelectedReason(reason)
                    setError('')
                  }}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 text-left rounded-xl border text-xs font-medium transition-all cursor-pointer',
                    isSelected
                      ? 'border-error bg-error/10 text-error font-semibold ring-1 ring-error/30'
                      : 'border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:border-[var(--border-color-hover)] hover:bg-[var(--bg-tertiary)]'
                  )}
                >
                  <span className="truncate">{reason}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-error flex-shrink-0 ml-2" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Custom / Additional remarks */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--text-secondary)] flex items-center justify-between">
            <span>
              {selectedReason === 'Other' ? 'Specify Reason *' : 'Additional Remarks (Optional)'}
            </span>
            <span className="text-[10px] text-[var(--text-tertiary)]">
              {customRemarks.length}/200
            </span>
          </label>
          <textarea
            value={customRemarks}
            onChange={(e) => {
              setCustomRemarks(e.target.value.slice(0, 200))
              if (error) setError('')
            }}
            placeholder={
              selectedReason === 'Other'
                ? 'Enter the specific reason for rejecting this application...'
                : 'Add any specific notes for the applicant...'
            }
            rows={2}
            className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-error/20 focus:border-error resize-none transition-all"
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-xs text-error font-medium flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--border-color)]">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            loading={loading}
            onClick={handleSubmit}
          >
            Confirm Rejection
          </Button>
        </div>
      </div>
    </Modal>
  )
}
