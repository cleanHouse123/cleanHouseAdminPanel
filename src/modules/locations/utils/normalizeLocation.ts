import type { LocationDto } from "../types";

/** Сырой объект с API (snake_case и/или camelCase). */
type RawLocation = Record<string, unknown>;

export function normalizeLocation(raw: RawLocation): LocationDto {
  return {
    id: String(raw.id ?? ""),
    region: (raw.region as string | null) ?? null,
    area: (raw.area as string | null) ?? null,
    city: (raw.city as string | null) ?? null,
    settlement: (raw.settlement as string | null) ?? null,
    street: (raw.street as string | null) ?? null,
    city_district:
      (raw.city_district as string | null | undefined) ??
      (raw.cityDistrict as string | null | undefined) ??
      null,
    sub_area:
      (raw.sub_area as string | null | undefined) ??
      (raw.subArea as string | null | undefined) ??
      null,
    created_at: raw.created_at as LocationDto["created_at"],
    updated_at: raw.updated_at as LocationDto["updated_at"],
  };
}
