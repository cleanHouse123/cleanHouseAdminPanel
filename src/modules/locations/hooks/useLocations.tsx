import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { locationsApi } from "../api";
import { CreateLocationDto, LocationDto } from "../types";
import { PaginationResponse } from "@/core/types/api";

export const useLocations = (params?: { page?: number; limit?: number }) => {
  return useQuery<PaginationResponse<LocationDto>>({
    queryKey: ["locations", params],
    queryFn: () => locationsApi.findAll(params),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
};


export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation<LocationDto, Error, CreateLocationDto>({
    mutationFn: (data) => locationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  return useMutation<undefined, Error, string>({
    mutationFn: (id) => locationsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
  });
};