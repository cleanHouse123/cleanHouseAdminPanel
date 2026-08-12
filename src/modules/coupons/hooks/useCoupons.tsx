import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { couponsApi } from "../api";
import { CreateCouponDto, UpdateCouponDto } from "../types/coupon";
import { toast } from "sonner";

export const useCoupons = () => {
  const queryClient = useQueryClient();

  const {
    data: coupons,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["coupons"],
    queryFn: couponsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: couponsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Промокод создан");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Ошибка создания промокода");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCouponDto }) =>
      couponsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Промокод обновлён");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Ошибка обновления промокода");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: couponsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Промокод удалён");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Ошибка удаления промокода");
    },
  });

  const createCoupon = (data: CreateCouponDto) => createMutation.mutate(data);
  const updateCoupon = (id: string, data: UpdateCouponDto) =>
    updateMutation.mutate({ id, data });
  const deleteCoupon = (id: string) => deleteMutation.mutate(id);

  return {
    coupons: coupons || [],
    isLoading,
    error,
    refetch,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
