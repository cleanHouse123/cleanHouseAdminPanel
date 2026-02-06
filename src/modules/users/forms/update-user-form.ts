import { z } from "zod";
import { UserRole } from "@/core/types/user";

export const updateUserSchema = z.object({
  name: z.string().min(1, "validation.name.required").min(2, "validation.name.minLength").optional(),
  phone: z.string().min(1, "validation.phone.required").min(10, "validation.phone.minLength").optional(),
  email: z.string().email("validation.email.invalid").optional().or(z.literal("")),
  roles: z.array(z.nativeEnum(UserRole)).optional(),
});

