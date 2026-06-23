import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Mail, Phone, Lock, ArrowRight, Upload } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { registerSchema } from '../lib/validations'
import { useAuth } from '../context/AuthContext'
import { batchesApi } from '../api/services'
import { DISTRICTS } from '../constants'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)

  const { data: batches = [] } = useQuery({
    queryKey: ['batches'],
    queryFn: batchesApi.getAll,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '+91',
      password: '',
      confirmPassword: '',
      batchId: '',
      district: '',
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Map form fields to backend expected shape
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, batchId, ...rest } = data
      await registerUser({ ...rest, batch: batchId })
    } catch {
      // handled in context
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] font-display">
          Create your account
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5">
          Join the AALIA alumni network today
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
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="text-sm text-[var(--text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary-50 file:text-primary-700 dark:file:bg-primary-950/50 dark:file:text-primary-400 hover:file:bg-primary-100 file:cursor-pointer cursor-pointer"
            />
          </div>
        </div>

        <Input
          label="Full Name"
          icon={User}
          placeholder="Enter your full name"
          error={errors.fullName?.message}
          style={{ textTransform: 'uppercase' }}
          {...register('fullName')}
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
            placeholder="+91XXXXXXXXXX"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="Min 6 characters"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirm Password"
            type="password"
            icon={Lock}
            placeholder="Re-enter password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          size="lg"
          iconRight={ArrowRight}
        >
          Create Account
        </Button>
      </form>

      <p className="text-sm text-center text-[var(--text-secondary)] mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
