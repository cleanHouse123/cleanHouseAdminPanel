import { z } from "zod";

export const updateAdminSchema = z.object({
  name: z.string().min(1, "validation.name.required").min(2, "validation.name.minLength").optional(),
  email: z.string().min(1, "validation.email.required").email("validation.email.invalid").optional(),
  phone: z.string().min(1, "validation.phone.required").min(10, "validation.phone.minLength").optional(),
  password: z.union([
    z.string().min(8, "validation.password.minLength"),
    z.literal(""),
  ]).optional(),
});

