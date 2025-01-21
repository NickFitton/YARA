import { z } from 'zod';
import { createUserSchema } from './create';

export const updateUserSchema = createUserSchema.partial().omit({
  password: true,
});
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
