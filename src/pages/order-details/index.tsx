import { useOrderDetails } from "@/modules/orders/hooks/useOrders";
import { OrderDetails } from "./ui/OrderDetails";
import { OrderDetailsStats } from "./ui/OrderDetailsStats";
import { Package, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export const OrderDetailsPage = () => {
  const { t } = useTranslation();
  const { orderId } = useParams<{ orderId: string }>();
  
  const { data: order, isLoading, error } = useOrderDetails({
    orderId: orderId || "",
    enabled: !!orderId,
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

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t("orders.notFound")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-3 sm:p-6">
      <OrderDetailsStats order={order} />
      <OrderDetails order={order} />
    </div>
  );
};
