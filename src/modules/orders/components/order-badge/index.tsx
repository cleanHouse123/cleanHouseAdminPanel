import { Badge } from "@/core/components/ui/badge";
import { useTranslation } from "react-i18next";
import { cn } from "@/core/lib/utils";
import { OrderStatus } from "../../types/orders";
import { TFunction } from "i18next";
import { ORDER_STATUS_COLOR_CLASS } from "@/core/constants/orderStatusColors";

interface OrderBadgeProps {
  status: OrderStatus;
  className?: string;
}

const getStatusColor = (status: OrderStatus) => ORDER_STATUS_COLOR_CLASS[status] ?? "bg-gray-100 text-gray-800 border-gray-200";

const getStatusText = (status: OrderStatus, t: TFunction) => {
  switch (status) {
    case OrderStatus.NEW:
      return t("orders.status.new");
    case OrderStatus.PAID:
      return t("orders.status.paid");
    case OrderStatus.ASSIGNED:
      return t("orders.status.assigned");
    case OrderStatus.IN_PROGRESS:
      return t("orders.status.in_progress");
    case OrderStatus.DONE:
      return t("orders.status.done");
    case OrderStatus.CANCELED:
      return t("orders.status.canceled");
    default:
      return status;
  }
};

export const OrderBadge = ({ status, className }: OrderBadgeProps) => {
  const { t } = useTranslation();

  return (
    <Badge 
      variant="outline"
      className={cn("border", getStatusColor(status), className)}
    >
      {getStatusText(status, t)}
    </Badge>
  );
};
