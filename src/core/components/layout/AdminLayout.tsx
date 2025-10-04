import { AdminHeader } from "@/core/components/layout/AdminHeader";
import { AdminNavBar } from "@/core/components/layout/AdminNavBar";
import { Outlet } from "react-router-dom";
import { useDocumentTitle } from "@/core/hooks/utils/useDocumentTitle";
import { Toaster } from "../ui/toast/sonner";
import { useTranslation } from 'react-i18next';
import { useGetMe } from "@/modules/auth/hooks/useGetMe";
import { useEffect } from "react";
import { useAuthStore } from "@/modules/auth/store/authStore";
export const AdminLayout = () => {

    useDocumentTitle("Админ Панель - ЧистоДом")
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar' || i18n.language === 'he';
    const { setUser } = useAuthStore()
    const { data: me } = useGetMe()

    useEffect(() => {
        if (me) {
            setUser(me)
        }
    }, [me, setUser])

    return (
        <div className="min-h-screen bg-background overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            <AdminHeader />
            <div className="flex">
                <AdminNavBar />
                <main className={`flex-1 h-[calc(100vh-64px)] mt-16 overflow-x-hidden ${isRTL ? 'md:pr-64' : 'md:pl-64'}`}>
                    <div className="container mx-auto p-2 sm:p-4 h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
                        <Outlet />
                    </div>
                </main>
            </div>
            <Toaster />
        </div>
    )
}
