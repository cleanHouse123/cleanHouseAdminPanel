import { axiosInstance } from "@/core/config/axios";

import { AxiosResponse } from "axios";
import { CreateLocationDto, LocationDto } from "../types";

export const locationsApi = {
  create: (data: CreateLocationDto) =>
    axiosInstance
      .post<CreateLocationDto, AxiosResponse<LocationDto>>("/address/locations", data)
      .then((res) => res.data),

  findAll: () =>
    axiosInstance
      .get<LocationDto[]>("address/locations")
      .then((res) => res.data),

 
  remove: (id: string) =>
    axiosInstance.delete(`/address/locations/${id}`).then(() => undefined),
};
