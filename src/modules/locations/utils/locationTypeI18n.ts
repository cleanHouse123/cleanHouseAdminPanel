/** Ключи i18n для бейджа типа локации (динамический шаблон `locations.type.${type}` в i18next иногда не подхватывает camelCase). */
export const LOCATION_TYPE_I18N_KEYS: Record<string, string> = {
  subArea: "locations.type.subArea",
  cityDistrict: "locations.type.cityDistrict",
  settlement: "locations.type.settlement",
  city: "locations.type.city",
  area: "locations.type.area",
  region: "locations.type.region",
  unknown: "locations.type.unknown",
};

export function getLocationTypeI18nKey(type: string): string {
  return LOCATION_TYPE_I18N_KEYS[type] ?? LOCATION_TYPE_I18N_KEYS.unknown;
}
