import { axiosInstance } from "@/core/config/axios";
import { Admin, CreateAdminDto } from "../types/admin";
import { AxiosResponse } from "axios";

export const adminsApi = {
  findAll: () =>
    axiosInstance.get<Admin[]>("/user/admins").then((res) => res.data),

  create: (data: CreateAdminDto) =>
    axiosInstance.post<CreateAdminDto, AxiosResponse<Admin>>("/user/admin", data).then((res) => res.data),
};
