import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
import { formatKopecks } from "@/core/utils/price";
import { useSubscriptionsAwaitingRefund } from "../hooks";
import { SubscriptionAwaitingRefund } from "../types";
import { CancelSubscriptionDialog } from "./cancel-subscription-dialog";

/**
 * Отменённые оплаченные подписки, по которым не решили, что с деньгами.
 * Оферта даёт на возврат 10 календарных дней — забытый возврат
 * превращается в претензию.
 */
export const SubscriptionsAwaitingRefund = () => {
  const { data: subscriptions } = useSubscriptionsAwaitingRefund();
  const [deciding, setDeciding] = useState<SubscriptionAwaitingRefund | null>(
    null
  );

  if (!subscriptions || subscriptions.length === 0) {
    return null;
  }

  const daysSince = (date: string) =>
    Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000);

  return (
    <>
      <Card className="border-orange-500/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Подписки ожидают возврата: {subscriptions.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {subscriptions.map((subscription) => {
            const days = daysSince(subscription.canceledAt);

            return (
              <div
                key={subscription.subscriptionId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-mono">
                    #{subscription.subscriptionId.slice(-8)}
                  </span>
                  {subscription.customerName && (
                    <span className="ml-2 text-muted-foreground">
                      {subscription.customerName}
                    </span>
                  )}
                  <div
                    className={
                      days >= 10
                        ? "text-xs text-destructive"
                        : "text-xs text-muted-foreground"
                    }
                  >
                    отменена {days} дн. назад
                    {days >= 10 ? " — срок возврата вышел" : ""}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-medium">
                      {formatKopecks(subscription.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      по формуле{" "}
                      {formatKopecks(subscription.suggested.refundAmount)}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => setDeciding(subscription)}>
                    Решить
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {deciding && (
        <CancelSubscriptionDialog
          open
          onOpenChange={(open) => !open && setDeciding(null)}
          subscriptionId={deciding.subscriptionId}
          paidAmountInKopecks={deciding.amount}
          suggested={deciding.suggested}
          onDecided={() => setDeciding(null)}
        />
      )}
    </>
  );
};
