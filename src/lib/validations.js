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

export const createBatchAdminSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .transform((val) => val.toUpperCase()),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .regex(/^[6-9]\d{9}$/, 'Valid 10-digit phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  batchId: z.string().min(1, 'Please select a batch'),
})

export const editBatchAdminSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .transform((val) => val.toUpperCase()),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .regex(/^[6-9]\d{9}$/, 'Valid 10-digit phone number is required'),
  batchId: z.string().min(1, 'Please select a batch'),
})

export const cleanPhone = (val) => {
  if (typeof val !== 'string') return val
  let cleaned = val.replace(/\s+/g, '')
  cleaned = cleaned.replace(/^\+91/, '')
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2)
  }
  cleaned = cleaned.replace(/^0/, '')
  return cleaned
}

export const applicationSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .transform((val) => val.toUpperCase()),
  fatherName: z.string().min(2, "Father's name is required"),
  dob: z.string().min(1, 'Date of birth is required'),
  bloodGroup: z.string().min(1, 'Please select a blood group'),
  houseName: z.string().min(1, 'House name is required'),
  place: z.string().min(1, 'Place is required'),
  post: z.string().min(1, 'Post office is required'),
  pin: z
    .string()
    .min(1, 'PIN code is required')
    .regex(/^\d{6}$/, 'PIN code must be exactly 6 digits'),
  whatsapp: z
    .preprocess(
      (val) => cleanPhone(val),
      z.string().min(1, 'WhatsApp number is required').regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit phone number')
    ),
  phone: z
    .preprocess(
      (val) => cleanPhone(val),
      z.string().min(1, 'Mobile number is required').regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number')
    ),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  batchId: z.string().min(1, 'Please select a batch'),
  district: z.string().min(1, 'Please select a district'),
  state: z.string().min(1, 'Please select/enter state'),
  panchayath: z.string().min(1, 'Panchayath / Municipality is required'),
  mandalam: z.string().min(1, 'Mandalam / Constituency is required'),
  thaluk: z.string().min(1, 'Taluk / Thalukk is required'),
  jobType: z.string().min(1, 'Please select a job type'),
  jobTypeOther: z.string().optional(),
  declarationAccepted: z
    .boolean()
    .refine((val) => val === true, 'You must accept the declaration to proceed'),
  declarationDate: z.string().optional(),
  profilePhoto: z.any().refine((file) => {
    if (file instanceof FileList) return file.length > 0
    if (file instanceof File) return true
    return false
  }, 'Profile photo is required'),
  signature: z.any().refine((file) => {
    if (file instanceof FileList) return file.length > 0
    if (file instanceof File) return true
    return false
  }, 'Signature image is required'),
})

