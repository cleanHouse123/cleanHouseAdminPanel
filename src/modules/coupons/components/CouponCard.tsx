import { Coupon, DISCOUNT_TYPE_LABELS, SCOPE_LABELS } from "../types/coupon";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

interface CouponCardProps {
  coupon: Coupon;
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
}

const formatValue = (coupon: Coupon): string => {
  if (coupon.discountType === "percent") return `${coupon.value}%`;
  const rub = (coupon.value / 100).toLocaleString("ru-RU");
  return coupon.discountType === "final_price" ? `${rub} ₽ итого` : `−${rub} ₽`;
};

const formatDate = (iso: string | null): string =>
  iso ? new Date(iso).toLocaleDateString("ru-RU") : "—";

export const CouponCard = ({ coupon, onEdit, onDelete }: CouponCardProps) => {
  return (
    <Card className={coupon.isActive ? "" : "opacity-60"}>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="font-mono text-lg">{coupon.code}</CardTitle>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            coupon.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {coupon.isActive ? "Активен" : "Выключен"}
        </span>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {coupon.description && (
          <p className="text-gray-500">{coupon.description}</p>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">Скидка</span>
          <span className="font-semibold">{formatValue(coupon)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Область</span>
          <span>{SCOPE_LABELS[coupon.scope]}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Тип</span>
          <span>{DISCOUNT_TYPE_LABELS[coupon.discountType]}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Погашения</span>
          <span>
            {coupon.redeemedCount}
            {coupon.maxRedemptions != null ? ` / ${coupon.maxRedemptions}` : ""}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Действует</span>
          <span>
            {formatDate(coupon.startsAt)} — {formatDate(coupon.endsAt)}
          </span>
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(coupon)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(coupon)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
