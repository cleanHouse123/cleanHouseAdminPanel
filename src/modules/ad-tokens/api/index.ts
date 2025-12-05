import { axiosInstance } from "@/core/config/axios";
import { AdToken, CreateAdTokenRequest } from "../types";

export const adTokensApi = {
  getAdTokens: async (): Promise<AdToken[]> => {
    const response = await axiosInstance.get("/admin/tokens");
    return response.data;
  },

  createAdToken: async (data: CreateAdTokenRequest): Promise<AdToken> => {
    const response = await axiosInstance.post("/admin/tokens", data);
    return response.data;
  },
};
