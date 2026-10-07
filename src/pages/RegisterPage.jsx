import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
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
  Calendar,
  Home,
  Mail,
  Briefcase,
  FileSignature,
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
} from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { applicationSchema } from '../lib/validations'
import { batchesApi, applicationsApi } from '../api/services'
import { DISTRICTS, BLOOD_GROUPS, JOB_TYPES, STATES } from '../constants'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import DatePicker from '../components/ui/DatePicker'
import Button from '../components/ui/Button'
import DeveloperCTA from '../components/common/DeveloperCTA'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [photoPreview, setPhotoPreview] = useState(null)
  const [signaturePreview, setSignaturePreview] = useState(null)
  const [paymentPreview, setPaymentPreview] = useState(null)
  const [submittedApp, setSubmittedApp] = useState(null)

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
      declarationAccepted: false,
      declarationDate: todayStr,
      profilePhoto: undefined,
      signature: undefined,
      paymentScreenshot: undefined,
    },
  })

  const selectedJobType = watch('jobType')
  const phoneValue = watch('phone')

  const applyMutation = useMutation({
    mutationFn: applicationsApi.create,
    onSuccess: (data) => {
      toast.success('Application submitted successfully!')
      setSubmittedApp(data)
    },
    onError: (error) => {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Submission failed. Please try again.'
      toast.error(msg)
    },
  })

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('profilePhoto', file, { shouldValidate: true })
      const reader = new FileReader()
      reader.onload = (ev) => setPhotoPreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSignatureChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('signature', file, { shouldValidate: true })
      const reader = new FileReader()
      reader.onload = (ev) => setSignaturePreview(ev.target.result)
      reader.readAsDataURL(file)
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

  const onSubmit = (data) => {
    const payload = {
      ...data,
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
              <span className="text-[var(--text-primary)] font-medium">{submittedApp.phone}</span>
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
              setSignaturePreview(null)
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
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] hover:border-primary-500/50 text-xs font-semibold text-[var(--text-secondary)] hover:text-primary-600 dark:hover:text-primary-400 transition-all shadow-sm flex-shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-primary-500" />
            <span>Admin Login</span>
          </Link>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-display tracking-tight">
          Membership Application
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Please fill in all the details carefully to submit your application for AALIA.
        </p>
      </div>

      {/* Scrollable Middle Content */}
      <div className="flex-1 overflow-y-auto pr-1.5 space-y-6 custom-scrollbar pb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ─── SECTION 1: Personal Details ───────────────────────── */}
        <div className="bg-[var(--bg-primary)] p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] pb-2 border-b border-[var(--border-color)]">
            <User className="w-4 h-4 text-primary-500" />
            <span>Personal Details</span>
          </div>

          {/* Profile Photo */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-[var(--bg-tertiary)]/50 p-3.5 rounded-xl border border-[var(--border-color)]">
            <div className="relative flex-shrink-0">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-xl object-cover border-2 border-primary-500 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-[var(--bg-primary)] border-2 border-dashed border-[var(--border-color)] flex flex-col items-center justify-center text-[var(--text-tertiary)]">
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
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="text-xs text-[var(--text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 dark:file:bg-primary-950/60 dark:file:text-primary-300 hover:file:bg-primary-100 dark:hover:file:bg-primary-900/60 file:cursor-pointer cursor-pointer"
              />
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
            error={errors.fullName?.message}
            {...register('fullName', { onChange: handleNameChange })}
          />

          {/* Father's Name */}
          <Input
            label="Father’s Name"
            icon={User}
            placeholder="Enter father's name"
            error={errors.fatherName?.message}
            {...register('fatherName')}
          />

          {/* DOB & Blood Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              label="Date of Birth"
              error={errors.dob?.message}
              placeholder="Select date of birth..."
              value={watch('dob')}
              onChange={(e) => setValue('dob', e.target.value, { shouldValidate: true })}
            />

            <Select
              label="Blood Group"
              icon={Droplet}
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
            <Input
              label="Mobile Number (Mob)"
              icon={Phone}
              placeholder="9876543210"
              error={errors.phone?.message}
              {...register('phone')}
            />

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">
                  WhatsApp Number
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
              <Input
                icon={Phone}
                placeholder="9876543210"
                error={errors.whatsapp?.message}
                {...register('whatsapp')}
              />
            </div>
          </div>

          <Input
            label="E-mail"
            type="email"
            icon={Mail}
            placeholder="example@gmail.com"
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
              error={errors.houseName?.message}
              {...register('houseName')}
            />

            <Input
              label="Place"
              icon={MapPin}
              placeholder="Enter place / locality"
              error={errors.place?.message}
              {...register('place')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Post (Post Office)"
              icon={Building2}
              placeholder="Enter post office"
              error={errors.post?.message}
              {...register('post')}
            />

            <Input
              label="PIN Code"
              icon={MapPin}
              placeholder="676505"
              maxLength={6}
              error={errors.pin?.message}
              {...register('pin')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Panchayath / Municipality"
              icon={Landmark}
              placeholder="Enter panchayath"
              error={errors.panchayath?.message}
              {...register('panchayath')}
            />

            <Input
              label="Mandalam"
              icon={MapPin}
              placeholder="Assembly constituency"
              error={errors.mandalam?.message}
              {...register('mandalam')}
            />

            <Input
              label="Thalukk (Taluk)"
              icon={Building2}
              placeholder="Enter thalukk"
              error={errors.thaluk?.message}
              {...register('thaluk')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="District"
              icon={MapPin}
              error={errors.district?.message}
              placeholder="Select district..."
              options={DISTRICTS.map((d) => ({ value: d, label: d }))}
              {...register('district')}
            />

            <Select
              label="State"
              icon={MapPin}
              error={errors.state?.message}
              placeholder="Select state..."
              defaultValue="Kerala"
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
              error={errors.batchId?.message}
              placeholder="Select batch..."
              options={batches.map((b) => ({ value: b.id, label: b.name }))}
              {...register('batchId')}
            />

            <Select
              label="Job Type"
              icon={Briefcase}
              error={errors.jobType?.message}
              placeholder="Select job type..."
              options={JOB_TYPES.map((j) => ({ value: j, label: j }))}
              {...register('jobType')}
            />
          </div>

          {selectedJobType === 'Others' && (
            <Input
              label="Specify Job Type / Occupation"
              icon={Briefcase}
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
                  Upload Payment Screenshot / Receipt
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

        {/* ─── SECTION 6: Declaration & Signature ────────────────── */}
        <div className="bg-[var(--bg-primary)] p-4 sm:p-5 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] pb-2 border-b border-[var(--border-color)]">
            <FileCheck2 className="w-4 h-4 text-primary-500" />
            <span>Declaration & Signature</span>
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
                I accept and agree to be bound by the bylaw of AALIA and Anvariyya.
              </span>
            </label>
            {errors.declarationAccepted && (
              <p className="text-xs text-error mt-2 pl-7">{errors.declarationAccepted.message}</p>
            )}
          </div>

          {/* Signature Upload */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-sm font-medium text-[var(--text-secondary)]">
              Signature <span className="text-error">*</span>
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-[var(--bg-tertiary)]/40 rounded-xl border border-[var(--border-color)]">
              <div className="relative flex-shrink-0">
                {signaturePreview ? (
                  <img
                    src={signaturePreview}
                    alt="Signature Preview"
                    className="w-32 h-14 rounded-lg object-contain bg-white dark:bg-slate-900 border border-[var(--border-color)] p-1.5 shadow-sm"
                  />
                ) : (
                  <div className="w-32 h-14 rounded-lg bg-[var(--bg-primary)] border border-dashed border-[var(--border-color)] flex flex-col items-center justify-center text-[var(--text-tertiary)]">
                    <FileSignature className="w-5 h-5 mb-0.5" />
                    <span className="text-[10px] font-medium">Signature</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureChange}
                  className="text-xs text-[var(--text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 dark:file:bg-primary-950/60 dark:file:text-primary-300 hover:file:bg-primary-100 file:cursor-pointer cursor-pointer"
                />
                <p className="text-[11px] text-[var(--text-tertiary)] mt-1">
                  Upload a photo or scanned copy of your signature
                </p>
              </div>
            </div>
            {errors.signature && (
              <p className="text-xs text-error mt-1">{errors.signature.message}</p>
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

        <div className="pt-2 pb-4 space-y-2 text-center text-sm text-[var(--text-secondary)]">
          <p>
            Already applied?{' '}
            <Link
              to="/status-check"
              className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
            >
              Check Application Status
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 pt-1 text-xs text-[var(--text-tertiary)]">
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
    </div>
  )
}
