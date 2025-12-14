import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { UserRole } from "@/core/types/user";
import { FindUsersQueryDto } from "../types";
import { useDebounce } from "@/core/hooks/utils/useDebounce";

export interface UserFilters {
  search: string;
  role: string;
  page: number;
}

const defaultFilters: UserFilters = {
  search: "",
  role: "all",
  page: 1,
};

/**
 * Хук для управления фильтрами пользователей с синхронизацией URL
 */
export function useUserFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Инициализация фильтров из URL
  const getFiltersFromURL = useCallback((): UserFilters => {
    const search = searchParams.get("search") || defaultFilters.search;
    const role = searchParams.get("role") || defaultFilters.role;
    const page = parseInt(searchParams.get("page") || "1", 10);

    return {
      search,
      role,
      page,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<UserFilters>(getFiltersFromURL);
  
  // Debounce для поиска - используется только для API запроса (800мс задержка)
  const debouncedSearch = useDebounce(filters.search, 800);

  // Обновление URL при изменении debounced поиска (только для search)
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (debouncedSearch !== currentSearch) {
      const params = new URLSearchParams(searchParams);
      
      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      } else {
        params.delete("search");
      }

      setSearchParams(params, { replace: true });
    }
  }, [debouncedSearch, searchParams, setSearchParams]);

  // Обновление URL при изменении фильтров (role и page обновляются сразу)
  const updateURL = useCallback(
    (newFilters: Partial<UserFilters>) => {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters, ...newFilters };
        const params = new URLSearchParams();

        // Search обновляется через debounce в отдельном useEffect
        // Здесь обновляем только role и page
        if (updatedFilters.role !== defaultFilters.role) {
          params.set("role", updatedFilters.role);
        } else {
          params.delete("role");
        }
        
        if (updatedFilters.page > 1) {
          params.set("page", updatedFilters.page.toString());
        } else {
          params.delete("page");
        }

        // Сохраняем текущий search из URL
        const currentSearch = searchParams.get("search");
        if (currentSearch) {
          params.set("search", currentSearch);
        }

        setSearchParams(params, { replace: true });
        return updatedFilters;
      });
    },
    [searchParams, setSearchParams]
  );

  // Синхронизация с URL при изменении searchParams (role и page)
  // Search синхронизируется отдельно через debounce
  useEffect(() => {
    const urlRole = searchParams.get("role") || defaultFilters.role;
    const urlPage = parseInt(searchParams.get("page") || "1", 10);
    
    setFilters((prev) => {
      // Обновляем только role и page из URL
      // Search обновляется через debounce в отдельном useEffect
      if (prev.role !== urlRole || prev.page !== urlPage) {
        return { ...prev, role: urlRole, page: urlPage };
      }
      return prev;
    });
  }, [searchParams]);

  // Обновление фильтров
  const updateFilters = useCallback(
    (newFilters: Partial<UserFilters>) => {
      setFilters((prev) => {
        const updated = { ...prev, ...newFilters };
        
        // Для search обновляем только локальное состояние (URL обновится через debounce)
        // Для role и page обновляем URL сразу
        if (newFilters.search === undefined) {
          updateURL(newFilters);
        }
        
        return updated;
      });
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
    filters.search.trim() !== "" || filters.role !== defaultFilters.role;

  // Определяем, по какому полю искать на основе формата запроса (используем debounced значение)
  const getSearchParams = useCallback((): Partial<FindUsersQueryDto> => {
    const trimmedQuery = debouncedSearch.trim();
    if (!trimmedQuery) return {};

    // Если содержит @, ищем по email
    if (trimmedQuery.includes("@")) {
      return { email: trimmedQuery };
    }
    // Если только цифры и символы для телефона, ищем по телефону
    if (/^[\d\s\-\+\(\)]+$/.test(trimmedQuery)) {
      return { phone: trimmedQuery };
    }
    // Иначе ищем по имени
    return { name: trimmedQuery };
  }, [debouncedSearch]);

  // Подготовка параметров для API
  const getApiParams = useCallback(
    (limit: number = 20): FindUsersQueryDto => {
      return {
        page: filters.page,
        limit,
        ...(filters.role !== "all" && { role: filters.role as UserRole }),
        ...getSearchParams(),
      };
    },
    [filters.page, filters.role, getSearchParams]
  );

  return {
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    getApiParams,
  };
}
