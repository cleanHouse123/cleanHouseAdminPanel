import { useState } from "react";
import { useAdmins } from "@/modules/admins/hooks/useAdmins";
import { Shield, XCircle, LayoutGrid, Table as TableIcon, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AdminCard } from "./ui/AdminCard";
import { AdminStats } from "./ui/AdminStats";
import { Button } from "@/core/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DataTable, Column } from "@/core/components/ui/DataTable";
import { useLocalStorageQuery } from "@/core/hooks/utils/useLocalStorageQuery";
import { Admin } from "@/modules/admins/types/admin";
import { Badge } from "@/core/components/ui/badge";
import { cn } from "@/core/lib/utils";
import { formatDateTimeLocal } from "@/core/utils/dateUtils";
import { Pagination } from "@/core/components/ui/Pagination";

export const AdminPage = () => {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === "en" ? "en" : "ru") as "ru" | "en";
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data: paginationData, isLoading, error } = useAdmins({ page, limit });

  // Использование localStorage через React Query
  const [viewMode, setViewMode] = useLocalStorageQuery<"cards" | "table">("adminsViewMode", "table");

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

  const adminsList = paginationData?.data || [];
  const total = paginationData?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;

  const stats = {
    total,
    verified: adminsList.filter(admin => admin.isEmailVerified && admin.isPhoneVerified).length,
    unverified: adminsList.filter(admin => !admin.isEmailVerified || !admin.isPhoneVerified).length,
    emailVerified: adminsList.filter(admin => admin.isEmailVerified).length,
  };

  const handleCreateAdmin = () => {
    navigate("/admin/create-admin");
  };

  const tableColumns: Column<Admin>[] = [
    {
      key: "name",
      header: "Имя",
      render: (admin) => admin.name,
      showTooltip: true,
    },
    {
      key: "email",
      header: "Email",
      render: (admin) => admin.email,
      showTooltip: true,
    },
    {
      key: "phone",
      header: "Телефон",
      render: (admin) => admin.phone,
      showTooltip: true,
    },
    {
      key: "role",
      header: "Роль",
      render: (admin) => (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          {t("admins.role.admin")}
        </Badge>
      ),
    },
    {
      key: "verification",
      header: "Верификация",
      render: (admin) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {admin.isEmailVerified && admin.isPhoneVerified ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span className={cn(
              "text-xs",
              admin.isEmailVerified && admin.isPhoneVerified ? "text-green-600" : "text-red-600"
            )}>
              {admin.isEmailVerified && admin.isPhoneVerified
                ? t("admins.verified")
                : t("admins.notVerified")}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Дата создания",
      render: (admin) => {
        const iso = new Date(admin.createdAt as unknown as string | number | Date).toISOString();
        return formatDateTimeLocal(iso, locale);
      },
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold truncate">{t("admins.title")}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t("admins.subtitle", { count: total })}
            </p>
          </div>
        </div>

        <Button
          onClick={handleCreateAdmin}
          className="w-full sm:w-auto flex-shrink-0"
        >
          {t("admins.createAdmin")}
        </Button>
      </div>

      <AdminStats stats={stats} />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h2 className="text-xl font-semibold">{t("admins.list")}</h2>
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="rounded-none border-r border-r-border data-[variant=ghost]:border-0"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-none"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {adminsList.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("admins.empty")}</p>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {adminsList.map((admin) => (
              <AdminCard key={admin.id} admin={admin} />
            ))}
          </div>
        ) : (
          <DataTable
            data={adminsList}
            getRowKey={(admin) => admin.id}
            emptyMessage={t("admins.empty")}
            columns={tableColumns}
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
