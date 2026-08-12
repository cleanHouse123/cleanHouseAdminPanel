export type CouponScope = "subscription" | "order" | "both";
export type CouponDiscountType = "percent" | "fixed_amount" | "final_price";

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  scope: CouponScope;
  discountType: CouponDiscountType;
  value: number; // percent (1..100) or kopecks
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  maxRedemptions: number | null;
  redeemedCount: number;
  minAmount: number | null; // kopecks
  subscriptionPlanId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponDto {
  code: string;
  description?: string;
  scope: CouponScope;
  discountType: CouponDiscountType;
  value: number; // percent or kopecks
  isActive?: boolean;
  startsAt?: string;
  endsAt?: string;
  maxRedemptions?: number;
  minAmount?: number; // kopecks
  subscriptionPlanId?: string;
}

export type UpdateCouponDto = Partial<CreateCouponDto>;

/** Form model: money fields are edited in rubles and converted to kopecks on submit. */
export interface CouponFormData {
  code: string;
  description?: string;
  scope: CouponScope;
  discountType: CouponDiscountType;
  value: number; // percent as-is; for money types this is RUBLES
  isActive: boolean;
  startsAt?: string;
  endsAt?: string;
  maxRedemptions?: number;
  minAmountRubles?: number;
  subscriptionPlanId?: string;
}

export const SCOPE_LABELS: Record<CouponScope, string> = {
  subscription: "Подписка",
  order: "Заказ",
  both: "Заказ и подписка",
};

export const DISCOUNT_TYPE_LABELS: Record<CouponDiscountType, string> = {
  percent: "Процент",
  fixed_amount: "Фикс. скидка",
  final_price: "Финальная цена",
};
