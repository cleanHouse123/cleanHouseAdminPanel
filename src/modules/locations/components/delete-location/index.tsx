import { Button } from "@/core/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDeleteLocation } from "../../hooks/useLocations";

interface DeleteLocationProps {
  locationId: string;
  onDelete?: () => void;
}

export const DeleteLocation = ({ locationId, onDelete }: DeleteLocationProps) => {
  const { t } = useTranslation();
  const { mutateAsync: deleteLocation, isPending } = useDeleteLocation();
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2 text-destructive hover:text-destructive"
      onClick={() => {
        deleteLocation(locationId).then(() => {
          onDelete?.();
        });
      }}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
      {t("locations.deleteLocation")}
    </Button>
  );
};
