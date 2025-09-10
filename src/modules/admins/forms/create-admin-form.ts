import { z } from "zod";

export const createAdminSchema = z.object({
  name: z.string().min(1, "validation.name.required").min(2, "validation.name.minLength"),
  email: z.string().min(1, "validation.email.required").email("validation.email.invalid"),
  phone: z.string().min(1, "validation.phone.required").min(10, "validation.phone.minLength"),
  password: z.string().min(1, "validation.password.required").min(8, "validation.password.minLength"),
});