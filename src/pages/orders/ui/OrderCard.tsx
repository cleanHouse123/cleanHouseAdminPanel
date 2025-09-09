import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { MapPin, Phone, User, Clock, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/core/lib/utils";
import { OrderResponseDto, OrderStatus } from "@/modules/orders/types/orders";
import { TFunction } from "i18next";

interface OrderCardProps {
  order: OrderResponseDto;
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
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

export const OrderCard = ({ order }: OrderCardProps) => {
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

  return (
    <Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {t("orders.order")} #{order.id.slice(-8)}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <Badge className={cn("border", getStatusColor(order.status))}>
            {getStatusText(order.status, t)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Описание заказа */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-1">
            {t("orders.description")}
          </h4>
          <p className="text-sm">{order.description}</p>
        </div>

        {/* Адрес */}
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">{t("orders.address")}</p>
            <p className="text-sm text-muted-foreground">{order.address}</p>
          </div>
        </div>

        {/* Телефон */}
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{order.phone}</span>
        </div>

        {/* Информация о клиенте и курьере */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {t("orders.customer")}
              </p>
              <p className="text-sm">
                {order.customer?.name || t("orders.unknown")}
              </p>
            </div>
          </div>
          
          {order.currier && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {t("orders.courier")}
                </p>
                <p className="text-sm">{order.currier.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Сумма заказа */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {t("orders.amount")}
            </span>
          </div>
          <span className="text-lg font-bold text-primary">
            {order.amount} ₽
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
