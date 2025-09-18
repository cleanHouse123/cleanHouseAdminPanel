import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { locationsApi } from "../api";
import { CreateLocationDto, LocationDto } from "../types";

export const useLocations = () => {
  return useQuery<LocationDto[]>({
    queryKey: ["locations"],
    queryFn: () => locationsApi.findAll(),
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