import { axiosInstance } from "@/core/config/axios";
import { User, CreateUserDto, FindUsersQueryDto, UpdateUserDto } from "../types/index";
import { AxiosResponse } from "axios";
import { PaginationResponse } from "@/core/types/api";

export const usersApi = {
  findAll: (params?: FindUsersQueryDto) =>
    axiosInstance.get<PaginationResponse<User>>("/user/all", { params }).then((res) => res.data),

  create: (data: CreateUserDto) =>
    axiosInstance.post<CreateUserDto, AxiosResponse<User>>("/user/currier", data).then((res) => res.data),

  update: (id: string, data: UpdateUserDto) =>
    axiosInstance
      .patch<UpdateUserDto, AxiosResponse<User>>(`/user/${id}`, data)
      .then((res) => res.data),

  findOne: async (id: string) => {
    // Получаем пользователя из списка, так как эндпоинт /user/:id не существует
    const response = await axiosInstance.get<PaginationResponse<User>>("/user/all", {
      params: { limit: 1000 } // Получаем большой список для поиска
    });
    const user = response.data.data.find((u) => u.id === id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },

  remove: (id: string) =>
    axiosInstance.delete(`/user/${id}`).then(() => undefined),
};
