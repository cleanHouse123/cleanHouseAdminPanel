import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/core/components/ui/button";
import { useRestoreUser } from "../../hooks/useUsers";

interface RestoreUserProps {
  userId: string;
  userName?: string;
}

export const RestoreUser = ({ userId, userName }: RestoreUserProps) => {
  const { t } = useTranslation();
  const { mutateAsync: restoreUser, isPending } = useRestoreUser();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    if (isRestoring) return;
    setIsRestoring(true);
    try {
      await restoreUser(userId);
      toast.success(
        t("restoreUser.success", {
          userName: userName || "",
        }),
      );
    } catch {
      toast.error(t("restoreUser.error"));
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
      onClick={handleRestore}
      disabled={isPending || isRestoring}
      title={t("restoreUser.action")}
    >
      <RotateCcw className="h-4 w-4" />
    </Button>
  );
};
