import { useState } from "react";
import { useCoupons } from "@/modules/coupons/hooks/useCoupons";
import {
  Coupon,
  CouponFormData,
  CreateCouponDto,
} from "@/modules/coupons/types/coupon";
import { CouponCard } from "@/modules/coupons/components/CouponCard";
import { CouponForm } from "@/modules/coupons/components/CouponForm";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent } from "@/core/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";

const toDto = (f: CouponFormData): CreateCouponDto => ({
  code: f.code.trim(),
  description: f.description?.trim() || undefined,
  scope: f.scope,
  discountType: f.discountType,
  value:
    f.discountType === "percent"
      ? Math.round(f.value)
      : Math.round((f.value || 0) * 100),
  isActive: f.isActive,
  startsAt: f.startsAt ? new Date(f.startsAt).toISOString() : undefined,
  endsAt: f.endsAt ? new Date(f.endsAt).toISOString() : undefined,
  maxRedemptions: f.maxRedemptions || undefined,
  minAmount:
    f.minAmountRubles != null && !isNaN(f.minAmountRubles)
      ? Math.round(f.minAmountRubles * 100)
      : undefined,
  subscriptionPlanId: f.subscriptionPlanId || undefined,
});

export const CouponsPage = () => {
  const {
    coupons,
    isLoading,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCoupons();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);

  const handleCreate = () => {
    setEditingCoupon(null);
    setIsFormOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingCoupon) {
      deleteCoupon(deletingCoupon.id);
      setDeletingCoupon(null);
    }
  };

  const handleFormSubmit = (formData: CouponFormData) => {
    const dto = toDto(formData);
    if (editingCoupon) {
      updateCoupon(editingCoupon.id, dto);
    } else {
      createCoupon(dto);
    }
    setIsFormOpen(false);
    setEditingCoupon(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingCoupon(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Промокоды</h1>
          <p className="text-gray-200">Управление промокодами</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Создать промокод
        </Button>
      </div>

      {coupons.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Промокоды не найдены</h3>
              <p className="text-gray-600 mb-4">Создайте первый промокод</p>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Создать промокод
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onEdit={handleEdit}
              onDelete={setDeletingCoupon}
            />
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <CouponForm
            coupon={editingCoupon || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isCreating || isUpdating}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deletingCoupon}
        onOpenChange={() => setDeletingCoupon(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Удалить промокод{" "}
              <strong className="font-mono">{deletingCoupon?.code}</strong>?
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Если промокод уже использовался, удаление недоступно — выключите
              его вместо удаления.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeletingCoupon(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
