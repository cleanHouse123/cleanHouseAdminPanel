import { useState } from "react";
import { useDeleteUser } from "../../hooks/useUsers";
import { Button } from "@/core/components/ui/button";
import { DeleteConfirmModal } from "@/core/components/ui/modals/DeleteConfirmModal";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface DeleteUserProps {
  userId: string;
  userName?: string;
  onDelete?: () => void;
}

export const DeleteUser = ({ userId, userName, onDelete }: DeleteUserProps) => {
  const { t } = useTranslation();
  const { mutateAsync: deleteUser, isPending } = useDeleteUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteUser(userId);
      toast.success(t("deleteUser.success"));
      setIsModalOpen(false);
      onDelete?.();
    } catch (error) {
      toast.error(t("deleteUser.error"));
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
        textKey="deleteUser.confirm"
      />
    </>
  );
};

