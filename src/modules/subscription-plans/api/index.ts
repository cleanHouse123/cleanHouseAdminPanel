import { axiosInstance } from "@/core/config/axios";
import {
  SubscriptionPlan,
  CreateSubscriptionPlanDto,
  UpdateSubscriptionPlanDto,
} from "../types/subscription-plan";

export const subscriptionPlansApi = {
  // Получить все планы подписок
  getAll: async (): Promise<SubscriptionPlan[]> => {
    const response = await axiosInstance.get("/subscription-plans");
    return response.data;
  },

  // Получить план по ID
  getById: async (id: string): Promise<SubscriptionPlan> => {
    const response = await axiosInstance.get(`/subscription-plans/${id}`);
    return response.data;
  },

  // Создать новый план (только админы)
  create: async (
    data: CreateSubscriptionPlanDto
  ): Promise<SubscriptionPlan> => {
    const response = await axiosInstance.post("/subscription-plans", data);
    return response.data;
  },

  // Обновить план (только админы)
  update: async (
    id: string,
    data: UpdateSubscriptionPlanDto
  ): Promise<SubscriptionPlan> => {
    const response = await axiosInstance.patch(
      `/subscription-plans/${id}`,
      data
    );
    return response.data;
  },

  // Удалить план (только админы)
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/subscription-plans/${id}`);
  },
};
