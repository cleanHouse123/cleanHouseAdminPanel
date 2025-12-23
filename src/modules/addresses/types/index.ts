import { PaginationResponse } from '@/core/types/api';

export interface DaDataAddressDataNormalized {
  value: string;
  unrestricted_value: string;
  display: string;
  region: string | null;
  region_with_type: string | null;
  area: string | null;
  area_with_type: string | null;
  city: string | null;
  city_with_type: string | null;
  settlement: string | null;
  settlement_with_type: string | null;
  is_microdistrict: boolean;
  city_or_settlement: string | null;
  street: string | null;
  street_with_type: string | null;
  house: string | null;
  postal_code: string | null;
  geo_lat: string | null;
  geo_lon: string | null;
  fias_id: string | null;
  fias_level: string | null;
  kladr_id: string | null;
  okato: string | null;
  oktmo: string | null;
  tax_office: string | null;
}

export interface AddressDetails {
  building?: number;
  buildingBlock?: string;
  entrance?: string;
  floor?: number;
  apartment?: number;
  domophone?: string;
}

export interface UserAddress {
  id: string;
  userId: string;
  address: DaDataAddressDataNormalized | null;
  isPrimary: boolean;
  isSupportableArea: boolean;
  addressDetails: AddressDetails | null;
  created_at: string;
  updated_at: string;
}

export interface FindAddressesQueryDto {
  page?: number;
  limit?: number;
  userId?: string;
  addressName?: string;
}

export interface AddressFilters {
  userId: string;
  addressName: string;
  page: number;
}

export interface MostCommonStreet {
  street: string;
  count: number;
}

export interface AddressesListResponse extends PaginationResponse<UserAddress> {}

