import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api";
import { User, CreateUserDto, FindUsersQueryDto } from "../types/index";
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
      queryClient.invalidateQueries({ queryKey: ["users", "curriers"] });
    },
  });
};
