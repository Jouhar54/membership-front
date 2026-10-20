import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  User,
  Phone,
  Upload,
  CheckCircle2,
  ArrowRight,
  Droplet,
  GraduationCap,
  MapPin,
  Home,
  Mail,
  Briefcase,
  FileCheck2,
  Building2,
  Landmark,
  Copy,
  Sparkles,
  ShieldCheck,
  Lock,
  CreditCard,
  Receipt,
  X,
  Crop,
  Search,
  Award,
  Check,
  Users,
  Loader2,
} from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { applicationSchema } from '../lib/validations'
import { batchesApi, applicationsApi } from '../api/services'
import { DISTRICTS, BLOOD_GROUPS, JOB_TYPES, STATES } from '../constants'
import Input from '../components/ui/Input'
import PhoneNumberInput from '../components/ui/PhoneNumberInput'
import Select from '../components/ui/Select'
import DatePicker from '../components/ui/DatePicker'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import DeveloperCTA from '../components/common/DeveloperCTA'
import ImageCropModal from '../components/ui/ImageCropModal'
import toast from 'react-hot-toast'
import { showApiErrorToast, cn } from '../utils'
import { fetchLocationByPin } from '../utils/pincode'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [photoPreview, setPhotoPreview] = useState(null)
  const [rawPhotoSrc, setRawPhotoSrc] = useState(null)
  const [photoFileName, setPhotoFileName] = useState('')
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const fileInputRef = useRef(null)
  const [paymentPreview, setPaymentPreview] = useState(null)
  const [submittedApp, setSubmittedApp] = useState(null)
  const [confirmingBatch, setConfirmingBatch] = useState(null)

  // PIN code auto-lookup state
  const [pinLookupStatus, setPinLookupStatus] = useState(null) // null | 'loading' | 'success' | 'error'
  const [pinLookupMessage, setPinLookupMessage] = useState('')
  const [availablePostOffices, setAvailablePostOffices] = useState([])

  const todayStr = new Date().toISOString().split('T')[0]

  const { data: batches = [] } = useQuery({
    queryKey: ['batches'],
    queryFn: batchesApi.getAll,
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      fatherName: '',
      dob: '',
      bloodGroup: '',
      houseName: '',
      place: '',
      post: '',
      pin: '',
      whatsapp: '',
      phone_number: '',
      phone: '',
      email: '',
      batchId: '',
      district: '',
      state: 'Kerala',
      panchayath: '',
      mandalam: '',
      thaluk: '',
      jobType: '',
      jobTypeOther: '',
      anwariCertificateNo: '',
      declarationAccepted: false,
      declarationDate: todayStr,
      profilePhoto: undefined,
      paymentScreenshot: undefined,
    },
  })

  const selectedJobType = watch('jobType')
  const phoneValue = watch('phone_number') || watch('phone')

  const applyMutation = useMutation({
    mutationFn: applicationsApi.create,
    onSuccess: (data) => {
      toast.success('Application submitted successfully!')
      setSubmittedApp(data)
    },
    onError: (error) => {
      showApiErrorToast(error, 'Submission failed. Please try again.')
    },
  })

  // Auto-fetch location details when user enters a 6-digit PIN code
  const handlePinLookup = async (pinValue) => {
    const clean = String(pinValue || '').trim()
    if (clean.length !== 6 || !/^\d{6}$/.test(clean)) {
      setPinLookupStatus(null)
      setPinLookupMessage('')
      setAvailablePostOffices([])
      return
    }

    setPinLookupStatus('loading')
    setPinLookupMessage('Locating area...')
    const result = await fetchLocationByPin(clean)

    if (result.success) {
      setPinLookupStatus('success')
      setPinLookupMessage(`${result.district}, ${result.state}`)
      setAvailablePostOffices(result.postOffices || [])

      if (result.district) {
        setValue('district', result.district, { shouldValidate: true })
      }
      if (result.state) {
        setValue('state', result.state, { shouldValidate: true })
      }
      if (result.primaryPostOffice && !watch('post')) {
        setValue('post', result.primaryPostOffice, { shouldValidate: true })
      }
      if (result.taluk && !watch('thaluk')) {
        setValue('thaluk', result.taluk, { shouldValidate: true })
      }
      toast.success(`Location detected: ${result.district}, ${result.state}`, {
        id: 'pin-found',
        duration: 2500,
      })
    } else {
      setPinLookupStatus('error')
      setPinLookupMessage(result.error || 'Location not found')
      setAvailablePostOffices([])
    }
  }

  const handleSelectPostOffice = (po) => {
    setValue('post', po.name, { shouldValidate: true })
    if (po.block && po.block !== 'NA') {
      setValue('thaluk', po.block, { shouldValidate: true })
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFileName(file.name)
      const reader = new FileReader()
      reader.onload = (ev) => {
        setRawPhotoSrc(ev.target.result)
        setIsCropModalOpen(true)
      }
      reader.readAsDataURL(file)
      e.target.value = ''
    }
  }

  const handleCropSave = (croppedFile, croppedPreviewUrl) => {
    setValue('profilePhoto', croppedFile, { shouldValidate: true })
    setPhotoPreview(croppedPreviewUrl)
  }

  const removePhoto = () => {
    setValue('profilePhoto', undefined, { shouldValidate: true })
    setPhotoPreview(null)
    setRawPhotoSrc(null)
    setPhotoFileName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handlePaymentChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('paymentScreenshot', file, { shouldValidate: true })
      const reader = new FileReader()
      reader.onload = (ev) => setPaymentPreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const removePaymentScreenshot = () => {
    setValue('paymentScreenshot', undefined, { shouldValidate: true })
    setPaymentPreview(null)
  }

  const handleNameChange = (e) => {
    setValue('fullName', e.target.value.toUpperCase())
  }

  const copyPhoneToWhatsapp = () => {
    if (phoneValue) {
      setValue('whatsapp', phoneValue, { shouldValidate: true })
      toast.success('Copied Mobile Number to WhatsApp')
    } else {
      toast.error('Please enter Mobile Number first')
    }
  }

  const handleBatchBeforeSelect = (batchId) => {
    const batch = batches.find((b) => String(b.id) === String(batchId))
    if (batch) {
      setConfirmingBatch(batch)
    }
  }

  const handleConfirmBatch = () => {
    if (confirmingBatch) {
      setValue('batchId', confirmingBatch.id, { shouldValidate: true })
      toast.success(`Selected ${confirmingBatch.name}`)
      setConfirmingBatch(null)
    }
  }

  const onSubmit = (data) => {
    const finalPhone = data.phone_number || data.phone || ''
    const payload = {
      ...data,
      phone: finalPhone,
      phone_number: finalPhone,
      declarationDate: data.declarationDate || new Date().toISOString().split('T')[0],
    }
    applyMutation.mutate(payload)
  }

  if (submittedApp) {
    return (
      <div className="text-center py-6 space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-50 dark:bg-success-950/30 text-success mb-2 shadow-sm ring-8 ring-success-50/50 dark:ring-success-950/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] font-display">
            Application Submitted!
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-md mx-auto">
            Thank you, <span className="font-semibold text-[var(--text-primary)]">{submittedApp.fullName}</span>. Your application for <span className="font-semibold text-[var(--text-primary)]">{submittedApp.batchName || 'the selected batch'}</span> has been successfully recorded.
          </p>
        </div>

        <div className="bg-[var(--bg-primary)] p-5 rounded-2xl max-w-md mx-auto text-left border border-[var(--border-color)] space-y-3 text-sm shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-[var(--border-color)]">
            <span className="text-[var(--text-tertiary)]">Status</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Under Review
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[var(--text-tertiary)] block">Father's Name</span>
              <span className="text-[var(--text-primary)] font-medium">{submittedApp.fatherName || '—'}</span>
            </div>
            <div>
              <span className="text-[var(--text-tertiary)] block">Blood Group</span>
              <span className="text-[var(--text-primary)] font-medium">{submittedApp.bloodGroup || '—'}</span>
            </div>
            <div>
              <span className="text-[var(--text-tertiary)] block">Mobile</span>
              <span className="text-[var(--text-primary)] font-medium">{submittedApp.phone_number || submittedApp.phone}</span>
            </div>
            <div>
              <span className="text-[var(--text-tertiary)] block">Place / District</span>
              <span className="text-[var(--text-primary)] font-medium">
                {[submittedApp.place, submittedApp.district].filter(Boolean).join(', ') || '—'}
              </span>
            </div>
            <div>
              <span className="text-[var(--text-tertiary)] block">Profession</span>
              <span className="text-[var(--text-primary)] font-medium">{submittedApp.jobType || '—'}</span>
            </div>
            <div>
              <span className="text-[var(--text-tertiary)] block">Batch</span>
              <span className="text-[var(--text-primary)] font-medium">{submittedApp.batchName || '—'}</span>
            </div>
            {submittedApp.anwariCertificateNo && (
              <div className="col-span-2 pt-1 border-t border-[var(--border-color)]">
                <span className="text-[var(--text-tertiary)] block">ANWARI Certificate No.</span>
                <span className="text-[var(--text-primary)] font-semibold font-mono">{submittedApp.anwariCertificateNo}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 max-w-md mx-auto pt-2">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => navigate(`/status/${submittedApp.id}`)}
            iconRight={ArrowRight}
          >
            View Live Status
          </Button>
          <Button
            variant="ghost"
            className="w-full text-xs"
            onClick={() => {
              setSubmittedApp(null)
              setPhotoPreview(null)
              setRawPhotoSrc(null)
              setPhotoFileName('')
              setPaymentPreview(null)
            }}
          >
            Submit Another Application
          </Button>
        </div>

        {/* Developer lead-gen CTA */}
        <DeveloperCTA variant="success" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Top Header (Pinned like Footer) */}
      <div className="flex-shrink-0 pb-3 pt-1">
        <div className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            <Sparkles className="w-4 h-4" />
            <span>Alumni Membership Form</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/status-check"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-primary-500/30 bg-primary-50/70 dark:bg-primary-950/50 hover:bg-primary-100 dark:hover:bg-primary-900/60 text-xs font-semibold text-primary-700 dark:text-primary-300 hover:border-primary-500/60 transition-all shadow-xs flex-shrink-0"
            >
              <Search className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
              <span>Check Status</span>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] hover:border-primary-500/50 text-xs font-semibold text-[var(--text-secondary)] hover:text-primary-600 dark:hover:text-primary-400 transition-all shadow-sm flex-shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-primary-500" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-display tracking-tight">
          Membership Application
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Please fill in all the details carefully to submit your application for AALIA.
        </p>
      </div>

      {/* Scrollable Middle Content */}
      <div className="flex-1 overflow-y-auto pr-1.5 space-y-4 custom-scrollbar pb-6">
        {/* Already applied banner at the top of the form */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-2.5 rounded-xl bg-primary-50/70 dark:bg-primary-950/40 border border-primary-200/60 dark:border-primary-800/50 text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse shrink-0" />
            <span className="text-[var(--text-secondary)]">
              Already submitted an application? <strong className="text-[var(--text-primary)] font-medium">Track your approval & poster</strong>
            </span>
          </div>
          <Link
            to="/status-check"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs transition-colors shrink-0 shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Check Application Status</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ─── SECTION 1: Personal Details ───────────────────────── */}
        <div className="bg-[var(--bg-primary)] p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] pb-2 border-b border-[var(--border-color)]">
            <User className="w-4 h-4 text-primary-500" />
            <span>Personal Details</span>
          </div>

          {/* Profile Photo */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-[var(--bg-tertiary)]/50 p-3.5 rounded-xl border border-[var(--border-color)]">
            <div className="relative flex-shrink-0 group">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Profile Preview"
                    className="w-20 h-20 rounded-xl object-cover border-2 border-primary-500 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCropModalOpen(true)}
                    className="absolute inset-0 bg-black/55 rounded-xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-medium transition-opacity cursor-pointer backdrop-blur-[1px]"
                    title="Crop / Adjust Photo"
                  >
                    <Crop className="w-4 h-4 mb-0.5" />
                    <span>Crop</span>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-xl bg-[var(--bg-primary)] border-2 border-dashed border-[var(--border-color)] hover:border-primary-500/60 flex flex-col items-center justify-center text-[var(--text-tertiary)] hover:text-primary-600 transition-colors cursor-pointer"
                  title="Choose Photo"
                >
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-medium">Photo</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Profile Photo <span className="text-error">*</span>
              </label>
              <p className="text-xs text-[var(--text-tertiary)] mb-2">
                Clear passport-size photo for your ID card and poster.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="text-xs text-[var(--text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 dark:file:bg-primary-950/60 dark:file:text-primary-300 hover:file:bg-primary-100 dark:hover:file:bg-primary-900/60 file:cursor-pointer cursor-pointer"
                />
                {photoPreview && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCropModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] text-xs font-semibold text-primary-600 dark:text-primary-400 transition-colors cursor-pointer shadow-xs"
                    >
                      <Crop className="w-3.5 h-3.5" />
                      <span>Adjust Crop</span>
                    </button>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-error/10 text-xs font-medium text-error transition-colors cursor-pointer"
                      title="Remove Photo"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
              </div>
              {errors.profilePhoto && (
                <p className="text-xs text-error mt-1">{errors.profilePhoto.message}</p>
              )}
            </div>
          </div>

          {/* Full Name */}
          <Input
            label="Name (Full Name)"
            icon={User}
            placeholder="ENTER FULL NAME"
            required
            error={errors.fullName?.message}
            {...register('fullName', { onChange: handleNameChange })}
          />

          {/* Father's Name */}
          <Input
            label="Father’s Name"
            icon={User}
            placeholder="Enter father's name"
            required
            error={errors.fatherName?.message}
            {...register('fatherName')}
          />

          {/* DOB & Blood Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              label="Date of Birth"
              required
              error={errors.dob?.message}
              placeholder="Select date of birth..."
              value={watch('dob')}
              onChange={(e) => setValue('dob', e.target.value, { shouldValidate: true })}
            />

            <Select
              label="Blood Group"
              icon={Droplet}
              required
              error={errors.bloodGroup?.message}
              placeholder="Select blood group..."
              options={BLOOD_GROUPS.map((bg) => ({ value: bg, label: bg }))}
              {...register('bloodGroup')}
            />
          </div>
        </div>

        {/* ─── SECTION 2: Contact Details ────────────────────────── */}
        <div className="bg-[var(--bg-primary)] p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] pb-2 border-b border-[var(--border-color)]">
            <Phone className="w-4 h-4 text-primary-500" />
            <span>Contact Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <PhoneNumberInput
                  label="Mobile Number (Mob)"
                  required
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val)
                    setValue('phone', val, { shouldValidate: false })
                  }}
                  error={errors.phone_number?.message || errors.phone?.message}
                  defaultCountry="in"
                />
              )}
            />

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">
                  WhatsApp Number <span className="text-error">*</span>
                </label>
                <button
                  type="button"
                  onClick={copyPhoneToWhatsapp}
                  className="inline-flex items-center gap-1 text-[11px] text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Same as Mob</span>
                </button>
              </div>
              <Controller
                name="whatsapp"
                control={control}
                render={({ field }) => (
                  <PhoneNumberInput
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.whatsapp?.message}
                    defaultCountry="in"
                  />
                )}
              />
            </div>
          </div>

          <Input
            label="E-mail"
            type="email"
            icon={Mail}
            placeholder="example@gmail.com"
            required
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        {/* ─── SECTION 3: Address & Location ─────────────────────── */}
        <div className="bg-[var(--bg-primary)] p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] pb-2 border-b border-[var(--border-color)]">
            <Home className="w-4 h-4 text-primary-500" />
            <span>Address & Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="House Name"
              icon={Home}
              placeholder="Enter house name / number"
              required
              error={errors.houseName?.message}
              {...register('houseName')}
            />

            <Input
              label="Place"
              icon={MapPin}
              placeholder="Enter place / locality"
              required
              error={errors.place?.message}
              {...register('place')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="PIN Code"
              icon={MapPin}
              placeholder="676505"
              maxLength={6}
              required
              error={errors.pin?.message}
              rightElement={
                pinLookupStatus === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                ) : pinLookupStatus === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : null
              }
              {...register('pin', {
                onChange: (e) => handlePinLookup(e.target.value),
              })}
            />

            <Input
              label="Post (Post Office)"
              icon={Building2}
              placeholder="Enter post office"
              required
              error={errors.post?.message}
              {...register('post')}
            />
          </div>

          {/* PIN Lookup feedback & multiple post offices picker */}
          {pinLookupStatus === 'loading' && (
            <div className="flex items-center gap-2 text-xs text-primary-600 dark:text-primary-400 bg-primary-50/70 dark:bg-primary-950/40 border border-primary-200/60 dark:border-primary-800/40 rounded-xl px-3.5 py-2.5">
              <Loader2 className="w-4 h-4 animate-spin text-primary-600 dark:text-primary-400 shrink-0" />
              <span>Fetching location details for PIN code...</span>
            </div>
          )}

          {pinLookupStatus === 'error' && (
            <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-xl px-3.5 py-2.5">
              <span>{pinLookupMessage || 'Could not auto-fetch location for this PIN code. Please enter manually.'}</span>
            </div>
          )}

          {pinLookupStatus === 'success' && (
            <div className="space-y-2.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl p-3.5 text-xs">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  Auto-detected: <strong>{pinLookupMessage}</strong>
                </span>
                <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 font-medium">
                  District & State auto-filled
                </span>
              </div>

              {availablePostOffices.length > 1 && (
                <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/30 space-y-1.5">
                  <div className="text-[11px] font-medium text-[var(--text-secondary)]">
                    Select your Post Office:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {availablePostOffices.map((po) => {
                      const isSelected = (watch('post') || '').trim().toLowerCase() === po.name.trim().toLowerCase()
                      return (
                        <button
                          key={po.name}
                          type="button"
                          onClick={() => handleSelectPostOffice(po)}
                          className={cn(
                            'px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer',
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white dark:bg-surface-800 border border-emerald-200 dark:border-emerald-800/60 text-surface-700 dark:text-surface-200 hover:border-emerald-500'
                          )}
                        >
                          {po.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Panchayath / Municipality"
              icon={Landmark}
              placeholder="Enter panchayath"
              required
              error={errors.panchayath?.message}
              {...register('panchayath')}
            />

            <Input
              label="Mandalam"
              icon={MapPin}
              placeholder="Assembly constituency"
              required
              error={errors.mandalam?.message}
              {...register('mandalam')}
            />

            <Input
              label="Thalukk (Taluk)"
              icon={Building2}
              placeholder="Enter thalukk"
              required
              error={errors.thaluk?.message}
              {...register('thaluk')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="District"
              icon={MapPin}
              required
              error={errors.district?.message}
              placeholder="Select district..."
              options={DISTRICTS.map((d) => ({ value: d, label: d }))}
              value={watch('district')}
              {...register('district')}
            />

            <Select
              label="State"
              icon={MapPin}
              required
              error={errors.state?.message}
              placeholder="Select state..."
              value={watch('state')}
              options={STATES.map((s) => ({ value: s, label: s }))}
              {...register('state')}
            />
          </div>
        </div>

        {/* ─── SECTION 4: Academic & Profession ──────────────────── */}
        <div className="bg-[var(--bg-primary)] p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] pb-2 border-b border-[var(--border-color)]">
            <GraduationCap className="w-4 h-4 text-primary-500" />
            <span>Academic & Profession</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Batch"
              icon={GraduationCap}
              required
              error={errors.batchId?.message}
              placeholder="Select batch..."
              options={batches.map((b) => ({ value: b.id, label: b.name }))}
              value={watch('batchId')}
              onBeforeSelect={handleBatchBeforeSelect}
              {...register('batchId')}
            />

            <Select
              label="Job Type"
              icon={Briefcase}
              required
              error={errors.jobType?.message}
              placeholder="Select job type..."
              options={JOB_TYPES.map((j) => ({ value: j, label: j }))}
              {...register('jobType')}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">
                ANWARI Certificate Number
              </label>
              <span className="text-[11px] font-medium text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full border border-[var(--border-color)]">
                Optional (4 digits)
              </span>
            </div>
            <Input
              icon={Award}
              placeholder="e.g. 4351"
              maxLength={4}
              inputMode="numeric"
              error={errors.anwariCertificateNo?.message}
              {...register('anwariCertificateNo', {
                onChange: (e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                  setValue('anwariCertificateNo', val, { shouldValidate: true })
                },
              })}
            />
          </div>

          {selectedJobType === 'Others' && (
            <Input
              label="Specify Job Type / Occupation"
              icon={Briefcase}
              required
              placeholder="Please specify your profession..."
              error={errors.jobTypeOther?.message}
              {...register('jobTypeOther')}
            />
          )}
        </div>

        {/* ─── SECTION 5: Payment Proof / Screenshot ──────────────── */}
        <div className="bg-[var(--bg-primary)] p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <CreditCard className="w-4 h-4 text-primary-500" />
              <span>Payment Screenshot</span>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400">
              Proof of Payment
            </span>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-[var(--text-secondary)]">
              Upload a screenshot or transaction receipt of your membership fee payment (UPI / GPay / PhonePe / Bank Transfer).
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3.5 bg-[var(--bg-tertiary)]/50 rounded-xl border border-[var(--border-color)]">
              <div className="relative flex-shrink-0">
                {paymentPreview ? (
                  <div className="relative group">
                    <img
                      src={paymentPreview}
                      alt="Payment Screenshot Preview"
                      className="w-20 h-20 rounded-xl object-cover border-2 border-primary-500 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={removePaymentScreenshot}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error text-white flex items-center justify-center shadow-md hover:bg-error/90 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-[var(--bg-primary)] border-2 border-dashed border-[var(--border-color)] flex flex-col items-center justify-center text-[var(--text-tertiary)]">
                    <Receipt className="w-6 h-6 mb-1 text-primary-500/70" />
                    <span className="text-[10px] font-medium">Receipt</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                  Upload Payment Screenshot / Receipt <span className="text-error">*</span>
                </label>
                <p className="text-xs text-[var(--text-tertiary)] mb-2">
                  Attach screenshot showing transaction reference / UTR ID (JPG, PNG, WEBP).
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePaymentChange}
                  className="text-xs text-[var(--text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 dark:file:bg-primary-950/60 dark:file:text-primary-300 hover:file:bg-primary-100 dark:hover:file:bg-primary-900/60 file:cursor-pointer cursor-pointer"
                />
                {errors.paymentScreenshot && (
                  <p className="text-xs text-error mt-1">{errors.paymentScreenshot.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── SECTION 6: Declaration ──────────────────────────── */}
        <div className="bg-[var(--bg-primary)] p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] pb-2 border-b border-[var(--border-color)]">
            <FileCheck2 className="w-4 h-4 text-primary-500" />
            <span>Declaration</span>
          </div>

          {/* Declaration Clause */}
          <div className="p-4 rounded-xl bg-primary-50/50 dark:bg-primary-950/20 border border-primary-200/60 dark:border-primary-900/40">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-[var(--border-color)] cursor-pointer"
                {...register('declarationAccepted')}
              />
              <span className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">
                I accept and agree to be bound by the bylaw of AALIA and Anvariyya. <span className="text-error">*</span>
              </span>
            </label>
            {errors.declarationAccepted && (
              <p className="text-xs text-error mt-2 pl-7">{errors.declarationAccepted.message}</p>
            )}
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-2">
          <Button
            type="submit"
            loading={applyMutation.isPending}
            className="w-full"
            size="lg"
            iconRight={ArrowRight}
          >
            Submit Application
          </Button>
        </div>
      </form>

        <div className="pt-2 pb-4 text-center text-xs text-[var(--text-tertiary)]">
          <div className="flex items-center justify-center gap-1.5">
            <span>Admin or Batch Coordinator?</span>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              <Lock className="w-3 h-3" />
              <span>Sign in here</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Photo Crop Modal */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        imageSrc={rawPhotoSrc}
        fileName={photoFileName}
        onClose={() => setIsCropModalOpen(false)}
        onCropSave={handleCropSave}
      />

      {/* Batch Selection Confirmation Modal */}
      <Modal
        isOpen={Boolean(confirmingBatch)}
        onClose={() => setConfirmingBatch(null)}
        title="Confirm Batch Selection"
        size="md"
      >
        {confirmingBatch && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-primary-50/60 dark:bg-primary-950/40 border border-primary-200/60 dark:border-primary-800/50 flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0 border border-primary-500/20 shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                    Alumni Batch
                  </span>
                  {confirmingBatch.batchCode && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-primary-500/10 text-primary-700 dark:text-primary-300 border border-primary-500/20">
                      {confirmingBatch.batchCode}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mt-0.5 font-display">
                  {confirmingBatch.name}
                </h3>
                {confirmingBatch.memberCount !== undefined && (
                  <p className="text-xs text-[var(--text-tertiary)] mt-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{confirmingBatch.memberCount} members currently registered</span>
                  </p>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)] text-xs text-[var(--text-secondary)] space-y-2">
              <p className="leading-relaxed">
                Are you sure you want to select <strong className="text-[var(--text-primary)] font-semibold">{confirmingBatch.name}</strong> as your graduating batch?
              </p>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Your application and membership ID will be officially affiliated with this batch and verified by its coordinators.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setConfirmingBatch(null)}
              >
                Choose Another
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                icon={Check}
                onClick={handleConfirmBatch}
              >
                Confirm Batch
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
