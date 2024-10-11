import { createUserSchema } from 'src/users/dto/create-user.dto';
import { z } from 'zod';

export const loginSchema = createUserSchema.pick({
  email: true,
  password: true,
});
export type LoginSchema = z.infer<typeof loginSchema>;
