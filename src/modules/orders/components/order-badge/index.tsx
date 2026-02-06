import { Badge } from "@/core/components/ui/badge";
import { useTranslation } from "react-i18next";
import { cn } from "@/core/lib/utils";
import { OrderStatus } from "../../types/orders";
import { TFunction } from "i18next";
import { ORDER_STATUS_COLOR_CLASS } from "@/core/constants/orderStatusColors";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/core/components/ui/tooltip";
import { AlertCircle } from "lucide-react";

interface OrderBadgeProps {
  status: OrderStatus;
  isOverdue?: boolean;
  className?: string;
}

const getStatusText = (status: OrderStatus, t: TFunction) => {
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
  const isUnpaidStatus =
    status === OrderStatus.NEW ||
    status === OrderStatus.ASSIGNED ||
    status === OrderStatus.IN_PROGRESS;

  // Если заказ просрочен и ещё не оплачен — подчёркиваем это красным бейджем
  if (isOverdue && isUnpaidStatus) {
    return "bg-destructive text-destructive-foreground border-destructive";
  }

  return ORDER_STATUS_COLOR_CLASS[status] ?? "bg-gray-100 text-gray-800 border-gray-200";
};

export const OrderBadge = ({ status, isOverdue, className }: OrderBadgeProps) => {
  const { t } = useTranslation();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge
        variant="outline"
        className={cn("border font-semibold", getStatusColor(status, isOverdue))}
      >
        {getStatusText(status, t)}
      </Badge>
      {isOverdue && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span aria-label="Заказ просрочен">
              <AlertCircle className="h-3 w-3 text-destructive" />
            </span>
          </TooltipTrigger>
          <TooltipContent variant="danger" size="sm" sideOffset={4}>
            Заказ просрочен
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
