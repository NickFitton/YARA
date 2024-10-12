import { z } from "zod";

export const userCreationFormSchema = z.object({
  firstName: z.string().trim().min(1, { message: "Required" }).max(50),
  lastName: z.string().trim().min(1, { message: "Required" }).max(100),
  email: z.string().email().max(254),
  password: z
    .string()
    .trim()
    .min(12, { message: "Must be longer than 12 characters" })
    .max(64),
});
export type UserCreationForm = z.infer<typeof userCreationFormSchema>;
