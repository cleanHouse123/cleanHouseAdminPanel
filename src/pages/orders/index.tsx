
import { useOrders } from "@/modules/orders/hooks/useOrders";
import { Package, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { OrderStatus } from "@/modules/orders/types/orders";
import { OrderCard } from "./ui/OrderCard";
import { OrderStats } from "./ui/OrderStats";

export const OrdersPage = () => {
  const { t } = useTranslation();
  
  const { data: ordersData, isLoading, error } = useOrders({
    page: 1,
    limit: 20,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">{t("common.error")}</p>
        </div>
      </div>
    );
  }

  const orders = ordersData?.orders || [];
  const total = ordersData?.total || 0;

  const stats = {
    total,
    new: orders.filter(o => o.status === OrderStatus.NEW).length,
    paid: orders.filter(o => o.status === OrderStatus.PAID).length,
    canceled: orders.filter(o => o.status === OrderStatus.CANCELED).length,
    inProgress: orders.filter(o => o.status === OrderStatus.IN_PROGRESS).length,
    completed: orders.filter(o => o.status === OrderStatus.DONE).length,
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Заголовок */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
          <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold truncate">{t("orders.title")}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("orders.subtitle", { count: total })}
          </p>
        </div>
      </div>

      <OrderStats stats={stats} />
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t("orders.list")}</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("orders.empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
