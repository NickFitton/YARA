import { z } from 'zod';

export const updatePasswordSchema = z.object({
  oldPassword: z
    .string()
    .trim()
    .min(12, { message: 'Must be longer than 12 characters' })
    .max(64),
  newPassword: z
    .string()
    .trim()
    .min(12, { message: 'Must be longer than 12 characters' })
    .max(64),
});
export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
