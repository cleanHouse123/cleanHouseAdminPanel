import { useState } from "react";
import { useDeleteAdmin } from "../../hooks/useAdmins";
import { Button } from "@/core/components/ui/button";
import { DeleteConfirmModal } from "@/core/components/ui/modals/DeleteConfirmModal";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface DeleteAdminProps {
  adminId: string;
  onDelete?: () => void;
}

export const DeleteAdmin = ({ adminId, onDelete }: DeleteAdminProps) => {
  const { t } = useTranslation();
  const { mutateAsync: deleteAdmin, isPending } = useDeleteAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteAdmin(adminId);
      toast.success(t("deleteAdmin.success"));
      setIsModalOpen(false);
      onDelete?.();
    } catch (error) {
      console.error(error);
      toast.error(t("deleteAdmin.error"));
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => setIsModalOpen(true)}
        disabled={isPending}
        title={t("common.delete")}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <DeleteConfirmModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleDelete}
        loading={isPending}
        textKey="deleteAdmin.confirm"
      />
    </>
  );
};

