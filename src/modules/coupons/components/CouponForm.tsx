import { useState, useEffect } from "react";
import {
  Coupon,
  CouponDiscountType,
  CouponFormData,
  CouponScope,
} from "../types/coupon";
import { useSubscriptionPlans } from "@/modules/subscription-plans/hooks/useSubscriptionPlans";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/inputs/input";
import { Textarea } from "@/core/components/ui/inputs/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/inputs/select";
import { Switch } from "@/core/components/ui/switch";
import { Label } from "@/core/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";

interface CouponFormProps {
  coupon?: Coupon;
  onSubmit: (data: CouponFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ANY_PLAN = "__any__";

/** Convert an ISO string to a `datetime-local` input value (local time). */
const toLocalInput = (iso: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const emptyForm: CouponFormData = {
  code: "",
  description: "",
  scope: "subscription",
  discountType: "final_price",
  value: undefined as unknown as number,
  isActive: true,
  startsAt: "",
  endsAt: "",
  maxRedemptions: undefined,
  minAmountRubles: undefined,
  subscriptionPlanId: undefined,
};

export const CouponForm = ({
  coupon,
  onSubmit,
  onCancel,
  isLoading,
}: CouponFormProps) => {
  const { plans } = useSubscriptionPlans();
  const [formData, setFormData] = useState<CouponFormData>(emptyForm);

  useEffect(() => {
    if (coupon) {
      const isPercent = coupon.discountType === "percent";
      setFormData({
        code: coupon.code,
        description: coupon.description ?? "",
        scope: coupon.scope,
        discountType: coupon.discountType,
        value: isPercent ? coupon.value : coupon.value / 100,
        isActive: coupon.isActive,
        startsAt: toLocalInput(coupon.startsAt),
        endsAt: toLocalInput(coupon.endsAt),
        maxRedemptions: coupon.maxRedemptions ?? undefined,
        minAmountRubles:
          coupon.minAmount != null ? coupon.minAmount / 100 : undefined,
        subscriptionPlanId: coupon.subscriptionPlanId ?? undefined,
      });
    } else {
      setFormData(emptyForm);
    }
  }, [coupon]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isPercent = formData.discountType === "percent";
  const showPlan = formData.scope !== "order";

  const valueLabel = isPercent
    ? "Процент скидки (1–100)"
    : formData.discountType === "final_price"
      ? "Финальная цена, ₽"
      : "Размер скидки, ₽";

  return (
    <Card className="max-w-2xl mx-auto border-none bg-transparent">
      <CardHeader>
        <CardTitle>{coupon ? "Редактировать промокод" : "Создать промокод"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code" className="mb-2 block">
                Код
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, code: e.target.value }))
                }
                placeholder="KVARTAL1"
                required
              />
            </div>
            <div>
              <Label className="mb-2 block">Область</Label>
              <Select
                value={formData.scope}
                onValueChange={(value: CouponScope) =>
                  setFormData((p) => ({ ...p, scope: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription">Подписка</SelectItem>
                  <SelectItem value="order">Заказ</SelectItem>
                  <SelectItem value="both">Заказ и подписка</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="mb-2 block">
              Описание
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Заметка для админа"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Тип скидки</Label>
              <Select
                value={formData.discountType}
                onValueChange={(value: CouponDiscountType) =>
                  setFormData((p) => ({ ...p, discountType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="final_price">Финальная цена</SelectItem>
                  <SelectItem value="percent">Процент</SelectItem>
                  <SelectItem value="fixed_amount">Фикс. скидка</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value" className="mb-2 block">
                {valueLabel}
              </Label>
              <Input
                id="value"
                type="number"
                step={isPercent ? "1" : "0.01"}
                min={isPercent ? 1 : 0}
                max={isPercent ? 100 : undefined}
                value={formData.value ?? ""}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    value:
                      e.target.value === "" ? (undefined as unknown as number) : parseFloat(e.target.value),
                  }))
                }
                required
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {showPlan && (
            <div>
              <Label className="mb-2 block">План подписки (необязательно)</Label>
              <Select
                value={formData.subscriptionPlanId ?? ANY_PLAN}
                onValueChange={(value) =>
                  setFormData((p) => ({
                    ...p,
                    subscriptionPlanId: value === ANY_PLAN ? undefined : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Любой план" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ANY_PLAN}>Любой план</SelectItem>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Ограничить купон конкретным планом (например, «3 заказа за 1₽»).
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxRedemptions" className="mb-2 block">
                Общий лимит погашений
              </Label>
              <Input
                id="maxRedemptions"
                type="number"
                min={1}
                value={formData.maxRedemptions ?? ""}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    maxRedemptions:
                      e.target.value === "" ? undefined : parseInt(e.target.value, 10),
                  }))
                }
                placeholder="Пусто = без лимита"
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div>
              <Label htmlFor="minAmount" className="mb-2 block">
                Мин. сумма покупки, ₽
              </Label>
              <Input
                id="minAmount"
                type="number"
                step="0.01"
                min={0}
                value={formData.minAmountRubles ?? ""}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    minAmountRubles:
                      e.target.value === "" ? undefined : parseFloat(e.target.value),
                  }))
                }
                placeholder="Пусто = без ограничения"
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startsAt" className="mb-2 block">
                Начало действия
              </Label>
              <Input
                id="startsAt"
                type="datetime-local"
                value={formData.startsAt}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, startsAt: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="endsAt" className="mb-2 block">
                Окончание действия
              </Label>
              <Input
                id="endsAt"
                type="datetime-local"
                value={formData.endsAt}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, endsAt: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((p) => ({ ...p, isActive: checked }))
              }
            />
            <Label htmlFor="isActive">Активен</Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Сохранение..." : coupon ? "Обновить" : "Создать"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
