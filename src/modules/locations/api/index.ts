import { axiosInstance } from "@/core/config/axios";

import { AxiosResponse } from "axios";
import { CreateLocationDto, LocationDto } from "../types";
import { PaginationResponse } from "@/core/types/api";
import { normalizeLocation } from "../utils/normalizeLocation";

export const locationsApi = {
  create: (data: CreateLocationDto) =>
    axiosInstance
      .post<CreateLocationDto, AxiosResponse<Record<string, unknown>>>(
        "/address/locations",
        data
      )
      .then((res) => normalizeLocation(res.data)),

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
          const normalized = data.map((item) =>
            normalizeLocation(item as Record<string, unknown>),
          );
          const page = params?.page || 1;
          const limit = params?.limit || normalized.length;
          const total = normalized.length;
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedData = normalized.slice(startIndex, endIndex);

          return {
            data: paginatedData,
            total,
            page,
            limit,
          } as PaginationResponse<LocationDto>;
        }
        const paginated = data as PaginationResponse<Record<string, unknown>>;
        return {
          ...paginated,
          data: (paginated.data ?? []).map((item) =>
            normalizeLocation(item as Record<string, unknown>),
          ),
        } as PaginationResponse<LocationDto>;
      }),

  remove: (id: string) =>
    axiosInstance.delete(`/address/locations/${id}`).then(() => undefined),
};
