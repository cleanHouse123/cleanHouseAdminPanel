import { Button } from "@/core/components/ui/button";
import { useUsers } from "@/modules/users/hooks/useUsers";
import { Shield, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UserCard } from "./ui/UserCard";
import { UserStats } from "./ui/UserStats";
import { User } from "@/modules/users/types";

export const UsersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: paginationData, isLoading, error } = useUsers();

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

  const usersList = paginationData?.data || [];
  const total = paginationData?.total || 0;

  const stats = {
    total,
    verified: usersList.filter((user: User) => user.isEmailVerified && user.isPhoneVerified).length,
    unverified: usersList.filter((user: User) => !user.isEmailVerified || !user.isPhoneVerified).length,
    emailVerified: usersList.filter((user: User) => user.isEmailVerified).length,
  };

  const handleCreateUser = () => {
    navigate("/admin/create-currier");
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold truncate">{t("users.title")}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t("users.subtitle", { count: total })}
            </p>
          </div>
        </div>

        <Button 
          onClick={handleCreateUser}
          className="w-full sm:w-auto flex-shrink-0"
        >
          {t("common.create")}
        </Button>
      </div>

      <UserStats stats={stats} />
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t("users.list")}</h2>
        
        {usersList.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("users.empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {usersList.map((user: User) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
