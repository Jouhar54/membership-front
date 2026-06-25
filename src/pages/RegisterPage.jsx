import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Mail, Phone, Upload, CheckCircle2, ArrowRight } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { applicationSchema } from '../lib/validations'
import { batchesApi, applicationsApi } from '../api/services'
import { DISTRICTS } from '../constants'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [photoPreview, setPhotoPreview] = useState(null)
  const [submittedApp, setSubmittedApp] = useState(null)

  const { data: batches = [] } = useQuery({
    queryKey: ['batches'],
    queryFn: batchesApi.getAll,
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      batchId: '',
      district: '',
      profilePhoto: undefined,
    },
  })

  const applyMutation = useMutation({
    mutationFn: applicationsApi.create,
    onSuccess: (data) => {
      toast.success('Application submitted successfully!')
      setSubmittedApp(data)
    },
    onError: (error) => {
      const msg = error.response?.data?.message || error.message || 'Submission failed. Please try again.'
      toast.error(msg)
    },
  })

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('profilePhoto', file, { shouldValidate: true })
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleNameChange = (e) => {
    setValue('fullName', e.target.value.toUpperCase())
  }

  const onSubmit = (data) => {
    applyMutation.mutate(data)
  }

  if (submittedApp) {
    return (
      <div className="text-center py-8 space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-50 dark:bg-success-950/30 text-success mb-2">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] font-display">
            Application Submitted!
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-sm mx-auto">
            Thank you, <span className="font-semibold text-[var(--text-primary)]">{submittedApp.fullName}</span>. Your application for <span className="font-semibold text-[var(--text-primary)]">{submittedApp.batchName || 'the selected batch'}</span> has been successfully recorded.
          </p>
        </div>

        <div className="bg-[var(--bg-tertiary)] p-4 rounded-2xl max-w-sm mx-auto text-left border border-[var(--border-color)] space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--text-tertiary)]">Status:</span>
            <span className="font-semibold text-warning">Under Review</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-tertiary)]">Email:</span>
            <span className="text-[var(--text-secondary)]">{submittedApp.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-tertiary)]">Phone:</span>
            <span className="text-[var(--text-secondary)]">{submittedApp.phone}</span>
          </div>
        </div>

        <div className="space-y-3 max-w-sm mx-auto pt-4">
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
            }}
          >
            Submit Another Application
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] font-display">
          Membership Application
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5">
          Submit your application to join the AALIA Alumni network.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Profile Photo */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile"
                className="w-16 h-16 rounded-xl object-cover border-2 border-[var(--border-color)]"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-[var(--bg-tertiary)] border-2 border-dashed border-[var(--border-color)] flex items-center justify-center">
                <Upload className="w-5 h-5 text-[var(--text-tertiary)]" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Profile Photo <span className="text-error">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="text-sm text-[var(--text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary-50 file:text-primary-700 dark:file:bg-primary-950/50 dark:file:text-primary-400 hover:file:bg-primary-100 file:cursor-pointer cursor-pointer"
            />
            {errors.profilePhoto && (
              <p className="text-xs text-error mt-1">{errors.profilePhoto.message}</p>
            )}
          </div>
        </div>

        <Input
          label="Full Name"
          icon={User}
          placeholder="Enter your full name"
          error={errors.fullName?.message}
          {...register('fullName', { onChange: handleNameChange })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Phone"
            icon={Phone}
            placeholder="9876543210"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Batch"
            error={errors.batchId?.message}
            placeholder="Select batch..."
            options={batches.map((b) => ({ value: b.id, label: b.name }))}
            {...register('batchId')}
          />

          <Select
            label="District"
            error={errors.district?.message}
            placeholder="Select district..."
            options={DISTRICTS.map((d) => ({ value: d, label: d }))}
            {...register('district')}
          />
        </div>

        <Button
          type="submit"
          loading={applyMutation.isPending}
          className="w-full mt-2"
          size="lg"
          iconRight={ArrowRight}
        >
          Submit Application
        </Button>
      </form>

      <p className="text-sm text-center text-[var(--text-secondary)] mt-6">
        Already applied?{' '}
        <Link to="/status-check" className="text-primary-600 hover:text-primary-700 font-medium">
          Check Application Status
        </Link>
      </p>
    </div>
  )
}
