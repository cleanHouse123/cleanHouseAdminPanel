import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { ROUTES } from "@/core/constants/routes";
import { useOrdersAwaitingRefund } from "../../hooks/useOrders";

/**
 * Оплаченные отменённые заказы, по которым не решили, что с деньгами.
 * Страховка на случай, когда возврат упал с ошибкой или заказ отменили
 * в обход диалога: оферта даёт на возврат 10 календарных дней.
 */
export const OrdersAwaitingRefund = () => {
  const { data: orders } = useOrdersAwaitingRefund();

  if (!orders || orders.length === 0) {
    return null;
  }

  const daysSince = (date: string) =>
    Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000);

  return (
    <Card className="border-orange-500/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          Ожидают возврата: {orders.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {orders.map((order) => {
          const days = daysSince(order.canceledAt);

          return (
            <div
              key={order.orderId}
              className="flex items-center justify-between gap-4 rounded-lg border border-border px-3 py-2 text-sm"
            >
              <div>
                <Link
                  to={ROUTES.ADMIN.ORDERS.DETAILS(order.orderId)}
                  className="font-mono text-primary hover:underline"
                >
                  #{order.orderId.slice(-8)}
                </Link>
                {order.customerName && (
                  <span className="ml-2 text-muted-foreground">
                    {order.customerName}
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="font-medium">{order.amount} ₽</div>
                <div
                  className={
                    days >= 10
                      ? "text-xs text-destructive"
                      : "text-xs text-muted-foreground"
                  }
                >
                  отменён {days} дн. назад
                  {days >= 10 ? " — срок возврата вышел" : ""}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
