import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { subscriptionRefundsApi } from "../api";
import { CancelSubscriptionDto } from "../types";

export const useSubscriptionsAwaitingRefund = () =>
  useQuery({
    queryKey: ["subscriptions-awaiting-refund"],
    queryFn: subscriptionRefundsApi.findAwaiting,
  });

export const useSubscriptionRefundPreview = (id?: string) =>
  useQuery({
    queryKey: ["subscription-refund-preview", id],
    queryFn: () => subscriptionRefundsApi.preview(id as string),
    enabled: Boolean(id),
  });

export const useCancelSubscriptionWithRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CancelSubscriptionDto }) =>
      subscriptionRefundsApi.cancelWithRefund(id, data),
    onSuccess: () => {
      toast.success("Решение сохранено", {
        description: "Подписка отменена, решение по возврату записано",
        duration: 4000,
      });
      queryClient.invalidateQueries({
        queryKey: ["subscriptions-awaiting-refund"],
      });
    },
    onError: (error: AxiosError) => {
      const message =
        (error?.response?.data as { message?: string })?.message ||
        "Не удалось сохранить решение";
      toast.error("Ошибка", { description: message, duration: 5000 });
    },
  });
};
