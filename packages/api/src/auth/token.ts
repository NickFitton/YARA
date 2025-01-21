import { z } from "zod";

export const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  username: z.string().email(),
});

export type TokenPayloadDto = z.infer<typeof tokenPayloadSchema>;
