import { axiosInstance } from "@/core/config/axios";
import { User, CreateUserDto, FindUsersQueryDto } from "../types/index";
import { AxiosResponse } from "axios";
import { PaginationResponse } from "@/core/types/api";

export const usersApi = {
  findAll: (params?: FindUsersQueryDto) =>
    axiosInstance.get<PaginationResponse<User>>("/user/all", { params }).then((res) => res.data),

  create: (data: CreateUserDto) =>
    axiosInstance.post<CreateUserDto, AxiosResponse<User>>("/user/currier", data).then((res) => res.data),
};
