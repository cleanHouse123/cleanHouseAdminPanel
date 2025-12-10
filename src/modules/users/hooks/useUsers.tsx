import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api";
import { User, CreateUserDto, FindUsersQueryDto, UpdateUserDto } from "../types/index";
import { UserRole } from "@/core/types/user";

interface UseUsersProps {
  params?: FindUsersQueryDto;
  enabled?: boolean;
}

export const useUsers = ({ params, enabled = true }: UseUsersProps = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => usersApi.findAll(params),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 3,
  });
};

export const useUser = (id: string) => {
  return useQuery<User>({
    queryKey: ["user", id],
    queryFn: () => usersApi.findOne(id),
    enabled: !!id,
  });
};

export const useGetCurriers = () => {
  return useQuery({
    queryKey: ["curriers"],
    queryFn: () => usersApi.findAll({ role: UserRole.CURRIER }),
  });
};

export const useCreateCurrier = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, CreateUserDto>({
    mutationFn: (data) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["curriers"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, { id: string; data: UpdateUserDto }>({
    mutationFn: ({ id, data }) => usersApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["curriers"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => usersApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["curriers"] });
    },
  });
};
