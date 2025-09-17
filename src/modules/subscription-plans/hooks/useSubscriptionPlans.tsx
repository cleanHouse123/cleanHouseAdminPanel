import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionPlansApi } from '../api';
import { CreateSubscriptionPlanDto, UpdateSubscriptionPlanDto } from '../types/subscription-plan';
import { toast } from 'sonner';

export const useSubscriptionPlans = () => {
    const queryClient = useQueryClient();

    const {
        data: plans,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['subscription-plans'],
        queryFn: subscriptionPlansApi.getAll,
    });

    const createMutation = useMutation({
        mutationFn: subscriptionPlansApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
            toast.success('План подписки создан успешно');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Ошибка создания плана');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateSubscriptionPlanDto }) =>
            subscriptionPlansApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
            toast.success('План подписки обновлен успешно');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Ошибка обновления плана');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: subscriptionPlansApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
            toast.success('План подписки удален успешно');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Ошибка удаления плана');
        },
    });

    const createPlan = (data: CreateSubscriptionPlanDto) => {
        createMutation.mutate(data);
    };

    const updatePlan = (id: string, data: UpdateSubscriptionPlanDto) => {
        updateMutation.mutate({ id, data });
    };

    const deletePlan = (id: string) => {
        deleteMutation.mutate(id);
    };

    return {
        plans: plans || [],
        isLoading,
        error,
        refetch,
        createPlan,
        updatePlan,
        deletePlan,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
