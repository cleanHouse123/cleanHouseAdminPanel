import { Navigate, useLocation } from 'react-router-dom'
import { SessionExpiredModal } from '@/core/components/ui/modals/SessionExpiredModal';
import { useAuthStore } from '@/modules/auth/store/authStore';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, sessionExpired, accessToken, refreshToken } = useAuthStore()
    const location = useLocation()

    if (sessionExpired) {
        return (
            <>
                {children}
                <SessionExpiredModal />
            </>
        )
    }

    if (!user || !accessToken || !refreshToken) {
        return <Navigate to={'/login'} state={{ from: location }} replace />
    }

    return children
}

