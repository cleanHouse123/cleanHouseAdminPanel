import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { useTranslation } from "react-i18next";
import { OrderResponseDto } from "@/modules/orders/types/orders";
import {
  MapPin,
  User,
  Mail,
  Package,
  Navigation,
  Calendar,
  Clock,
  CreditCard,
} from "lucide-react";
import { ChangeOrderStatus } from "@/modules/orders/components/change-order-status";
import { AssignCurrier } from "@/modules/orders/components/assign-currier";
import { DeleteOrder } from "@/modules/orders/components/delete-order";
import { OrderBadge } from "@/modules/orders/components/order-badge";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/core/constants/routes";
import { formatDate } from "@/core/utils/date";

interface OrderDetailsProps {
  order: OrderResponseDto;
}

export const OrderDetails = ({ order }: OrderDetailsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
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
              <OrderBadge status={order.status} />
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
              currentCurrierId={order.currier?.id}
            />
          </div>

          {/* Кнопки действий */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            {/* <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                {t("orders.editOrder")}
              </Button> */}
            <DeleteOrder orderId={order.id} onDelete={() => {
              navigate(ROUTES.ADMIN.ORDERS.LIST, { replace: true });
            }} />
          </div>
        </CardContent>
      </Card>

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

          {order.payments.length > 0 && order.payments.some(payment => payment.status === 'paid') && (
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {t("orders.paidAt")}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDate(order.payments.find(payment => payment.status === 'paid')?.createdAt || '')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t("orders.orderDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">
              {t("orders.orderDescription")}
            </h4>
            <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-lg">
              {order.description}
            </p>
          </div>

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

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                {t("orders.deliveryTime")}
              </h4>
              <p className="text-sm break-words">{formatDate(order.scheduledAt || "")}</p>
            </div>
          </div>

        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("orders.orderCustomer")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                {t("common.name")}
              </h4>
              <p className="text-sm">{order.customer.name}</p>
            </div>
            {order.customer.email && (
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
            )}
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
          </CardContent>
        </Card>

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
                {order.currier.email && (
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
                )}
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
    </div>
  );
};
