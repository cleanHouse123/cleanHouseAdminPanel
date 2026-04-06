export type LocationDto = {
  id: string;
  region: string | null;
  area: string | null;
  city: string | null;
  settlement: string | null;
  street: string | null;
  /** Административный район города (фильтр DaData, напр. Петроградский) */
  city_district: string | null;
  /** Муниципальный округ (фильтр DaData, напр. Ланское) */
  sub_area: string | null;
  created_at: Date;
  updated_at: Date;
};

export type CreateLocationDto = {
  region: string | null;
  area: string | null;
  city: string | null;
  settlement: string | null;
  city_district: string | null;
  sub_area: string | null;
};