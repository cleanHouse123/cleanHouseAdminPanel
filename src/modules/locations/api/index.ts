import { axiosInstance } from "@/core/config/axios";

import { AxiosResponse } from "axios";
import { CreateLocationDto, LocationDto } from "../types";
import { PaginationResponse } from "@/core/types/api";

export const locationsApi = {
  create: (data: CreateLocationDto) =>
    axiosInstance
      .post<CreateLocationDto, AxiosResponse<LocationDto>>(
        "/address/locations",
        data
      )
      .then((res) => res.data),

  findAll: (params?: { page?: number; limit?: number }) =>
    axiosInstance
      .get<LocationDto[] | PaginationResponse<LocationDto>>(
        "/address/locations",
        { params }
      )
      .then((res) => {
        const data = res.data;
        // Если сервер возвращает массив, преобразуем в формат пагинации с клиентской пагинацией
        if (Array.isArray(data)) {
          const page = params?.page || 1;
          const limit = params?.limit || data.length;
          const total = data.length;
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedData = data.slice(startIndex, endIndex);

          return {
            data: paginatedData,
            total,
            page,
            limit,
          } as PaginationResponse<LocationDto>;
        }
        return data as PaginationResponse<LocationDto>;
      }),

  remove: (id: string) =>
    axiosInstance.delete(`/address/locations/${id}`).then(() => undefined),
};
