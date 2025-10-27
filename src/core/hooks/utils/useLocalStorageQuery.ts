import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Хук для работы с localStorage через React Query
 * @param key - ключ в localStorage
 * @param defaultValue - значение по умолчанию
 * @returns [value, setValue, isLoading]
 */
export function useLocalStorageQuery<T>(key: string, defaultValue: T) {
  const queryClient = useQueryClient();

  // Запрос для чтения из localStorage
  const { data = defaultValue, isLoading } = useQuery({
    queryKey: ["localStorage", key],
    queryFn: () => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    staleTime: Infinity, // Данные не устаревают
    gcTime: Infinity, // Никогда не удаляются из кэша
  });

  // Мутация для записи в localStorage
  const mutation = useMutation({
    mutationFn: async (value: T) => {
      localStorage.setItem(key, JSON.stringify(value));
      return value;
    },
    onSuccess: (value) => {
      // Обновляем кэш после успешной записи
      queryClient.setQueryData(["localStorage", key], value);
    },
  });

  return [data, mutation.mutate, isLoading] as const;
}

