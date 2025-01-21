import { z } from 'zod';
import { passwordSchema } from './create';

export const updatePasswordSchema = z.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});
export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;
