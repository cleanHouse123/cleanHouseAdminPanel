export type LocationDto = {
  id: string;
  region: string | null;
  area: string | null;
  city: string | null;
  settlement: string | null;
  street: string | null;
  created_at: Date;
  updated_at: Date;
}


export type CreateLocationDto = {
  region: string | null;
  area: string | null;
  city: string | null;
  settlement: string | null;
}