import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminsApi } from "../api";
import { Admin, CreateAdminDto } from "../types/admin";
import { PaginationResponse } from "@/core/types/api";

export const useAdmins = (params?: { page?: number; limit?: number }) => {
  return useQuery<PaginationResponse<Admin>>({
    queryKey: ['admins', params],
    queryFn: () => adminsApi.findAll(params),
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation<Admin, Error, CreateAdminDto>({
    mutationFn: (data) => adminsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};