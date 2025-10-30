import { OrderStatus } from "@/modules/orders/types/orders";

// Цвета статусов синхронизированы с мобильным приложением
export const ORDER_STATUS_COLOR_CLASS: Record<OrderStatus, string> = {
  [OrderStatus.NEW]: "bg-[#4CAF50] text-white border-[#4CAF50]",
  [OrderStatus.PAID]: "bg-[#2196F3] text-white border-[#2196F3]",
  [OrderStatus.ASSIGNED]: "bg-[#FF9800] text-white border-[#FF9800]",
  [OrderStatus.IN_PROGRESS]: "bg-[#FFC107] text-black border-[#FFC107]",
  [OrderStatus.DONE]: "bg-[#9E9E9E] text-white border-[#9E9E9E]",
  [OrderStatus.CANCELED]: "bg-[#F44336] text-white border-[#F44336]",
};


