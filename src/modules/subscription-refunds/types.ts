import { RefundDecision } from "../orders/types/orders";

/** Расчёт возврата по пункту 6.7 Оферты. Суммы в копейках */
export interface SubscriptionRefundBreakdown {
  /** per_pickup — формула 6.7, pro_rata — безлимитный тариф по дням */
  method: "per_pickup" | "pro_rata";
  price: number;
  usedOrders: number;
  ordersLimit: number;
  pricePerPickup?: number;
  usedAmount?: number;
  totalDays?: number;
  remainingDays?: number;
  /** Удержано за использованные пакеты, пункт 6.2 Оферты */
  bagsDeduction: number;
  refundAmount: number;
}

export interface SubscriptionAwaitingRefund {
  subscriptionId: string;
  paymentId: string;
  amount: number;
  customerName?: string;
  canceledAt: string;
  suggested: SubscriptionRefundBreakdown;
}

export interface CancelSubscriptionDto {
  refund: RefundDecision;
  /** Сумма в рублях для частичного возврата */
  amount?: number;
  reason?: string;
}
