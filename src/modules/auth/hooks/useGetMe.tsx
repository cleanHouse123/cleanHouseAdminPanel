import { User } from "@/core/types/user";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api";
import { isAxiosError } from "axios";


export const useGetMe = () => {
    const accessToken = localStorage.getItem('accessToken');
    return useQuery<User>({
        queryKey: ['me'],
        queryFn: () => authApi.getMe(),
        enabled: !!accessToken, // Выполнять запрос только если есть токен
        staleTime: 5 * 60 * 1000, // 5 минут - данные считаются свежими
        gcTime: 10 * 60 * 1000, // 10 минут - время хранения в кэше
        refetchOnWindowFocus: false, // не перезагружать при фокусе окна
        refetchOnMount: false, // не перезагружать при монтировании
        retry: (failureCount, error: unknown) => {
            // Не повторять запрос при 401 ошибке (неавторизован)
            if (isAxiosError(error) && error.response?.status === 401) {
                // Очищаем токены при 401 ошибке
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return false;
            }
            // Повторить максимум 2 раза для других ошибок
            return failureCount < 2;
        },
    })
}
