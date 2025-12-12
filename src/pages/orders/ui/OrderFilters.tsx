import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { OrderStatus } from "@/modules/orders/types/orders";
import { Button } from "@/core/components/ui/button";
import { SelectField } from "@/core/components/ui/SelectField";
import { DateRangePicker } from "@/core/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { useOrderFilters } from "@/modules/orders/hooks/useOrderFilters";

interface OrderFiltersProps {
  locale: "ru" | "en";
}

export function OrderFilters({ locale }: OrderFiltersProps) {
  const { t } = useTranslation();
  const { filters, updateFilters, resetFilters, hasActiveFilters } = useOrderFilters();

  // Опции для фильтра по статусу
  const statusOptions = [
    { value: "all", label: t("orders.filters.allStatuses") || "Все статусы" },
    { value: OrderStatus.NEW, label: t("orders.status.new") || "Новый" },
    { value: OrderStatus.PAID, label: t("orders.status.paid") || "Оплачен" },
    { value: OrderStatus.ASSIGNED, label: t("orders.status.assigned") || "Назначен" },
    { value: OrderStatus.IN_PROGRESS, label: t("orders.status.in_progress") || "В процессе" },
    { value: OrderStatus.DONE, label: t("orders.status.done") || "Завершен" },
    { value: OrderStatus.CANCELED, label: t("orders.status.canceled") || "Отменен" },
  ];

  // Опции для сортировки
  const sortOptions = [
    { value: "none", label: t("orders.filters.noSort") || "Без сортировки" },
    { value: "ASC", label: t("orders.filters.sortAsc") || "По возрастанию даты" },
    { value: "DESC", label: t("orders.filters.sortDesc") || "По убыванию даты" },
  ];

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("orders.filters.title") || "Фильтры и сортировка"}</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            {t("orders.filters.reset") || "Сбросить"}
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Фильтр по статусу */}
        <div className="min-w-full max-w-full">
          <SelectField
            options={statusOptions}
            value={filters.status}
            onChange={(value) => {
              updateFilters({ status: value, page: 1 });
            }}
            placeholder={t("orders.filters.selectStatus") || "Выберите статус"}
            label={t("orders.filters.status") || "Статус"}
          />
        </div>

        {/* Фильтр по ID клиента */}
        <div className="min-w-full max-w-full">
          <label className="text-sm font-medium mb-2 block">
            {t("orders.filters.customerId") || "ID клиента"}
          </label>
          <input
            type="text"
            value={filters.customerId}
            onChange={(e) => {
              updateFilters({ customerId: e.target.value, page: 1 });
            }}
            placeholder={t("orders.filters.customerIdPlaceholder") || "Введите ID клиента"}
            className="w-full py-2 px-3 bg-background border border-input text-foreground rounded-md outline-none focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Фильтр по ID курьера */}
        <div className="min-w-full max-w-full">
          <label className="text-sm font-medium mb-2 block">
            {t("orders.filters.currierId") || "ID курьера"}
          </label>
          <input
            type="text"
            value={filters.currierId}
            onChange={(e) => {
              updateFilters({ currierId: e.target.value, page: 1 });
            }}
            placeholder={t("orders.filters.currierIdPlaceholder") || "Введите ID курьера"}
            className="w-full py-2 px-3 bg-background border border-input text-foreground rounded-md outline-none focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Фильтр по дате */}
        <div className="min-w-full max-w-full">
          <label className="text-sm font-medium mb-2 block">
            {t("orders.filters.dateRange") || "Период"}
          </label>
          <DateRangePicker
            date={filters.dateRange || { from: undefined, to: undefined }}
            onSelect={(range: DateRange | undefined) => {
              updateFilters({ dateRange: range, page: 1 });
            }}
            locale={locale}
          />
        </div>

        {/* Сортировка */}
        <div className="min-w-full max-w-full">
          <SelectField
            options={sortOptions}
            value={filters.sortOrder}
            onChange={(value) => {
              updateFilters({ sortOrder: value as "ASC" | "DESC" | "none", page: 1 });
            }}
            placeholder={t("orders.filters.selectSort") || "Выберите сортировку"}
            label={t("orders.filters.sort") || "Сортировка"}
          />
        </div>
      </div>
    </div>
  );
}
