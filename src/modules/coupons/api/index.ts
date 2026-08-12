import { axiosInstance } from "@/core/config/axios";
import { Coupon, CreateCouponDto, UpdateCouponDto } from "../types/coupon";

export const couponsApi = {
  getAll: async (): Promise<Coupon[]> => {
    const response = await axiosInstance.get("/coupons");
    return response.data;
  },

  getById: async (id: string): Promise<Coupon> => {
    const response = await axiosInstance.get(`/coupons/${id}`);
    return response.data;
  },

  create: async (data: CreateCouponDto): Promise<Coupon> => {
    const response = await axiosInstance.post("/coupons", data);
    return response.data;
  },

  update: async (id: string, data: UpdateCouponDto): Promise<Coupon> => {
    const response = await axiosInstance.patch(`/coupons/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/coupons/${id}`);
  },
};
