import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { useUsers } from "@/modules/users/hooks/useUsers";
import { Shield, XCircle, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UserStats } from "./ui/UserStats";
import { User } from "@/modules/users/types";
import { Badge } from "@/core/components/ui/badge";
import { cn } from "@/core/lib/utils";
import { UserRole } from "@/core/types/user";
import { formatDateTimeLocal } from "@/core/utils/dateUtils";
import { DataTable, Column } from "@/core/components/ui/DataTable";
import { SelectField } from "@/core/components/ui/SelectField";
import { Pagination } from "@/core/components/ui/Pagination";

export const UsersPage = () => {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === "en" ? "en" : "ru") as "ru" | "en";
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 20;
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const { data: paginationData, isLoading, error } = useUsers({
    params: {
      page,
      limit,
      role: selectedRole !== "all" ? selectedRole as UserRole : undefined
    }
  });


  const usersList = paginationData?.data || [];
  const total = paginationData?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;

  // Фильтрация по роли делается на сервере через API параметры

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h2 className="text-xl font-semibold">{t("users.list")}</h2>
          <SelectField
            options={[
              { value: "all", label: "Все пользователи" },
              { value: UserRole.CURRIER, label: "Курьеры" },
              { value: UserRole.CUSTOMER, label: "Клиенты" },
            ]}
            value={selectedRole}
            onChange={(value) => {
              setSelectedRole(value);
              setPage(1);
            }}
            placeholder="Выберите роль"
            className="w-[180px]"
          />
        </div>

        {usersList.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("users.empty")}</p>
          </div>
        ) : (
          <DataTable
            data={usersList}
            getRowKey={(user) => user.id}
            emptyMessage={t("users.empty")}
            columns={
              [
                {
                  key: "name",
                  header: "Имя",
                  render: (user) => user.name,
                  showTooltip: true,
                },
                {
                  key: "email",
                  header: "Email",
                  render: (user) => user.email,
                  showTooltip: true,
                },
                {
                  key: "phone",
                  header: "Телефон",
                  render: (user) => user.phone,
                  showTooltip: true,
                },
                {
                  key: "role",
                  header: "Роль",
                  render: (user) => (
                    <Badge
                      className={cn(
                        user.role === UserRole.ADMIN
                          ? "bg-purple-100 text-purple-800 border-purple-200"
                          : user.role === UserRole.CUSTOMER
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : user.role === UserRole.CURRIER
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                      )}
                    >
                      {user.role === UserRole.ADMIN ? t("users.role.admin") :
                        user.role === UserRole.CUSTOMER ? t("users.role.customer") :
                          user.role === UserRole.CURRIER ? t("users.role.currier") : user.role}
                    </Badge>
                  ),
                },
                {
                  key: "verification",
                  header: "Верификация",
                  render: (user) => (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {user.isEmailVerified && user.isPhoneVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className={cn(
                          "text-xs",
                          user.isEmailVerified && user.isPhoneVerified ? "text-green-600" : "text-red-600"
                        )}>
                          {user.isEmailVerified && user.isPhoneVerified
                            ? t("users.verified")
                            : t("users.notVerified")}
                        </span>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "createdAt",
                  header: "Дата создания",
                  render: (user) => formatDateTimeLocal(
                    user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
                    locale
                  ),
                },
              ] as Column<User>[]
            }
          />
        )}

        {total > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            onPrevious={() => setPage((prev) => Math.max(1, prev - 1))}
            onNext={() => setPage((prev) => (hasNextPage ? prev + 1 : prev))}
            className="mt-6"
          />
        )}
      </div>
    </div>
  );
};
