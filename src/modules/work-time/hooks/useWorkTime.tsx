import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workTimeApi } from "../api";
import { CreateWorkTimePayload } from "../types";

export const useWorkTime = (id: number = 1) => {
  return useQuery({
    queryKey: ["work-time", id],
    queryFn: () => workTimeApi.getOne(id),
  });
};

export const useWorkTimeAll = () => {
  return useQuery({
    queryKey: ["work-time"],
    queryFn: () => workTimeApi.getAll(),
  });
};

export const useCreateWorkTime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWorkTimePayload) => workTimeApi.create(payload),
    onSuccess: (_,) => {
      queryClient.invalidateQueries({ queryKey: ["work-time"] });
    },
  });
};

export const useDeleteWorkTime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => workTimeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-time"] });
    },
  });
};

