import { z } from "zod";

export const createLocationSchema = z.object({
  region: z.string().min(1, "validation.region.required").min(2, "validation.region.minLength").nullable(),
  area: z.string().min(1, "validation.area.required").min(2, "validation.area.minLength").nullable(),
  city: z.string().min(1, "validation.city.required").min(2, "validation.city.minLength").nullable(),
  settlement: z.string().min(1, "validation.settlement.required").min(2, "validation.settlement.minLength").nullable(),
});
