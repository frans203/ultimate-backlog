import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { registerSchema, type RegisterFormData } from '../schemas/auth-schemas'
import { signUpWithEmail } from '../api/auth-actions'
import { Input, Button } from '@/shared/components/ui'

interface RegisterFormProps {
  onSuccess: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('')
      await signUpWithEmail(data.email, data.password, data.username, data.displayName)
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input label="Email" type="email" placeholder="> seu@email.com" {...register('email')} />
        {errors.email && <p className="text-xs text-neon-red mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <Input label="Username" placeholder="> gamer_001" {...register('username')} />
        {errors.username && <p className="text-xs text-neon-red mt-1">{errors.username.message}</p>}
      </div>

      <div>
        <Input label="Nome" placeholder="> Seu nome" {...register('displayName')} />
        {errors.displayName && <p className="text-xs text-neon-red mt-1">{errors.displayName.message}</p>}
      </div>

      <div>
        <Input label="Senha" type="password" placeholder="> ******" {...register('password')} />
        {errors.password && <p className="text-xs text-neon-red mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <Input label="Confirmar Senha" type="password" placeholder="> ******" {...register('confirmPassword')} />
        {errors.confirmPassword && <p className="text-xs text-neon-red mt-1">{errors.confirmPassword.message}</p>}
      </div>

      {error && <p className="text-xs text-neon-red text-center">{error}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
      </Button>
    </form>
  )
}
