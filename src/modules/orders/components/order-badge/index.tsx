import { Badge } from "@/core/components/ui/badge";
import { useTranslation } from "react-i18next";
import { cn } from "@/core/lib/utils";
import { OrderStatus } from "../../types/orders";
import { TFunction } from "i18next";
import { ORDER_STATUS_COLOR_CLASS } from "@/core/constants/orderStatusColors";

interface OrderBadgeProps {
  status: OrderStatus;
  isOverdue?: boolean;
  className?: string;
}


const getStatusText = (status: OrderStatus, isOverdue: boolean | undefined, t: TFunction) => {
  if (isOverdue) {
    return "ПРОСРОЧЕН";
  }
  
  switch (status) {
    case OrderStatus.NEW:
      return "НОВЫЙ";
    case OrderStatus.PAID:
      return "ОПЛАЧЕН";
    case OrderStatus.ASSIGNED:
      return "В РАБОТЕ";
    case OrderStatus.IN_PROGRESS:
      return "В РАБОТЕ";
    case OrderStatus.DONE:
      return "ВЫПОЛНЕН";
    case OrderStatus.CANCELED:
      return "ОТМЕНЕН";
    default:
      return status;
  }
};

const getStatusColor = (status: OrderStatus, isOverdue: boolean | undefined) => {
  if (isOverdue) {
    return "bg-destructive text-destructive-foreground border-destructive";
  }
  return ORDER_STATUS_COLOR_CLASS[status] ?? "bg-gray-100 text-gray-800 border-gray-200";
};

export const OrderBadge = ({ status, isOverdue, className }: OrderBadgeProps) => {
  const { t } = useTranslation();

  return (
    <Badge 
      variant="outline"
      className={cn("border font-semibold", getStatusColor(status, isOverdue), className)}
    >
      {isOverdue ? "🔴" : ""} {getStatusText(status, isOverdue, t)}
    </Badge>
  );
};
