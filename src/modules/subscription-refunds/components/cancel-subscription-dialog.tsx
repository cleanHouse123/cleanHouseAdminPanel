import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/inputs/input";
import { Label } from "@/core/components/ui/label";
import { formatKopecks } from "@/core/utils/price";
import { RefundDecision } from "@/modules/orders/types/orders";
import { SubscriptionRefundBreakdown } from "../types";
import { useCancelSubscriptionWithRefund } from "../hooks";

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionId: string;
  /** Оплаченная стоимость подписки в копейках */
  paidAmountInKopecks: number;
  suggested: SubscriptionRefundBreakdown;
  onDecided?: () => void;
}

/**
 * Решение по деньгам при отказе от подписки.
 *
 * Сумму считает пункт 6.7 Оферты, но удержания из того же пункта — расходы
 * по поздним отменам и стоимость использованных пакетов — из базы не
 * вывести, поэтому последнее слово за администратором.
 */
export const CancelSubscriptionDialog = ({
  open,
  onOpenChange,
  subscriptionId,
  paidAmountInKopecks,
  suggested,
  onDecided,
}: CancelSubscriptionDialogProps) => {
  const [decision, setDecision] = useState<RefundDecision>(RefundDecision.FULL);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: cancelWithRefund, isPending } =
    useCancelSubscriptionWithRefund();

  useEffect(() => {
    setAmount(String(suggested.refundAmount / 100));
  }, [suggested.refundAmount]);

  const handleSubmit = async () => {
    setError(null);

    if (decision === RefundDecision.NONE && !reason.trim()) {
      setError("Укажите причину, по которой деньги не возвращаются");
      return;
    }

    const parsedAmount = Number(amount.replace(",", "."));
    if (decision === RefundDecision.PARTIAL) {
      if (!parsedAmount || parsedAmount <= 0) {
        setError("Укажите сумму возврата");
        return;
      }
      if (parsedAmount > paidAmountInKopecks / 100) {
        setError(
          `Сумма больше оплаченной: ${formatKopecks(paidAmountInKopecks)}`
        );
        return;
      }
    }

    try {
      await cancelWithRefund({
        id: subscriptionId,
        data: {
          refund: decision,
          ...(decision === RefundDecision.PARTIAL && { amount: parsedAmount }),
          ...(reason.trim() && { reason: reason.trim() }),
        },
      });
      onDecided?.();
      onOpenChange(false);
    } catch {
      // сообщение уже показал хук
    }
  };

  const options = [
    {
      value: RefundDecision.FULL,
      label: `Вернуть по формуле — ${formatKopecks(suggested.refundAmount)}`,
      hint: "Стоимость неиспользованных выносов, пункт 6.7 Оферты",
    },
    {
      value: RefundDecision.PARTIAL,
      label: "Вернуть другую сумму",
      hint: "Удержаны расходы (пункт 8.2) или стоимость пакетов (пункт 6.2)",
    },
    {
      value: RefundDecision.NONE,
      label: "Без возврата",
      hint: "Выносы использованы или не выполнены по вине заказчика",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Возврат по подписке</DialogTitle>
          <DialogDescription>
            Подписка оплачена на {formatKopecks(paidAmountInKopecks)}. Возврат
            уйдёт в YooKassa сразу.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          {suggested.method === "per_pickup" ? (
            <>
              <p>
                Использовано {suggested.usedOrders} из {suggested.ordersLimit}{" "}
                выносов, цена выноса{" "}
                {formatKopecks(suggested.pricePerPickup ?? 0)}
              </p>
              <p className="mt-1 text-muted-foreground">
                {formatKopecks(suggested.price)} −{" "}
                {formatKopecks(suggested.usedAmount ?? 0)} ={" "}
                {formatKopecks(suggested.refundAmount)}
              </p>
            </>
          ) : (
            <>
              <p>
                Безлимитный тариф: осталось {suggested.remainingDays} дней из{" "}
                {suggested.totalDays}
              </p>
              <p className="mt-1 text-muted-foreground">
                Формулы для безлимита в оферте нет — считаем пропорционально
                неиспользованным дням
              </p>
            </>
          )}
        </div>

        <div className="space-y-3">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3"
            >
              <input
                type="radio"
                name="subscription-refund-decision"
                className="mt-1"
                checked={decision === option.value}
                onChange={() => setDecision(option.value)}
              />
              <span>
                <span className="block text-sm font-medium">
                  {option.label}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {option.hint}
                </span>
              </span>
            </label>
          ))}

          {decision === RefundDecision.PARTIAL && (
            <div className="space-y-1">
              <Label htmlFor="subscription-refund-amount">
                Сумма возврата, ₽
              </Label>
              <Input
                id="subscription-refund-amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                inputMode="decimal"
              />
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="subscription-refund-reason">
              Причина
              {decision === RefundDecision.NONE ? "" : " (необязательно)"}
            </Label>
            <Input
              id="subscription-refund-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Например: удержана стоимость выданных пакетов"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Сохранить решение
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
