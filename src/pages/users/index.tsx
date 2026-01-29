import { Button } from "@/core/components/ui/button";
import { useUsers } from "@/modules/users/hooks/useUsers";
import { useUserFilters } from "@/modules/users/hooks/useUserFilters";
import { Shield, XCircle, CheckCircle, Pencil, Search, X } from "lucide-react";
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
import { DeleteUser } from "@/modules/users/components/delete-user";
import React, { useMemo } from "react";

export const UsersPage = () => {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === "en" ? "en" : "ru") as "ru" | "en";
  const navigate = useNavigate();
  const limit = 20;

  const { filters, updateFilters, getApiParams } = useUserFilters();
  const { data: paginationData, isLoading, isFetching, error } = useUsers({
    params: getApiParams(limit),
  });

  const usersList = paginationData?.data || [];
  const total = paginationData?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = filters.page < totalPages;

  // Мемоизируем stats чтобы избежать пересчета и layout shifts
  const stats = useMemo(() => {
    if (!paginationData || !usersList.length) {
      return {
        total: 0,
        verified: 0,
        unverified: 0,
        emailVerified: 0,
      };
    }
    return {
      total,
      verified: usersList.filter((user: User) => user.isEmailVerified && user.isPhoneVerified).length,
      unverified: usersList.filter((user: User) => !user.isEmailVerified || !user.isPhoneVerified).length,
      emailVerified: usersList.filter((user: User) => user.isEmailVerified).length,
    };
  }, [paginationData, usersList, total]);

  // Показываем полный loading только при первой загрузке
  if (isLoading && !paginationData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error && !paginationData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">{t("common.error")}</p>
        </div>
      </div>
    );
  }

  const handleCreateUser = () => {
    navigate("/admin/create-currier");
  };

  // Функция для проверки, есть ли данные в колонке
  const hasColumnData = (getValue: (user: User) => any): boolean => {
    return usersList.some((user) => {
      const value = getValue(user);
      return value !== null && value !== undefined && value !== "";
    });
  };

  // Функция для получения значения с проверкой на пустоту
  const getValueOrEmpty = (value: any): React.ReactNode => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground text-sm">Нет данных</span>;
    }
    return value;
  };

  // Определяем колонки с проверкой на наличие данных
  const allColumns: Column<User>[] = [
    {
      key: "name",
      header: "Имя",
      render: (user) => getValueOrEmpty(user.name),
      showTooltip: true,
    },
    {
      key: "email",
      header: "Email",
      render: (user) => getValueOrEmpty(user.email),
      showTooltip: true,
    },
    {
      key: "phone",
      header: "Телефон",
      render: (user) => getValueOrEmpty(user.phone),
      showTooltip: true,
    },
    {
      key: "roles",
      header: "Роли",
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          {(user.roles || []).map((role) => (
            <Badge
              key={role}
              className={cn(
                role === UserRole.ADMIN
                  ? "bg-purple-100 text-purple-800 border-purple-200"
                  : role === UserRole.CUSTOMER
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : role === UserRole.CURRIER
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-gray-100 text-gray-800 border-gray-200"
              )}
            >
              {role === UserRole.ADMIN ? t("users.role.admin") :
                role === UserRole.CUSTOMER ? t("users.role.customer") :
                  role === UserRole.CURRIER ? t("users.role.currier") : role}
            </Badge>
          ))}
          {(!user.roles || user.roles.length === 0) && (
            <span className="text-muted-foreground text-sm">Нет ролей</span>
          )}
        </div>
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
      render: (user) => {
        if (!user.createdAt) {
          return <span className="text-muted-foreground text-sm">Нет данных</span>;
        }
        return formatDateTimeLocal(
          user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
          locale
        );
      },
    },
    {
      key: "actions",
      header: "Действия",
      render: (user) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/users/${user.id}/edit`)}
            title={t("common.edit")}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteUser userId={user.id} userName={user.name} />
        </div>
      ),
    },
  ];

  // Фильтруем колонки - скрываем те, где нет данных
  const visibleColumns = allColumns.filter((column) => {
    // Колонки "Роль", "Верификация" и "Действия" всегда показываем
    if (column.key === "role" || column.key === "verification" || column.key === "actions") {
      return true;
    }

    // Для остальных проверяем наличие данных
    if (column.key === "name") {
      return hasColumnData((user) => user.name);
    }
    if (column.key === "email") {
      return hasColumnData((user) => user.email);
    }
    if (column.key === "phone") {
      return hasColumnData((user) => user.phone);
    }
    if (column.key === "createdAt") {
      return hasColumnData((user) => user.createdAt);
    }

    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 relative">
      {/* Индикатор загрузки поверх контента при обновлении данных */}
      {isFetching && paginationData && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 z-50">
          <div className="h-full bg-primary animate-pulse" style={{ width: '30%' }} />
        </div>
      )}
      
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
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <h2 className="text-xl font-semibold">{t("users.list")}</h2>
            <SelectField
              options={[
                { value: "all", label: "Все пользователи" },
                { value: UserRole.CURRIER, label: "Курьеры" },
                { value: UserRole.CUSTOMER, label: "Клиенты" },
              ]}
              value={filters.role}
              onChange={(value) => {
                updateFilters({ role: value, page: 1 });
              }}
              placeholder="Выберите роль"
              className="w-[180px]"
            />
          </div>
          
          {/* Поле поиска */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск по имени, email или телефону..."
              value={filters.search}
              onChange={(e) => {
                updateFilters({ search: e.target.value, page: 1 });
              }}
              className="w-full pl-10 pr-10 py-2 bg-background border border-input text-foreground placeholder:text-muted-foreground rounded-md h-10 outline-none focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring"
            />
            {filters.search && (
              <button
                onClick={() => {
                  updateFilters({ search: "", page: 1 });
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
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
            columns={visibleColumns}
          />
        )}

        {total > 0 && (
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            onPrevious={() => updateFilters({ page: Math.max(1, filters.page - 1) })}
            onNext={() => updateFilters({ page: hasNextPage ? filters.page + 1 : filters.page })}
            className="mt-6"
          />
        )}
      </div>
    </div>
  );
};
