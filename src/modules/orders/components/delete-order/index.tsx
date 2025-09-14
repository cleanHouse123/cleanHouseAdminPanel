import { useDeleteOrder } from "../../hooks/useOrders";
import { Button } from "@/core/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DeleteOrderProps {
  orderId: string;
  onDelete?: () => void;
}

export const DeleteOrder = ({ orderId, onDelete }: DeleteOrderProps) => {
  const { t } = useTranslation();
  const { mutateAsync: deleteOrder, isPending } = useDeleteOrder();
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2 text-destructive hover:text-destructive"
      onClick={() => {
        deleteOrder(orderId).then(() => {
          onDelete?.();
        });
      }}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
      {t("orders.deleteOrder")}
    </Button>
  );
};
