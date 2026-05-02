import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormData } from '../schemas/profile-schema'
import { useUpdateProfile } from '../api/profile-mutations'
import { Input, Textarea, Button } from '@/shared/components/ui'
import type { Profile } from '@/shared/types/database.types'

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const updateProfile = useUpdateProfile()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile.username || '',
      display_name: profile.display_name || '',
      bio: profile.bio || '',
    },
  })

  useEffect(() => {
    reset({
      username: profile.username || '',
      display_name: profile.display_name || '',
      bio: profile.bio || '',
    })
  }, [profile, reset])

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <Input label="Username" {...register('username')} />
        {errors.username && <p className="text-xs text-neon-red mt-1">{errors.username.message}</p>}
      </div>
      <div>
        <Input label="Nome" {...register('display_name')} />
        {errors.display_name && <p className="text-xs text-neon-red mt-1">{errors.display_name.message}</p>}
      </div>
      <div>
        <Textarea label="Bio" rows={3} {...register('bio')} />
        {errors.bio && <p className="text-xs text-neon-red mt-1">{errors.bio.message}</p>}
      </div>
      {isDirty && (
        <Button type="submit" className="w-full" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? 'Salvando...' : 'Salvar'}
        </Button>
      )}
    </form>
  )
}
