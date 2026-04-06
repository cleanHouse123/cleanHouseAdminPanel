import { z } from "zod";

/** Пустая строка / undefined → null; иначе trim. Тип поля строго `string | null` (без `undefined`). */
const optionalDaDataString = z.preprocess(
  (val: unknown) => {
    if (val === undefined || val === null) return null;
    if (typeof val !== "string") return null;
    const t = val.trim();
    return t === "" ? null : t;
  },
  z.union([z.string(), z.null()]),
);

export const createLocationSchema = z.object({
  region: z.string().min(1, "validation.region.required").min(2, "validation.region.minLength").nullable(),
  area: z.string().min(1, "validation.area.required").min(2, "validation.area.minLength").nullable(),
  city: z.string().min(1, "validation.city.required").min(2, "validation.city.minLength").nullable(),
  settlement: z.string().min(1, "validation.settlement.required").min(2, "validation.settlement.minLength").nullable(),
  city_district: optionalDaDataString,
  sub_area: optionalDaDataString,
});
