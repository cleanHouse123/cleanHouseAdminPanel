import { Badge } from "@/core/components/ui/badge";
import { useTranslation } from "react-i18next";
import { cn } from "@/core/lib/utils";
import { OrderStatus } from "../../types/orders";
import { TFunction } from "i18next";

interface OrderBadgeProps {
  status: OrderStatus;
  className?: string;
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.NEW:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case OrderStatus.PAID:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case OrderStatus.ASSIGNED:
      return "bg-purple-100 text-purple-800 border-purple-200";
    case OrderStatus.IN_PROGRESS:
      return "bg-orange-100 text-orange-800 border-orange-200";
    case OrderStatus.DONE:
      return "bg-green-100 text-green-800 border-green-200";
    case OrderStatus.CANCELED:
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

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
      className={cn("border", getStatusColor(status), className)}
    >
      {getStatusText(status, t)}
    </Badge>
  );
};
