import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressesApi } from '../api';
import { FindAddressesQueryDto, MostCommonStreet } from '../types';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export const useAddresses = (params?: FindAddressesQueryDto) => {
  return useQuery({
    queryKey: ['addresses', params],
    queryFn: () => addressesApi.findAll(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Адрес успешно удален');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error?.response?.data as { message?: string })?.message ||
        'Ошибка удаления адреса';
      toast.error('Ошибка', {
        description: errorMessage,
        duration: 5000,
      });
    },
  });
};

export const useMostCommonStreets = (limit?: number) => {
  return useQuery<MostCommonStreet[]>({
    queryKey: ['most-common-streets', limit],
    queryFn: () => addressesApi.getMostCommonStreets(limit),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

