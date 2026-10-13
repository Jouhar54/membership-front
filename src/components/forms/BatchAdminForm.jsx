import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { GraduationCap } from 'lucide-react'
import { createBatchAdminSchema, editBatchAdminSchema } from '../../lib/validations'
import { batchesApi } from '../../api/services'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

export default function BatchAdminForm({ defaultValues, onSubmit, isPending, isEdit }) {
  const schema = isEdit ? editBatchAdminSchema : createBatchAdminSchema

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      batchId: '',
    },
  })

  // Prefill form if defaultValues change
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  // Fetch batches for selection dropdown
  const { data: batches, isLoading: loadingBatches } = useQuery({
    queryKey: ['batches'],
    queryFn: batchesApi.getAll,
  })

  const batchOptions = (batches || []).map((b) => ({
    value: b.id,
    label: b.batchCode ? `${b.name} (${b.batchCode})` : b.name,
  }))

  const handleFormSubmit = (data) => {
    onSubmit(data)
  }

  const selectedBatchId = watch('batchId')

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="JOHN DOE"
        className="uppercase"
        error={errors.fullName?.message}
        {...register('fullName', {
          onChange: (e) => {
            setValue('fullName', e.target.value.toUpperCase(), { shouldValidate: true })
          },
        })}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="email@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Phone Number"
        placeholder="+91XXXXXXXXXX"
        error={errors.phone?.message}
        {...register('phone')}
      />

      {!isEdit && (
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
      )}

      <Select
        label="Select Batch"
        icon={GraduationCap}
        placeholder={loadingBatches ? 'Loading batches...' : 'Choose a batch'}
        options={batchOptions}
        disabled={loadingBatches}
        error={errors.batchId?.message}
        value={selectedBatchId || ''}
        onChange={(e) => {
          setValue('batchId', e.target.value, { shouldValidate: true, shouldDirty: true })
        }}
      />

      <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
        <Button type="submit" loading={isPending}>
          {isEdit ? 'Save Changes' : 'Create Batch Admin'}
        </Button>
      </div>
    </form>
  )
}
