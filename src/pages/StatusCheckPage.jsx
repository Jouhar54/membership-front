import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Phone, Search, ArrowRight } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { applicationsApi } from '../api/services'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import toast from 'react-hot-toast'

const statusCheckSchema = z
  .object({
    email: z.string().trim().optional(),
    phone: z.string().trim().optional(),
  })
  .refine((data) => (data.email && data.email.length > 0) || (data.phone && data.phone.length > 0), {
    message: 'Please fill in at least one field (Email or Phone)',
    path: ['email'],
  })

export default function StatusCheckPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(statusCheckSchema),
    defaultValues: {
      email: '',
      phone: '',
    },
  })

  const checkMutation = useMutation({
    mutationFn: async (data) => {
      const searchKey = data.email || data.phone
      return await applicationsApi.checkStatus(searchKey)
    },
    onSuccess: (data) => {
      if (data?._id) {
        toast.success('Application found!')
        navigate(`/status/${data._id}`)
      } else {
        toast.error('Application found, but no ID was returned.')
      }
    },
    onError: (error) => {
      const msg = error.response?.data?.message || error.message || 'Application not found.'
      toast.error(msg)
    },
  })

  const onSubmit = (data) => {
    checkMutation.mutate(data)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] font-display">
          Check Application Status
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5">
          Enter your registered email or phone number to look up your application.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="Enter registered email"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-[var(--border-color)]"></div>
          <span className="flex-shrink mx-4 text-xs text-[var(--text-tertiary)] uppercase font-semibold">OR</span>
          <div className="flex-grow border-t border-[var(--border-color)]"></div>
        </div>

        <Input
          label="Phone Number"
          icon={Phone}
          placeholder="Enter registered phone number"
          error={errors.phone?.message}
          {...register('phone')}
        />

        {errors.email?.message && !errors.phone?.message && (
          <p className="text-xs text-error">{errors.email.message}</p>
        )}

        <Button
          type="submit"
          loading={checkMutation.isPending}
          className="w-full mt-2"
          size="lg"
          iconRight={ArrowRight}
        >
          Check Status
        </Button>
      </form>

      <p className="text-sm text-center text-[var(--text-secondary)] mt-6">
        Haven't applied yet?{' '}
        <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
          Submit Application
        </Link>
      </p>
    </div>
  )
}
