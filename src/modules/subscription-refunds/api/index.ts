import { axiosInstance } from "@/core/config/axios";
import {
  CancelSubscriptionDto,
  SubscriptionAwaitingRefund,
  SubscriptionRefundBreakdown,
} from "../types";

export const subscriptionRefundsApi = {
  /** Отменённые оплаченные подписки без решения по возврату */
  findAwaiting: async (): Promise<SubscriptionAwaitingRefund[]> => {
    const response = await axiosInstance.get("/subscriptions/refunds/awaiting");
    return response.data;
  },

  preview: async (id: string): Promise<SubscriptionRefundBreakdown> => {
    const response = await axiosInstance.get(
      `/subscriptions/${id}/refund-preview`
    );
    return response.data;
  },

  cancelWithRefund: async (id: string, data: CancelSubscriptionDto) => {
    const response = await axiosInstance.post(
      `/subscriptions/${id}/cancel-with-refund`,
      data
    );
    return response.data;
  },
};
