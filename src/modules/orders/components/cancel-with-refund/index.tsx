import { useState } from "react";
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
import { useCancelOrderWithRefund } from "../../hooks/useOrders";
import { formatKopecks } from "@/core/utils/price";
import { RefundDecision } from "../../types/orders";

interface CancelWithRefundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  /** Оплаченная сумма в копейках, как она хранится у платежа */
  paidAmountInKopecks: number;
  /**
   * Заказ уже отменён, решают только судьбу денег: так приходят заказы
   * из очереди «ожидают возврата»
   */
  alreadyCanceled?: boolean;
  onCanceled: () => void;
}

/**
 * Отмена оплаченного заказа. Решение по деньгам принимается здесь же:
 * отменить заказ и «разобраться потом» нельзя — оферта обещает возврат
 * в течение 10 дней, и забытый возврат превращается в претензию.
 */
export const CancelWithRefundDialog = ({
  open,
  onOpenChange,
  orderId,
  paidAmountInKopecks,
  alreadyCanceled = false,
  onCanceled,
}: CancelWithRefundDialogProps) => {
  const paidRubles = paidAmountInKopecks / 100;
  const [decision, setDecision] = useState<RefundDecision>(RefundDecision.FULL);
  const [amount, setAmount] = useState(String(paidRubles));
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: cancelWithRefund, isPending } =
    useCancelOrderWithRefund();

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
      if (parsedAmount > paidRubles) {
        setError(`Сумма больше оплаченной: ${formatKopecks(paidAmountInKopecks)}`);
        return;
      }
    }

    try {
      await cancelWithRefund({
        id: orderId,
        data: {
          refund: decision,
          ...(decision === RefundDecision.PARTIAL && { amount: parsedAmount }),
          ...(reason.trim() && { reason: reason.trim() }),
        },
      });
      onCanceled();
      onOpenChange(false);
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(message ?? "Не удалось отменить заказ");
    }
  };

  const options: Array<{ value: RefundDecision; label: string; hint: string }> =
    [
      {
        value: RefundDecision.FULL,
        label: `Вернуть полностью — ${formatKopecks(paidAmountInKopecks)}`,
        hint: "Заказ отменён не по вине клиента",
      },
      {
        value: RefundDecision.PARTIAL,
        label: "Вернуть часть",
        hint: "Удержаны расходы или стоимость пакетов, пункт 8.2 Оферты",
      },
      {
        value: RefundDecision.NONE,
        label: "Без возврата",
        hint: "Вынос не выполнен по вине заказчика, пункт 5.7 Оферты",
      },
    ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {alreadyCanceled
              ? "Решение по возврату"
              : "Отмена оплаченного заказа"}
          </DialogTitle>
          <DialogDescription>
            {alreadyCanceled
              ? `Заказ отменён, но деньги остались у нас: оплата на ${formatKopecks(paidAmountInKopecks)}. Выберите, что с ними делать — возврат уйдёт в YooKassa сразу.`
              : `По заказу прошла оплата на ${formatKopecks(paidAmountInKopecks)}. Выберите, что делать с деньгами — возврат уйдёт в YooKassa сразу.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3"
            >
              <input
                type="radio"
                name="refund-decision"
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
              <Label htmlFor="refund-amount">Сумма возврата, ₽</Label>
              <Input
                id="refund-amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                inputMode="decimal"
              />
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="refund-reason">
              Причина
              {decision === RefundDecision.NONE ? "" : " (необязательно)"}
            </Label>
            <Input
              id="refund-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Например: пакет не выставлен в точку передачи"
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
            {alreadyCanceled ? "Сохранить решение" : "Отменить заказ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
