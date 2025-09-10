import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminsApi } from "../api";
import { Admin, CreateAdminDto } from "../types/admin";


export const useAdmins = () => {
  return useQuery<Admin[]>({
    queryKey: ['admins'],
    queryFn: () => adminsApi.findAll(),
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