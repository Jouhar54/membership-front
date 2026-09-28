import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { loginSchema } from '../lib/validations'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function LoginPage() {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await login(data)
    } catch {
      // handled in context
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col justify-center overflow-y-auto">
      <div className="my-auto py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] font-display">
            Welcome back
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5">
            Sign in to your AALIA membership account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-[var(--border-color)] text-primary-600 focus:ring-primary-500 cursor-pointer" />
              Remember me
            </label>
            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
            iconRight={ArrowRight}
          >
            Sign In
          </Button>
        </form>

        <p className="text-sm text-center text-[var(--text-secondary)] mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}
