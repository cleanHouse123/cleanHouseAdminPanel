import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { CancelWithRefundDialog } from "../cancel-with-refund";
import { formatKopecks } from "@/core/utils/price";

interface ResolveRefundProps {
  orderId: string;
  /** Оплаченная сумма в копейках, как она хранится у платежа */
  paidAmountInKopecks: number;
}

/**
 * Заказ отменили, а решение по деньгам не приняли — он висит в очереди
 * «ожидают возврата». Сменить статус ещё раз нельзя, поэтому решение
 * принимается отсюда: без этой кнопки очередь вела бы в тупик.
 */
export const ResolveRefund = ({
  orderId,
  paidAmountInKopecks,
}: ResolveRefundProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="rounded-lg border border-orange-500/40 bg-orange-500/5 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-orange-500" />
          <div>
            <p className="text-sm font-medium">
              Деньги по заказу не возвращены
            </p>
            <p className="text-xs text-muted-foreground">
              Оплата на {formatKopecks(paidAmountInKopecks)} осталась у нас.
              Оферта даёт на возврат 10 календарных дней.
            </p>
          </div>
        </div>
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          Решить по возврату
        </Button>
      </div>

      <CancelWithRefundDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        orderId={orderId}
        paidAmountInKopecks={paidAmountInKopecks}
        alreadyCanceled
        onCanceled={() => {}}
      />
    </div>
  );
};
