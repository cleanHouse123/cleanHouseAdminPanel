import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminsApi } from "../api";
import { Admin, CreateAdminDto, UpdateAdminDto } from "../types/admin";
import { PaginationResponse } from "@/core/types/api";

export const useAdmins = (params?: { page?: number; limit?: number }) => {
  return useQuery<PaginationResponse<Admin>>({
    queryKey: ['admins', params],
    queryFn: () => adminsApi.findAll(params),
  });
};

export const useAdmin = (id: string) => {
  return useQuery<Admin>({
    queryKey: ['admin', id],
    queryFn: () => adminsApi.findOne(id),
    enabled: !!id,
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

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation<Admin, Error, { id: string; data: UpdateAdminDto }>({
    mutationFn: ({ id, data }) => adminsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      queryClient.invalidateQueries({ queryKey: ['admin', variables.id] });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => adminsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
  });
};