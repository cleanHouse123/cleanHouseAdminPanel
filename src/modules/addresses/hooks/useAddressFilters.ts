import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/core/hooks/utils/useDebounce';
import { AddressFilters, FindAddressesQueryDto } from '../types';

const defaultFilters: AddressFilters = {
  userId: '',
  addressName: '',
  page: 1,
};

/**
 * Хук для управления фильтрами адресов с синхронизацией URL
 */
export function useAddressFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Инициализация фильтров из URL
  const getFiltersFromURL = useCallback((): AddressFilters => {
    const userId = searchParams.get('userId') || defaultFilters.userId;
    const addressName = searchParams.get('addressName') || defaultFilters.addressName;
    const page = parseInt(searchParams.get('page') || '1', 10);

    return {
      userId,
      addressName,
      page,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<AddressFilters>(getFiltersFromURL);

  // Debounce для поиска по названию адреса (800мс задержка)
  const debouncedAddressName = useDebounce(filters.addressName, 800);
  // Debounce для userId (800мс задержка)
  const debouncedUserId = useDebounce(filters.userId, 800);

  // Обновление URL при изменении debounced значений (addressName и userId)
  useEffect(() => {
    const currentAddressName = searchParams.get('addressName') || '';
    const currentUserId = searchParams.get('userId') || '';
    const currentPage = searchParams.get('page') || '';

    if (
      debouncedAddressName !== currentAddressName ||
      debouncedUserId !== currentUserId
    ) {
      const params = new URLSearchParams();

      if (debouncedAddressName) {
        params.set('addressName', debouncedAddressName);
      }

      if (debouncedUserId) {
        params.set('userId', debouncedUserId);
      }

      // Сохраняем текущий page
      if (currentPage) {
        params.set('page', currentPage);
      }

      setSearchParams(params, { replace: true });
    }
  }, [debouncedAddressName, debouncedUserId, searchParams, setSearchParams]);

  // Обновление URL при изменении фильтров (только page обновляется сразу)
  const updateURL = useCallback(
    (newFilters: Partial<AddressFilters>) => {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters, ...newFilters };
        const params = new URLSearchParams();

        // addressName и userId обновляются через debounce в отдельном useEffect
        // Здесь обновляем только page
        if (updatedFilters.page > 1) {
          params.set('page', updatedFilters.page.toString());
        } else {
          params.delete('page');
        }

        // Сохраняем текущие addressName и userId из URL (debounced значения)
        const currentAddressName = searchParams.get('addressName');
        if (currentAddressName) {
          params.set('addressName', currentAddressName);
        }
        const currentUserId = searchParams.get('userId');
        if (currentUserId) {
          params.set('userId', currentUserId);
        }

        setSearchParams(params, { replace: true });
        return updatedFilters;
      });
    },
    [searchParams, setSearchParams]
  );

  // Синхронизация с URL при изменении searchParams
  // addressName и userId синхронизируются отдельно через debounce
  useEffect(() => {
    const urlUserId = searchParams.get('userId') || defaultFilters.userId;
    const urlPage = parseInt(searchParams.get('page') || '1', 10);
    const urlAddressName = searchParams.get('addressName') || defaultFilters.addressName;

    setFilters((prev) => {
      // Обновляем page из URL сразу
      // addressName и userId обновляем только если они совпадают с debounced значениями
      // (т.е. когда debounce уже применился)
      const shouldUpdateAddressName = urlAddressName === debouncedAddressName;
      const shouldUpdateUserId = urlUserId === debouncedUserId;
      
      if (
        prev.page !== urlPage ||
        (shouldUpdateAddressName && prev.addressName !== urlAddressName) ||
        (shouldUpdateUserId && prev.userId !== urlUserId)
      ) {
        return {
          ...prev,
          page: urlPage,
          ...(shouldUpdateAddressName && { addressName: urlAddressName }),
          ...(shouldUpdateUserId && { userId: urlUserId }),
        };
      }
      return prev;
    });
  }, [searchParams, debouncedAddressName, debouncedUserId]);

  // Обновление фильтров
  const updateFilters = useCallback(
    (newFilters: Partial<AddressFilters>) => {
      setFilters((prev) => {
        const updated = { ...prev, ...newFilters };

        // Для addressName и userId обновляем только локальное состояние (URL обновится через debounce)
        // Для page обновляем URL сразу
        const { addressName, userId, ...otherFilters } = newFilters;
        if (Object.keys(otherFilters).length > 0) {
          // Есть изменения в других полях (page) - обновляем URL сразу
          updateURL(otherFilters);
        }
        // addressName и userId всегда обновляются только в локальном состоянии

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
    filters.userId.trim() !== '' || filters.addressName.trim() !== '';

  // Подготовка параметров для API (используем debounced значения для addressName и userId)
  const getApiParams = useCallback((): FindAddressesQueryDto => {
    return {
      page: filters.page,
      limit: 20,
      ...(debouncedUserId.trim() && { userId: debouncedUserId.trim() }),
      ...(debouncedAddressName.trim() && { addressName: debouncedAddressName.trim() }),
    };
  }, [filters.page, debouncedUserId, debouncedAddressName]);

  return {
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    getApiParams,
  };
}

