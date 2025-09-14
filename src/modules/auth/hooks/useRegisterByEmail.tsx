import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";
import { RegisterEmailDto } from "../types";
import { toastManager } from "@/core/components/ui/toast/toast";
import { handleApiError } from "@/core/utils/errorHandler";


export const useRegisterByEmail = () => {
    return useMutation({
        mutationFn: (data: RegisterEmailDto) => authApi.register(data),
        onSuccess: (data) => {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
        },
        onError: (error) => {
            toastManager.error(handleApiError(error, 'Registration failed'));
        }
    })
}
