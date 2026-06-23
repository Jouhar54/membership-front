import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .transform((val) => val.toUpperCase()),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .regex(/^\+91\d{10}$/, 'Phone must be in +91XXXXXXXXXX format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  batchId: z.string().min(1, 'Please select a batch'),
  district: z.string().min(1, 'Please select a district'),
  profilePhoto: z.any().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const batchSchema = z.object({
  name: z.string().min(2, 'Batch name is required'),
  year: z
    .string()
    .min(4, 'Year is required')
    .regex(/^\d{4}$/, 'Must be a valid year'),
  description: z.string().optional(),
})
