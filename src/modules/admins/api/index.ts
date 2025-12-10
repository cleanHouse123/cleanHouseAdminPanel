import { axiosInstance } from "@/core/config/axios";
import { Admin, CreateAdminDto, UpdateAdminDto } from "../types/admin";
import { AxiosResponse } from "axios";
import { PaginationResponse } from "@/core/types/api";

export const adminsApi = {
  findAll: (params?: { page?: number; limit?: number }) =>
    axiosInstance
      .get<Admin[] | PaginationResponse<Admin>>("/user/admins", { params })
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
          } as PaginationResponse<Admin>;
        }
        return data as PaginationResponse<Admin>;
      }),

  create: (data: CreateAdminDto) =>
    axiosInstance
      .post<CreateAdminDto, AxiosResponse<Admin>>("/user/admin", data)
      .then((res) => res.data),

  update: (id: string, data: UpdateAdminDto) =>
    axiosInstance
      .patch<UpdateAdminDto, AxiosResponse<Admin>>(`/user/admin/${id}`, data)
      .then((res) => res.data),

  findOne: async (id: string) => {
    // Получаем администратора из списка, так как эндпоинт /user/admin/:id не существует
    const response = await axiosInstance.get<Admin[] | PaginationResponse<Admin>>("/user/admins", {
      params: { limit: 1000 } // Получаем большой список для поиска
    });
    const admins = Array.isArray(response.data) 
      ? response.data 
      : response.data.data;
    const admin = admins.find((a) => a.id === id);
    if (!admin) {
      throw new Error("Admin not found");
    }
    return admin;
  },

  remove: (id: string) =>
    axiosInstance.delete(`/user/admin/${id}`).then(() => undefined),
};
