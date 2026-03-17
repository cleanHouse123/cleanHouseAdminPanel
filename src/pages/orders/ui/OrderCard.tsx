import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { MapPin, Phone, User, Clock, Package, Eye, AlertTriangle, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { OrderResponseDto, OrderStatus } from "@/modules/orders/types/orders";
import { Link } from "react-router-dom";
import { OrderBadge } from "@/modules/orders/components/order-badge";
import { formatDateTimeLocal } from "@/core/utils/dateUtils";
import { kopecksToRubles } from "@/core/utils/price";
import { formatOverdueTime } from "@/core/utils/overdueUtils";
import { cn } from "@/core/lib/utils";

interface OrderCardProps {
  order: OrderResponseDto;
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === "en" ? "en" : "ru") as "ru" | "en";

  const isOverdue = order.isOverdue;
  const isPaid = order.status === OrderStatus.PAID || order.payments?.some((payment) => payment.status === "paid");

  return (
    <Card className={cn(
      "bg-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]",
      isOverdue && "border-l-4 border-l-destructive bg-red-50/50 dark:bg-red-950/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {isOverdue ? (
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg flex-shrink-0">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
              </div>
            ) : (
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-semibold truncate flex items-center gap-2">
                {t("orders.order")} #{order.id.slice(-8)}
                {isOverdue && (
                  <span className="text-xs text-destructive font-bold">
                    ⚠️ ПРОСРОЧЕН
                  </span>
                )}
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {formatDateTimeLocal(order.createdAt, locale)}
              </p>
            </div>
          </div>
          <OrderBadge status={order.status} isOverdue={isOverdue} className="self-start sm:self-center" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Описание заказа */}
        <div>
          <h4 className="font-medium text-xs sm:text-sm text-muted-foreground mb-1">
            {t("orders.description")}
          </h4>
          <p className={`text-xs sm:text-sm break-words ${!order.description?.trim() ? "text-muted-foreground italic" : ""}`}>
            {order.description?.trim() || t("orders.noDescription")}
          </p>
        </div>

        {/* Адрес */}
        <div className="flex items-start gap-2">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium">{t("orders.address")}</p>
            <p className="text-xs sm:text-sm text-muted-foreground break-words">{order.address}</p>
          </div>
        </div>

        {/* Телефон */}
        <div className="flex items-center gap-2">
          <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          <a
            href={`tel:${order.customer.phone}`}
            className="text-xs sm:text-sm text-primary hover:underline"
          >
            {order.customer.phone}
          </a>
        </div>

        {/* Telegram */}
        {order.customer.telegramUsername && (
          <div className="flex items-center gap-2">
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <a
              href={`https://t.me/${order.customer.telegramUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-primary hover:underline"
            >
              @{order.customer.telegramUsername}
            </a>
          </div>
        )}

        {/* Информация о клиенте и курьере */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 border-t">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">
                {t("orders.customer")}
              </p>
              <p className="text-xs sm:text-sm truncate">
                {order.customer.name}
              </p>
            </div>
          </div>
          
          {order.currier && (
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">
                  {t("orders.courier")}
                </p>
                <p className="text-xs sm:text-sm truncate">{order.currier.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Количество пакетов */}
        {order.numberPackages !== undefined && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs sm:text-sm text-muted-foreground">
                {t("orders.numberPackages")}
              </span>
            </div>
            <span className="text-base sm:text-lg font-bold">
              {order.numberPackages}
            </span>
          </div>
        )}

        {/* Просроченность */}
        {isOverdue && order.overdueMinutes !== undefined && (
          <div className="flex items-center justify-between pt-2 border-t border-destructive/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm text-destructive font-semibold">
                  {isPaid
                    ? `Просрочено на ${formatOverdueTime(order.overdueMinutes)}`
                    : `Просрочено и не оплачено`}
                </span>
                {!isPaid && (
                  <span className="text-[10px] sm:text-xs text-destructive/80">
                    Просрочено на {formatOverdueTime(order.overdueMinutes)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Запланированное время */}
        {order.scheduledAt && !isOverdue && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">
                Запланировано
              </p>
              <p className="text-xs sm:text-sm">
                {formatDateTimeLocal(order.scheduledAt, locale)}
              </p>
            </div>
          </div>
        )}

        {/* Сумма заказа */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              {t("orders.amount")}
            </span>
          </div>
          <span className="text-base sm:text-lg font-bold text-primary">
            {kopecksToRubles(order.price)} ₽
          </span>
        </div>

        {/* Кнопка просмотра деталей */}
        <div className="pt-3 border-t">
          <Link to={`/admin/orders/${order.id}`}>
            <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t("orders.viewOrder")}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
