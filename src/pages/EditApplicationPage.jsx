import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  User,
  Phone,
  Upload,
  ArrowRight,
  Droplet,
  GraduationCap,
  MapPin,
  Home,
  Mail,
  Briefcase,
  Building2,
  Landmark,
  Copy,
  Sparkles,
  Lock,
  Receipt,
  X,
  Crop,
  Search,
  Award,
  Check,
  Users,
  AlertCircle,
  ArrowLeft,
  Save,
  CheckCircle2,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { editApplicationSchema } from '../lib/validations'
import { batchesApi, applicationsApi } from '../api/services'
import { DISTRICTS, BLOOD_GROUPS, JOB_TYPES, STATES } from '../constants'
import { showApiErrorToast } from '../utils'
import Input from '../components/ui/Input'
import PhoneNumberInput from '../components/ui/PhoneNumberInput'
import Select from '../components/ui/Select'
import DatePicker from '../components/ui/DatePicker'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import DeveloperCTA from '../components/common/DeveloperCTA'
import ImageCropModal from '../components/ui/ImageCropModal'
import { PageLoader } from '../components/ui/LoadingStates'
import toast from 'react-hot-toast'

export default function EditApplicationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [photoPreview, setPhotoPreview] = useState(null)
  const [rawPhotoSrc, setRawPhotoSrc] = useState(null)
  const [photoFileName, setPhotoFileName] = useState('')
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const fileInputRef = useRef(null)
  const paymentInputRef = useRef(null)
  const [paymentPreview, setPaymentPreview] = useState(null)
  const [confirmingBatch, setConfirmingBatch] = useState(null)

  // Fetch batches
  const { data: batches = [] } = useQuery({
    queryKey: ['batches'],
    queryFn: batchesApi.getAll,
  })

  // Fetch application details by ID
  const {
    data: application,
    isLoading: isAppLoading,
    error: appError,
  } = useQuery({
    queryKey: ['application-edit', id],
    queryFn: () => applicationsApi.getById(id),
    retry: 1,
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editApplicationSchema),
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
      declarationAccepted: true,
      declarationDate: '',
      profilePhoto: undefined,
      paymentScreenshot: undefined,
    },
  })

  // Populate form with existing data once loaded
  useEffect(() => {
    if (application) {
      reset({
        fullName: application.fullName || '',
        fatherName: application.fatherName || '',
        dob: application.dob || '',
        bloodGroup: application.bloodGroup || '',
        houseName: application.houseName || '',
        place: application.place || '',
        post: application.post || '',
        pin: application.pin || '',
        whatsapp: application.whatsapp || '',
        phone_number: application.phone || '',
        phone: application.phone || '',
        email: application.email || '',
        batchId: application.batchId || (application.batch?._id || application.batch?.id) || '',
        district: application.district || '',
        state: application.state || 'Kerala',
        panchayath: application.panchayath || '',
        mandalam: application.mandalam || '',
        thaluk: application.thaluk || '',
        jobType: application.jobType || '',
        jobTypeOther: application.jobTypeOther || '',
        anwariCertificateNo: application.anwariCertificateNo || '',
        declarationAccepted: true,
        declarationDate: application.declarationDate || '',
      })

      if (application.profilePhoto) {
        setPhotoPreview(application.profilePhoto)
      }
      if (application.paymentScreenshot) {
        setPaymentPreview(application.paymentScreenshot)
      }
    }
  }, [application, reset])

  const selectedJobType = watch('jobType')
  const phoneValue = watch('phone_number') || watch('phone')

  const updateMutation = useMutation({
    mutationFn: (data) => applicationsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application-status', id] })
      queryClient.invalidateQueries({ queryKey: ['application-edit', id] })
      toast.success(
        application?.membershipStatus === 'rejected'
          ? 'Application resubmitted successfully for review!'
          : 'Application updated successfully!'
      )
      navigate(`/status/${id}`)
    },
    onError: (error) => {
      showApiErrorToast(error, 'Update failed. Please review your details and try again.')
    },
  })

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
    if (paymentInputRef.current) {
      paymentInputRef.current.value = ''
    }
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
    }
    updateMutation.mutate(payload)
  }

  if (isAppLoading) return <PageLoader />

  if (appError || !application) {
    return (
      <div className="text-center py-10 space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-error-50 dark:bg-error-950/30 text-error mb-2">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] font-display">
          Application Not Found
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
          We could not locate this application. Please verify the link or check your status first.
        </p>
        <Link
          to="/status-check"
          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Status Check
        </Link>
      </div>
    )
  }

  if (application.membershipStatus === 'approved') {
    return (
      <div className="text-center py-10 space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success-50 dark:bg-success-950/30 text-success mb-2">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] font-display">
          Application Already Approved
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
          Your membership has already been approved and your membership ID has been generated. Approved applications cannot be edited online. If you need any corrections, please contact your batch coordinator.
        </p>
        <Link to={`/status/${id}`}>
          <Button variant="primary" size="sm" icon={ArrowLeft}>
            Back to Status Page
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="h-full flex-1 overflow-y-auto pr-1.5 space-y-6 custom-scrollbar pb-10">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={`/status/${id}`}
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Status</span>
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
          Edit Mode
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] font-display">
          Edit Application Details
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Update your application details below.
        </p>
      </div>

      {/* Rejection Notice Banner if applicable */}
      {application.membershipStatus === 'rejected' && (
        <div className="p-4 rounded-xl border border-error/30 bg-error/10 text-sm space-y-2">
          <div className="flex items-center gap-2 text-error font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Reason for previous rejection:</span>
          </div>
          <p className="text-[var(--text-primary)] pl-6">
            {application.rejectionReason || 'Please review and correct your details.'}
          </p>
          <p className="text-xs text-[var(--text-secondary)] pl-6">
            Saving your changes will automatically resubmit your application as <strong>Under Review</strong> for administration.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ─── SECTION 1: Profile Photo ─────────────────────────── */}
        <div className="bg-[var(--bg-primary)] p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] pb-2 border-b border-[var(--border-color)]">
            <User className="w-4 h-4 text-primary-500" />
            <span>Profile Photo</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-dashed border-[var(--border-color)] overflow-hidden bg-[var(--bg-secondary)] flex items-center justify-center shadow-inner">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-[var(--text-tertiary)]" />
                )}
              </div>
              {photoPreview && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 p-1 bg-error text-white rounded-full shadow-md hover:bg-error-600 transition-colors cursor-pointer"
                  title="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={photoPreview ? Crop : Upload}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {photoPreview ? 'Change Photo' : 'Upload New Photo'}
                </Button>
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Accepted formats: JPEG, PNG, WEBP. If unchanged, current photo is retained.
              </p>
            </div>
          </div>
        </div>

        {/* ─── SECTION 2: Personal Information ──────────────────── */}
        <div className="bg-[var(--bg-primary)] p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] pb-2 border-b border-[var(--border-color)]">
            <User className="w-4 h-4 text-primary-500" />
            <span>Personal Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name (Capital Letters)"
              icon={User}
              placeholder="JOUHAR"
              required
              error={errors.fullName?.message}
              {...register('fullName', { onChange: handleNameChange })}
            />

            <Input
              label="Father's Name"
              icon={User}
              placeholder="Father's full name"
              required
              error={errors.fatherName?.message}
              {...register('fatherName')}
            />

            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Date of Birth (DOB)"
                  required
                  placeholder="DD/MM/YYYY"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.dob?.message}
                  maxDate={new Date().toISOString().split('T')[0]}
                />
              )}
            />

            <Controller
              name="bloodGroup"
              control={control}
              render={({ field }) => (
                <Select
                  label="Blood Group"
                  icon={Droplet}
                  required
                  searchable={false}
                  placeholder="Select blood group"
                  options={BLOOD_GROUPS}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.bloodGroup?.message}
                />
              )}
            />
          </div>
        </div>

        {/* ─── SECTION 3: Contact Details ───────────────────────── */}
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

        {/* ─── SECTION 4: Address & Location ─────────────────────── */}
        <div className="bg-[var(--bg-primary)] p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] pb-2 border-b border-[var(--border-color)]">
            <Home className="w-4 h-4 text-primary-500" />
            <span>Address & Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="House Name"
              icon={Home}
              placeholder="House name / Number"
              required
              error={errors.houseName?.message}
              {...register('houseName')}
            />

            <Input
              label="Place"
              icon={MapPin}
              placeholder="Town / Village"
              required
              error={errors.place?.message}
              {...register('place')}
            />

            <Input
              label="Post Office (Post)"
              icon={MapPin}
              placeholder="Post office name"
              required
              error={errors.post?.message}
              {...register('post')}
            />

            <Input
              label="PIN Code (Pin)"
              icon={MapPin}
              placeholder="676505"
              required
              maxLength={6}
              error={errors.pin?.message}
              {...register('pin')}
            />

            <Input
              label="Panchayath / Municipality"
              icon={Building2}
              placeholder="Panchayath or Municipality"
              required
              error={errors.panchayath?.message}
              {...register('panchayath')}
            />

            <Input
              label="Mandalam / Constituency"
              icon={Landmark}
              placeholder="Mandalam / Assembly constituency"
              required
              error={errors.mandalam?.message}
              {...register('mandalam')}
            />

            <Input
              label="Taluk / Thalukk"
              icon={Building2}
              placeholder="Taluk name"
              required
              error={errors.thaluk?.message}
              {...register('thaluk')}
            />

            <Controller
              name="district"
              control={control}
              render={({ field }) => (
                <Select
                  label="District"
                  icon={MapPin}
                  required
                  searchable={true}
                  placeholder="Select district"
                  options={DISTRICTS}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.district?.message}
                />
              )}
            />

            <div className="sm:col-span-2">
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Select
                    label="State"
                    icon={MapPin}
                    required
                    searchable={true}
                    placeholder="Select state"
                    options={STATES}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.state?.message}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* ─── SECTION 5: Batch & Academics ──────────────────────── */}
        <div className="bg-[var(--bg-primary)] p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] pb-2 border-b border-[var(--border-color)]">
            <GraduationCap className="w-4 h-4 text-primary-500" />
            <span>Batch & Academics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Controller
                name="batchId"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Select Your Batch"
                    icon={GraduationCap}
                    required
                    searchable={true}
                    placeholder="Choose your passed out batch"
                    options={batches.map((b) => ({
                      value: b.id,
                      label: `${b.name} (${b.year})`,
                    }))}
                    value={field.value}
                    onBeforeSelect={handleBatchBeforeSelect}
                    onChange={field.onChange}
                    error={errors.batchId?.message}
                  />
                )}
              />
            </div>

            <Controller
              name="jobType"
              control={control}
              render={({ field }) => (
                <Select
                  label="Profession / Job Type"
                  icon={Briefcase}
                  required
                  searchable={true}
                  placeholder="Select job type"
                  options={JOB_TYPES}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.jobType?.message}
                />
              )}
            />

            <Input
              label="ANWARI Certificate No."
              icon={Award}
              placeholder="e.g. 4351"
              maxLength={4}
              error={errors.anwariCertificateNo?.message}
              {...register('anwariCertificateNo')}
            />

            {selectedJobType === 'Others' && (
              <div className="sm:col-span-2">
                <Input
                  label="Specify Profession"
                  icon={Briefcase}
                  placeholder="Please specify your occupation"
                  required
                  error={errors.jobTypeOther?.message}
                  {...register('jobTypeOther')}
                />
              </div>
            )}
          </div>
        </div>

        {/* ─── SECTION 6: Payment Screenshot ─────────────────────── */}
        <div className="bg-[var(--bg-primary)] p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] pb-2 border-b border-[var(--border-color)]">
            <Receipt className="w-4 h-4 text-primary-500" />
            <span>Payment Receipt / Screenshot</span>
          </div>

          <div className="space-y-3">
            <input
              ref={paymentInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePaymentChange}
            />

            {paymentPreview ? (
              <div className="relative border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--bg-secondary)] max-w-sm">
                <img
                  src={paymentPreview}
                  alt="Payment Receipt Preview"
                  className="w-full max-h-48 object-contain bg-black/5"
                />
                <button
                  type="button"
                  onClick={removePaymentScreenshot}
                  className="absolute top-2 right-2 p-1.5 bg-error text-white rounded-full shadow-md hover:bg-error-600 transition-colors cursor-pointer"
                  title="Remove screenshot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => paymentInputRef.current?.click()}
                className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 transition-colors"
              >
                <Upload className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-2" />
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  Click to upload new payment receipt
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">
                  Leave unchanged to keep existing receipt.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link to={`/status/${id}`} className="flex-1 order-2 sm:order-1">
            <Button type="button" variant="secondary" className="w-full">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            className="flex-1 order-1 sm:order-2"
            icon={Save}
            loading={updateMutation.isPending}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Saving Changes...' : 'Save & Update Details'}
          </Button>
        </div>
      </form>

      {/* Image Crop Modal */}
      {rawPhotoSrc && (
        <ImageCropModal
          isOpen={isCropModalOpen}
          imageSrc={rawPhotoSrc}
          fileName={photoFileName}
          onClose={() => {
            setIsCropModalOpen(false)
            setRawPhotoSrc(null)
          }}
          onSave={handleCropSave}
        />
      )}

      {/* Batch Confirmation Modal */}
      <Modal
        isOpen={Boolean(confirmingBatch)}
        onClose={() => setConfirmingBatch(null)}
        title="Confirm Batch Selection"
        size="sm"
      >
        {confirmingBatch && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-900/40 text-center space-y-1">
              <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                Selected Batch
              </span>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                {confirmingBatch.name}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Year of Passing: <span className="font-medium text-[var(--text-primary)]">{confirmingBatch.year}</span>
              </p>
            </div>

            <p className="text-xs text-[var(--text-secondary)] text-center">
              Are you sure you want to change your registration to this batch?
            </p>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => setConfirmingBatch(null)}
              >
                Change
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={handleConfirmBatch}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <DeveloperCTA />
    </div>
  )
}
