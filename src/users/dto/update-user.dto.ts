import { z } from 'zod';
import { createUserSchema } from './create-user.dto';

export const internalUpdateUserSchema = createUserSchema.partial();
export type InternalUpdateUserSchema = z.infer<typeof internalUpdateUserSchema>;

export const updateUserSchema = internalUpdateUserSchema.omit({
  password: true,
});
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
