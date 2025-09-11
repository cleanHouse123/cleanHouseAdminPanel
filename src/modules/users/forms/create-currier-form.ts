import { z } from "zod";

export const createCurrierSchema = z.object({
  name: z.string().min(1, "validation.name.required").min(2, "validation.name.minLength"),
  phone: z.string().min(1, "validation.phone.required").min(10, "validation.phone.minLength"),
});