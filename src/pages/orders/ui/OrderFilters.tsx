import { X, Search, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { OrderStatus } from "@/modules/orders/types/orders";
import { Button } from "@/core/components/ui/button";
import { SelectField } from "@/core/components/ui/SelectField";
import { DateRangePicker } from "@/core/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { useOrderFilters } from "@/modules/orders/hooks/useOrderFilters";
import { Switch } from "@/core/components/ui/switch";
import { useDebounce } from "@/core/hooks/utils/useDebounce";
import { useEffect, useState } from "react";


interface OrderFiltersProps {
  locale: "ru" | "en";
}

export function OrderFilters({ locale }: OrderFiltersProps) {
  const { t } = useTranslation();
  const { filters, updateFilters, resetFilters, hasActiveFilters } = useOrderFilters();
  const [customerSearchValue, setCustomerSearchValue] = useState(filters.customerSearch || "");
  const debouncedCustomerSearch = useDebounce(customerSearchValue, 500);

  useEffect(() => {
    updateFilters({ customerSearch: debouncedCustomerSearch, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedCustomerSearch]);

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
        {/* Фильтр просроченных заказов */}
        <div className="min-w-full max-w-full flex items-center justify-between p-3 border rounded-md bg-background">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <div>
              <label className="text-sm font-medium">
                {t("orders.filters.showOverdue") || "Показать только просроченные"}
              </label>
              <p className="text-xs text-muted-foreground">
                {t("orders.filters.showOverdueDescription") || "Заказы с истекшим сроком выполнения"}
              </p>
            </div>
          </div>
          <Switch
            checked={filters.isOverdue === true}
            onCheckedChange={(checked) => {
              updateFilters({ isOverdue: checked || undefined, page: 1 });
            }}
          />
        </div>

        {/* Поиск по клиенту */}
        <div className="min-w-full max-w-full">
          <label className="text-sm font-medium mb-2 block">
            {"Поиск по клиенту"}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={customerSearchValue}
              onChange={(e) => {
                setCustomerSearchValue(e.target.value);
              }}
              placeholder={"Имя, телефон или email клиента"}
              className="w-full py-2 pl-10 pr-3 bg-background border border-input text-foreground rounded-md outline-none focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Фильтр по статусу */}
        <div className="min-w-full max-w-full">
          <SelectField
            options={statusOptions}
            value={filters.status}
            onChange={(value) => {
              updateFilters({ status: value, page: 1 });
            }}
            placeholder={"Выберите статус"}
            label={t("orders.filters.status") || "Статус"}
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
