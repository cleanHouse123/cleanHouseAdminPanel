import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/inputs/select";
import { OrderStatus } from "../../types/orders";
import { useTranslation } from "react-i18next";
import { useUpdateOrderStatus, useReassignOrder } from "../../hooks/useOrders";
import { useGetCurriers } from "@/modules/users/hooks/useUsers";
import { User } from "@/modules/users/types";
import { Loader2 } from "lucide-react";

interface AssignCurrierProps {
  orderId: string;
  onStatusChange: (status: OrderStatus) => void;
  currentStatus: OrderStatus;
  currentCurrierId?: string;
}

export const AssignCurrier = ({
  orderId,
  onStatusChange,
  currentCurrierId,
  currentStatus,
}: AssignCurrierProps) => {
  const { t } = useTranslation();

  const { mutateAsync: updateOrderStatus, isPending: isPendingUpdate } = useUpdateOrderStatus();
  const { mutateAsync: reassignOrder, isPending: isPendingReassign } = useReassignOrder();
  const { data: curriersData, isLoading: isLoadingCurriers } = useGetCurriers();

  const curriers = curriersData?.data || [];
  const isPending = isPendingUpdate || isPendingReassign;

  const handleCurrierChange = async (currierId: string) => {
    try {
      // Если заказ уже назначен курьеру и мы меняем курьера - используем reassignOrder
      if (currentCurrierId && currentCurrierId !== currierId) {
        await reassignOrder({
          id: orderId,
          reassignOrderDto: {
            newCourierId: currierId,
          },
        });
      } else {
        // Если заказ еще не назначен - используем updateOrderStatus
        await updateOrderStatus({
          id: orderId,
          data: {
            status: OrderStatus.ASSIGNED,
            currierId: currierId,
          },
        });
      }
      onStatusChange(OrderStatus.ASSIGNED);
    } catch (error) {
      console.error("Ошибка при назначении курьера:", error);
    }
  };

  if (isLoadingCurriers) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">
          {t("common.loading")}
        </span>
      </div>
    );
  }

  if (curriers.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {t("orders.noCurriersAvailable")}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {t("orders.assignCurrier")}
      </label>
      <Select
        value={currentCurrierId || ""}
        onValueChange={handleCurrierChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("orders.selectCurrier")} />
        </SelectTrigger>
        <SelectContent>
          {curriers.map((currier: User) => (
            <SelectItem key={currier.id} value={currier.id}>
              <div className="flex flex-col">
                <span className="font-medium">{currier.name}</span>
                <span className="text-xs text-muted-foreground">
                  {currier.phone}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          {t("orders.assigningCurrier")}
        </div>
      )}
    </div>
  );
};
