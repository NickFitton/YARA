import { userCreationFormSchema } from "../sign-up/sign-up.schema";
import { z } from "zod";

export const loginSchema = userCreationFormSchema.pick({
  email: true,
  password: true,
});
export type LoginSchema = z.infer<typeof loginSchema>;
