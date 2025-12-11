import { useState } from "react";
import { CalendarClock, RefreshCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/inputs/input";
import { Label } from "@/core/components/ui/label";
import { useCreateWorkTime, useDeleteWorkTime, useWorkTimeAll } from "@/modules/work-time/hooks/useWorkTime";
import { DeleteConfirmModal } from "@/core/components/ui/modals/DeleteConfirmModal";

export const WorkTimePage = () => {
  const [startDateLocal, setStartDateLocal] = useState("");
  const [endDateLocal, setEndDateLocal] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const createWorkTime = useCreateWorkTime();
  const deleteWorkTime = useDeleteWorkTime();
  const { data: currentSlot, isLoading: isLoadingSlot } = useWorkTimeAll();

  const effectiveSlot = currentSlot?.[0] ?? null;

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!startDateLocal || !endDateLocal) {
      toast.error("Укажите время начала и окончания");
      return;
    }

    // Сравниваем время напрямую (формат HH:mm)
    if (startDateLocal >= endDateLocal) {
      toast.error("Время окончания должно быть позже времени начала");
      return;
    }

    try {
      await createWorkTime.mutateAsync({ 
        startTime: startDateLocal, 
        endTime: endDateLocal 
      });
      toast.success("Рабочие часы сохранены");
      setStartDateLocal("");
      setEndDateLocal("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = () => {
    setStartDateLocal("");
    setEndDateLocal("");
  };

  const handleDelete = async () => {
    if (!effectiveSlot) return;
    try {
      await deleteWorkTime.mutateAsync(effectiveSlot.id);
      toast.success("График удалён");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <CalendarClock className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Рабочие часы</h1>
          <p className="text-muted-foreground">
            Укажите только время начала и конца рабочего периода (без даты).
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg border bg-card p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startDate">Начало периода</Label>
            <Input
              id="startDate"
              type="time"
              value={startDateLocal}
              onChange={(event) => setStartDateLocal(event.target.value)}
              disabled={createWorkTime.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Окончание периода</Label>
            <Input
              id="endDate"
              type="time"
              value={endDateLocal}
              onChange={(event) => setEndDateLocal(event.target.value)}
              disabled={createWorkTime.isPending}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={createWorkTime.isPending}>
            Создать интервал
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={createWorkTime.isPending || (!startDateLocal && !endDateLocal)}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Сбросить
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          На сервере может существовать только один интервал; при повторном создании
          придет ошибка.
        </p>
      </form>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Текущий график</h2>
            <p className="text-sm text-muted-foreground">
              После создания интервал появится здесь.
            </p>
          </div>
          {effectiveSlot && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={deleteWorkTime.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Удалить
            </Button>
          )}
        </div>

        {isLoadingSlot ? (
          <div className="mt-4 text-sm text-muted-foreground">Загрузка...</div>
        ) : effectiveSlot ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border p-4">
              <p className="text-sm text-muted-foreground">Начало</p>
              <p className="text-lg font-medium">
                {effectiveSlot.startTime}
              </p>
            </div>
            <div className="rounded-md border p-4">
              <p className="text-sm text-muted-foreground">Окончание</p>
              <p className="text-lg font-medium">
                {effectiveSlot.endTime}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            Интервал ещё не создан.
          </div>
        )}
      </div>

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDelete}
        loading={deleteWorkTime.isPending}
        textKey="common.deleteConfirm"
      />
    </div>
  );
};

