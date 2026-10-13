import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Check,
  Crop,
  Sparkles,
} from 'lucide-react'
import Button from './Button'
import getCroppedImg from '../../utils/cropImage'
import toast from 'react-hot-toast'

export default function ImageCropModal({
  isOpen,
  imageSrc,
  fileName = 'profile-photo.jpg',
  onClose,
  onCropSave,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [aspect, setAspect] = useState(1) // Default 1:1 (Square)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onCropCompleteCallback = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleReset = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    setAspect(1)
  }

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    try {
      setIsProcessing(true)
      const croppedResult = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        { horizontal: false, vertical: false },
        fileName
      )

      if (croppedResult) {
        onCropSave(croppedResult.file, croppedResult.previewUrl)
        toast.success('Photo cropped successfully!')
        onClose()
      }
    } catch (err) {
      console.error('Crop error:', err)
      toast.error('Failed to crop image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen || !imageSrc) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.3, bounce: 0.1 }}
          className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-[var(--shadow-xl)] z-10 my-auto overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
                <Crop className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] font-display">
                  Crop Profile Photo
                </h3>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  Adjust, zoom, and rotate to fit your ID card and poster.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cropper Container */}
          <div className="p-4 sm:p-5 space-y-4">
            <div className="relative w-full h-72 sm:h-80 bg-neutral-950 rounded-xl overflow-hidden shadow-inner border border-white/10">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropCompleteCallback}
                showGrid={true}
                classes={{
                  containerClassName: 'relative w-full h-full',
                  cropAreaClassName:
                    aspect === 1 ? '!rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]' : 'shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]',
                }}
              />
            </div>

            {/* Crop Aspect Ratio Toggle */}
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
              <span className="text-[var(--text-tertiary)] font-medium text-[11px]">
                Aspect Ratio:
              </span>
              <div className="inline-flex rounded-lg bg-[var(--bg-tertiary)] p-0.5 border border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setAspect(1)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    aspect === 1
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  1:1 Square (Avatar)
                </button>
                <button
                  type="button"
                  onClick={() => setAspect(3 / 4)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    aspect === 3 / 4
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  3:4 Passport
                </button>
              </div>
            </div>

            {/* Zoom Slider and Controls */}
            <div className="space-y-3 bg-[var(--bg-tertiary)]/40 p-3 rounded-xl border border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.max(1, prev - 0.2))}
                  className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.min(3, prev + 0.2))}
                  className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-[var(--text-tertiary)] w-10 text-right">
                  {zoom.toFixed(1)}x
                </span>
              </div>

              {/* Action Buttons: Rotate & Reset */}
              <div className="flex items-center justify-between pt-1 border-t border-[var(--border-color)]/60 text-xs">
                <button
                  type="button"
                  onClick={handleRotate}
                  className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors cursor-pointer py-1"
                >
                  <RotateCw className="w-3.5 h-3.5 text-primary-500" />
                  <span>Rotate 90°</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] font-medium transition-colors cursor-pointer py-1"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              iconRight={Check}
              onClick={handleSave}
              loading={isProcessing}
            >
              Crop & Save
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
