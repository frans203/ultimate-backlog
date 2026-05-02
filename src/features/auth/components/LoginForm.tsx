import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { loginSchema, type LoginFormData } from '../schemas/auth-schemas'
import { signInWithEmail } from '../api/auth-actions'
import { Input, Button } from '@/shared/components/ui'

interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('')
      await signInWithEmail(data.email, data.password)
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          label="Email"
          type="email"
          placeholder="> seu@email.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-neon-red mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input
          label="Senha"
          type="password"
          placeholder="> ******"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-xs text-neon-red mt-1">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <p className="text-xs text-neon-red text-center">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}
