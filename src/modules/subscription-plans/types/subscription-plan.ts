export interface SubscriptionPlan {
  id: string;
  type: "monthly" | "yearly";
  name: string;
  description: string;
  priceInKopecks: number;
  duration: string;
  features: string[];
  icon: string;
  badgeColor: "blue" | "green";
  popular: boolean;
  ordersLimit?: number; // -1 = безлимит, null/undefined = не установлен
  /** Цена пакета в копейках: удерживается из возврата, пункт 6.2 Оферты */
  bagPriceInKopecks?: number;
  usedOrders?: number; // количество использованных заказов
  isReferralFreeEnabled?: boolean;
  minReferralsForFree?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPlanDto {
  type: "monthly" | "yearly";
  name: string;
  description: string;
  priceInKopecks: number;
  duration: string;
  features: string[];
  icon: string;
  badgeColor: "blue" | "green";
  popular: boolean;
  ordersLimit?: number; // -1 = безлимит, null/undefined = не установлен
  /** Цена пакета в копейках: удерживается из возврата, пункт 6.2 Оферты */
  bagPriceInKopecks?: number;
  isReferralFreeEnabled?: boolean;
  minReferralsForFree?: number;
}

export interface UpdateSubscriptionPlanDto
  extends Partial<CreateSubscriptionPlanDto> {}

export interface SubscriptionPlanFormData {
  type: "monthly" | "yearly";
  name: string;
  description: string;
  priceInRubles: number;
  duration: string;
  features: string[];
  icon: string;
  badgeColor: "blue" | "green";
  popular: boolean;
  ordersLimit?: number; // -1 = безлимит, null/undefined = не установлен
  /** Цена пакета в копейках: удерживается из возврата, пункт 6.2 Оферты */
  bagPriceInKopecks?: number;
  isReferralFreeEnabled?: boolean;
  minReferralsForFree?: number;
}
