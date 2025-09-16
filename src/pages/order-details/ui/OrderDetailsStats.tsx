import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { useTranslation } from "react-i18next";
import { OrderResponseDto } from "@/modules/orders/types/orders";
import { 
  Package, 
  Clock, 
  Calendar,
  DollarSign
} from "lucide-react";
import { OrderBadge } from "@/modules/orders/components/order-badge";

interface OrderDetailsStatsProps {
  order: OrderResponseDto;
}


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
          <OrderBadge status={order.status} />
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
            {order.price} ₽
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
