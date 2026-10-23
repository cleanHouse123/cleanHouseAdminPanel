import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/inputs/select";
import { OrderStatus } from "../../types/orders";
import { useTranslation } from "react-i18next";
import { useUpdateOrderStatus } from "../../hooks/useOrders";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { CancelWithRefundDialog } from "../cancel-with-refund";

interface ChangeOrderStatusProps {
  orderId: string;
  onStatusChange: (status: OrderStatus) => void;
  currentStatus: OrderStatus;
  /** Оплаченная сумма в рублях: если больше нуля, отмена идёт через диалог возврата */
  paidAmount?: number;
}

export const ChangeOrderStatus = ({
  orderId,
  onStatusChange,
  currentStatus,
  paidAmount = 0,
}: ChangeOrderStatusProps) => {
  const { t } = useTranslation();
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);

  const { mutateAsync: updateOrderStatus, isPending } = useUpdateOrderStatus();

  const handleStatusChange = async (status: OrderStatus) => {
    // По оплаченному заказу нельзя просто сменить статус: сначала решаем,
    // возвращать ли деньги
    if (status === OrderStatus.CANCELED && paidAmount > 0) {
      setIsRefundDialogOpen(true);
      return;
    }

    try {
      await updateOrderStatus({ id: orderId, data: { status } });
      onStatusChange(status);
    } catch (error) {
      console.error("Ошибка при изменении статуса:", error);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        {t("orders.changeStatus")}
      </label>
      <Select 
        value={currentStatus} 
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("orders.status.selectStatus")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={OrderStatus.NEW}>
            {t("orders.status.new")}
          </SelectItem>
          <SelectItem value={OrderStatus.PAID}>
            {t("orders.status.paid")}
          </SelectItem>
          <SelectItem value={OrderStatus.ASSIGNED}>
            {t("orders.status.assigned")}
          </SelectItem>
          <SelectItem value={OrderStatus.IN_PROGRESS}>
            {t("orders.status.in_progress")}
          </SelectItem>
          <SelectItem value={OrderStatus.DONE}>
            {t("orders.status.done")}
          </SelectItem>
          <SelectItem value={OrderStatus.CANCELED}>
            {t("orders.status.canceled")}
          </SelectItem>
        </SelectContent>
      </Select>
      <CancelWithRefundDialog
        open={isRefundDialogOpen}
        onOpenChange={setIsRefundDialogOpen}
        orderId={orderId}
        paidAmount={paidAmount}
        onCanceled={() => onStatusChange(OrderStatus.CANCELED)}
      />

      {isPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          {t("orders.updatingStatus")}
        </div>
      )}
    </div>
  );
};
