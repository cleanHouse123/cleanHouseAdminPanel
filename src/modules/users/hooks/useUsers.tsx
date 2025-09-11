import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api";
import { User, CreateUserDto } from "../types/index";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.findAll(),
  });
};

export const useCreateCurrier = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, CreateUserDto>({
    mutationFn: (data) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
