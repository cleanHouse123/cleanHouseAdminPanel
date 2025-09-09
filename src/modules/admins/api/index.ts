import { axiosInstance } from "@/core/config/axios";
import { Admin } from "../types/admin";

export const adminsApi = {
  findAll: () =>
    axiosInstance.get<Admin[]>("/user/admins").then((res) => res.data),
};
