import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { useTranslation } from "react-i18next";
import { OrderResponseDto, OrderStatus } from "@/modules/orders/types/orders";
import { cn } from "@/core/lib/utils";
import { TFunction } from "i18next";
import { 
  Package, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  Calendar,
  DollarSign,
  Navigation
} from "lucide-react";

interface OrderDetailsStatsProps {
  order: OrderResponseDto;
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case OrderStatus.CONFIRMED:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case OrderStatus.IN_PROGRESS:
      return "bg-orange-100 text-orange-800 border-orange-200";
    case OrderStatus.COMPLETED:
      return "bg-green-100 text-green-800 border-green-200";
    case OrderStatus.CANCELLED:
      return "bg-red-100 text-red-800 border-red-200";
    case OrderStatus.PAID:
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status: OrderStatus, t: TFunction) => {
  switch (status) {
    case OrderStatus.PENDING:
      return t("orders.status.pending");
    case OrderStatus.CONFIRMED:
      return t("orders.status.confirmed");
    case OrderStatus.IN_PROGRESS:
      return t("orders.status.in_progress");
    case OrderStatus.COMPLETED:
      return t("orders.status.completed");
    case OrderStatus.CANCELLED:
      return t("orders.status.cancelled");
    case OrderStatus.PAID:
      return t("orders.status.paid");
    default:
      return status;
  }
};

export const OrderDetailsStats = ({ order }: OrderDetailsStatsProps) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Статус заказа */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Package className="h-4 w-4" />
            {t("orders.orderStatus")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className={cn("border", getStatusColor(order.status))}>
            {getStatusText(order.status, t)}
          </Badge>
        </CardContent>
      </Card>

      {/* Сумма заказа */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            {t("orders.orderAmount")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {order.amount} ₽
          </div>
        </CardContent>
      </Card>

      {/* Дата создания */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t("orders.orderDate")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {formatDateShort(order.createdAt)}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDate(order.createdAt)}
          </div>
        </CardContent>
      </Card>

      {/* ID заказа */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t("orders.orderId")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-mono">
            #{order.id.slice(-8)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
