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
  usedOrders?: number; // количество использованных заказов
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
}
