import { useAdmins } from "@/modules/admins/hooks/useAdmins";
import { Shield, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AdminCard } from "./ui/AdminCard";
import { AdminStats } from "./ui/AdminStats";

export const AdminPage = () => {
  const { t } = useTranslation();
  
  const { data: admins, isLoading, error } = useAdmins();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">{t("common.error")}</p>
        </div>
      </div>
    );
  }

  const adminsList = admins || [];
  const total = adminsList.length;

  const stats = {
    total,
    verified: adminsList.filter(admin => admin.isEmailVerified && admin.isPhoneVerified).length,
    unverified: adminsList.filter(admin => !admin.isEmailVerified || !admin.isPhoneVerified).length,
    emailVerified: adminsList.filter(admin => admin.isEmailVerified).length,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Заголовок */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("admins.title")}</h1>
          <p className="text-muted-foreground">
            {t("admins.subtitle", { count: total })}
          </p>
        </div>
      </div>

      <AdminStats stats={stats} />
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t("admins.list")}</h2>
        
        {adminsList.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("admins.empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {adminsList.map((admin) => (
              <AdminCard key={admin.id} admin={admin} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
