import { axiosInstance } from '@/core/config/axios';
import {
  UserAddress,
  FindAddressesQueryDto,
  AddressesListResponse,
  MostCommonStreet,
} from '../types';

export const addressesApi = {
  findAll: (params?: FindAddressesQueryDto) =>
    axiosInstance
      .get<AddressesListResponse>('/admin/user-address', { params })
      .then((res) => res.data),

  delete: (id: string) =>
    axiosInstance.delete(`/user-address/${id}`).then(() => undefined),

  getMostCommonStreets: (limit?: number) =>
    axiosInstance
      .get<MostCommonStreet[]>('/admin/user-address/most-common-streets', {
        params: limit ? { limit } : undefined,
      })
      .then((res) => res.data),
};

