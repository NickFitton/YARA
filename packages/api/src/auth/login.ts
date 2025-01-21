import { createUserSchema } from '../user/create';
import { z } from 'zod';

export const loginSchema = createUserSchema.pick({
  email: true,
  password: true,
});
export type LoginDto = z.infer<typeof loginSchema>;

export type TokenDto = {
  accessToken: string
}