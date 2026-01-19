import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { OrderStatus } from "../types/orders";

export interface OrderFilters {
  status: string;
  customerId: string;
  currierId: string;
  dateRange: DateRange | undefined;
  sortOrder: "ASC" | "DESC" | "none";
  page: number;
  isOverdue?: boolean;
  customerSearch?: string;
}

const defaultFilters: OrderFilters = {
  status: "all",
  customerId: "",
  currierId: "",
  dateRange: undefined,
  sortOrder: "none",
  page: 1,
  isOverdue: undefined,
  customerSearch: "",
};

/**
 * Хук для управления фильтрами заказов с синхронизацией URL
 */
export function useOrderFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Инициализация фильтров из URL
  const getFiltersFromURL = useCallback((): OrderFilters => {
    const status = searchParams.get("status") || defaultFilters.status;
    const customerId = searchParams.get("customerId") || defaultFilters.customerId;
    const currierId = searchParams.get("currierId") || defaultFilters.currierId;
    const sortOrder = (searchParams.get("sortOrder") || defaultFilters.sortOrder) as "ASC" | "DESC" | "none";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const isOverdue = searchParams.get("isOverdue") === "true" ? true : searchParams.get("isOverdue") === "false" ? false : undefined;
    const customerSearch = searchParams.get("customerSearch") || defaultFilters.customerSearch;

    // Парсинг дат из URL
    let dateRange: DateRange | undefined = undefined;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    if (startDate) {
      dateRange = {
        from: new Date(startDate),
        to: endDate ? new Date(endDate) : undefined,
      };
    }

    return {
      status,
      customerId,
      currierId,
      dateRange,
      sortOrder,
      page,
      isOverdue,
      customerSearch,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<OrderFilters>(getFiltersFromURL);

  // Обновление URL при изменении фильтров
  const updateURL = useCallback(
    (newFilters: Partial<OrderFilters>) => {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters, ...newFilters };
        const params = new URLSearchParams();

        if (updatedFilters.status !== defaultFilters.status) {
          params.set("status", updatedFilters.status);
        }
        if (updatedFilters.customerId) {
          params.set("customerId", updatedFilters.customerId);
        }
        if (updatedFilters.currierId) {
          params.set("currierId", updatedFilters.currierId);
        }
        if (updatedFilters.dateRange?.from) {
          params.set("startDate", updatedFilters.dateRange.from.toISOString());
          if (updatedFilters.dateRange.to) {
            params.set("endDate", updatedFilters.dateRange.to.toISOString());
          }
        }
        if (updatedFilters.sortOrder !== defaultFilters.sortOrder) {
          params.set("sortOrder", updatedFilters.sortOrder);
        }
        if (updatedFilters.page > 1) {
          params.set("page", updatedFilters.page.toString());
        }
        if (updatedFilters.isOverdue !== undefined) {
          params.set("isOverdue", updatedFilters.isOverdue.toString());
        }
        if (updatedFilters.customerSearch?.trim()) {
          params.set("customerSearch", updatedFilters.customerSearch.trim());
        }

        setSearchParams(params, { replace: true });
        return updatedFilters;
      });
    },
    [setSearchParams]
  );

  // Синхронизация с URL при изменении searchParams
  useEffect(() => {
    const urlFilters = getFiltersFromURL();
    setFilters(urlFilters);
  }, [searchParams, getFiltersFromURL]);

  // Обновление фильтров
  const updateFilters = useCallback(
    (newFilters: Partial<OrderFilters>) => {
      updateURL(newFilters);
    },
    [updateURL]
  );

  // Сброс фильтров
  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
    setFilters(defaultFilters);
  }, [setSearchParams]);

  // Проверка наличия активных фильтров
  const hasActiveFilters =
    filters.status !== defaultFilters.status ||
    filters.customerId.trim() !== "" ||
    filters.currierId.trim() !== "" ||
    filters.dateRange?.from ||
    filters.sortOrder !== defaultFilters.sortOrder ||
    filters.isOverdue !== undefined ||
    filters.customerSearch?.trim() !== "";

  // Подготовка параметров для API
  const getApiParams = useCallback(() => {
    return {
      page: filters.page,
      limit: 20,
      ...(filters.status !== "all" && { status: filters.status as OrderStatus }),
      ...(filters.customerId.trim() && { customerId: filters.customerId.trim() }),
      ...(filters.currierId.trim() && { currierId: filters.currierId.trim() }),
      ...(filters.dateRange?.from && {
        startScheduledAtDate: new Date(
          filters.dateRange.from.getFullYear(),
          filters.dateRange.from.getMonth(),
          filters.dateRange.from.getDate(),
          0,
          0,
          0
        ).toISOString(),
      }),
      ...(filters.dateRange?.to && {
        endScheduledAtDate: new Date(
          filters.dateRange.to.getFullYear(),
          filters.dateRange.to.getMonth(),
          filters.dateRange.to.getDate(),
          23,
          59,
          59
        ).toISOString(),
      }),
      ...(filters.sortOrder !== "none" && { sortOrder: filters.sortOrder as "ASC" | "DESC" }),
      ...(filters.isOverdue !== undefined && { isOverdue: filters.isOverdue }),
      ...(filters.customerSearch?.trim() && { customerSearch: filters.customerSearch.trim() }),
    };
  }, [filters]);

  return {
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    getApiParams,
  };
}
