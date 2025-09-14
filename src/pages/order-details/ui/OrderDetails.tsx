import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { useTranslation } from "react-i18next";
import { OrderResponseDto, OrderStatus } from "@/modules/orders/types/orders";
import { cn } from "@/core/lib/utils";
import { TFunction } from "i18next";
import {
  MapPin,
  Phone,
  User,
  Mail,
  Package,
  Navigation,
  Calendar,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ChangeOrderStatus } from "@/modules/orders/components/change-order-status";
import { AssignCurrier } from "@/modules/orders/components/assign-currier";
import { DeleteOrder } from "@/modules/orders/components/delete-order";

interface OrderDetailsProps {
  order: OrderResponseDto;
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
      return t("orders.status.pending");
    case OrderStatus.PAID:
      return t("orders.status.confirmed");
    case OrderStatus.ASSIGNED:
      return t("orders.status.assigned");
    case OrderStatus.IN_PROGRESS:
      return t("orders.status.in_progress");
    case OrderStatus.DONE:
      return t("orders.status.completed");
    case OrderStatus.CANCELED:
      return t("orders.status.cancelled");
    default:
      return status;
  }
};

export const OrderDetails = ({ order }: OrderDetailsProps) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Заголовок с кнопками */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/orders">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("common.back")}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {t("orders.order")} #{order.id.slice(-8)}
            </h1>
            <p className="text-muted-foreground">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Панель управления заказом */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t("orders.orderManagement")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Статус заказа */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {t("orders.currentStatus")}:
                </span>
                <Badge className={cn("border", getStatusColor(order.status))}>
                  {getStatusText(order.status, t)}
                </Badge>
              </div>
            </div>

            {/* Панель управления */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChangeOrderStatus
                orderId={order.id}
                onStatusChange={() => {}}
                currentStatus={order.status}
              />
              <AssignCurrier
                orderId={order.id}
                onStatusChange={() => {}}
                currentStatus={order.status}
                currentCurrierId={order.currierId}
              />
            </div>

            {/* Кнопки действий */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t">
              {/* <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                {t("orders.editOrder")}
              </Button> */}
              <DeleteOrder orderId={order.id} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Основная информация о заказе */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t("orders.orderDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Описание заказа */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">
              {t("orders.orderDescription")}
            </h4>
            <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-lg">
              {order.description}
            </p>
          </div>

          {/* Адрес */}
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                {t("orders.orderAddress")}
              </h4>
              <p className="text-sm break-words">{order.address}</p>
              {order.coordinates && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Navigation className="h-4 w-4" />
                    {t("orders.viewOnMap")}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Телефон */}
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                {t("common.phone")}
              </h4>
              <a
                href={`tel:${order.phone}`}
                className="text-sm text-primary hover:underline"
              >
                {order.phone}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Информация о клиенте и курьере */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Клиент */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("orders.orderCustomer")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.customer ? (
              <>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {t("common.name")}
                  </h4>
                  <p className="text-sm">{order.customer.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {t("common.email")}
                  </h4>
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <Mail className="h-3 w-3" />
                    {order.customer.email}
                  </a>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {t("common.phone")}
                  </h4>
                  <a
                    href={`tel:${order.customer.phone}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {order.customer.phone}
                  </a>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("orders.unknown")}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Курьер */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("orders.orderCourier")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.currier ? (
              <>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {t("common.name")}
                  </h4>
                  <p className="text-sm">{order.currier.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {t("common.email")}
                  </h4>
                  <a
                    href={`mailto:${order.currier.email}`}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <Mail className="h-3 w-3" />
                    {order.currier.email}
                  </a>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {t("common.phone")}
                  </h4>
                  <a
                    href={`tel:${order.currier.phone}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {order.currier.phone}
                  </a>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("orders.noCourierAssigned")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Временные метки */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t("orders.timeline")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {t("orders.createdAt")}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatDate(order.createdAt)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {t("orders.updatedAt")}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatDate(order.updatedAt)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
