import { axiosInstance } from "@/core/config/axios";
import { CreateWorkTimePayload, WorkTime } from "../types";

export const workTimeApi = {
  create: async (payload: CreateWorkTimePayload): Promise<WorkTime> => {
    const response = await axiosInstance.post("/work-time", payload);
    return response.data;
  },
  getAll: async (): Promise<WorkTime[]> => {
    const response = await axiosInstance.get<WorkTime[]>("/work-time");
    return response.data;
  },
  getOne: async (id: number): Promise<WorkTime> => {
    const response = await axiosInstance.get(`/work-time/${id}`);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/work-time/${id}`);
  },
};

