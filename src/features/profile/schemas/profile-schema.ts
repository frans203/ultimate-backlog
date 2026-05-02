import { z } from 'zod'

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(20, 'Máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Apenas letras, números e _'),
  display_name: z.string().min(1, 'Nome obrigatório'),
  bio: z.string().max(200, 'Máximo 200 caracteres').optional().or(z.literal('')),
})

export type ProfileFormData = z.infer<typeof profileSchema>
