import { z } from 'zod';

export const payloadSchema = z.object({
  sub: z.string().uuid(),
  username: z.string().email(),
});
export type PayloadSchema = z.infer<typeof payloadSchema>;
