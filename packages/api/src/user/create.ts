import { z } from 'zod';

export const passwordSchema = z
    .string()
    .trim()
    .min(12, { message: 'Must be longer than 12 characters' })
    .max(64);
export const createUserSchema = z.object({
  firstName: z.string().trim().min(1, { message: 'Required' }).max(50),
  lastName: z.string().trim().min(1, { message: 'Required' }).max(100),
  email: z.string().email().max(254),
  password: passwordSchema,
});
export type CreateUserDto = z.infer<typeof createUserSchema>;
