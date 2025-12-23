import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import {
  useAddresses,
  useDeleteAddress,
  useMostCommonStreets,
} from "@/modules/addresses/hooks/useAddresses";
import { useAddressFilters } from "@/modules/addresses/hooks/useAddressFilters";
import { MapPin, XCircle, Search, X, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { UserAddress } from "@/modules/addresses/types";
import { Badge } from "@/core/components/ui/badge";
import { formatDateTimeLocal } from "@/core/utils/dateUtils";
import { DataTable, Column } from "@/core/components/ui/DataTable";
import { Pagination } from "@/core/components/ui/Pagination";
import { MostCommonStreets } from "./ui/MostCommonStreets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";

export const AddressesPage = () => {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === "en" ? "en" : "ru") as "ru" | "en";
  const limit = 20;

  const { filters, updateFilters, getApiParams } = useAddressFilters();
  const {
    data: paginationData,
    isLoading,
    error,
  } = useAddresses(getApiParams());
  const { data: mostCommonStreets, isLoading: isLoadingStreets } =
    useMostCommonStreets(10);
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();

  const [deletingAddress, setDeletingAddress] = useState<UserAddress | null>(
    null
  );

  const addressesList = paginationData?.data || [];
  const total = paginationData?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = filters.page < totalPages;

  const handleDelete = (address: UserAddress) => {
    setDeletingAddress(address);
  };

  const handleConfirmDelete = () => {
    if (deletingAddress) {
      deleteAddress(deletingAddress.id);
      setDeletingAddress(null);
    }
  };

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

  const getAddressDisplay = (address: UserAddress): string => {
    if (address.address) {
      return (
        address.address.display ||
        address.address.unrestricted_value ||
        address.address.value ||
        "Нет адреса"
      );
    }
    return "Нет адреса";
  };

  const tableColumns: Column<UserAddress>[] = [
    {
      key: "id",
      header: "ID адреса",
      render: (address) => (
        <span className="font-mono text-xs">#{address.id.slice(-8)}</span>
      ),
    },
    {
      key: "userId",
      header: "ID пользователя",
      render: (address) => (
        <span className="font-mono text-xs">{address.userId.slice(-8)}</span>
      ),
    },
    {
      key: "address",
      header: "Адрес",
      render: (address) => (
        <span className="max-w-md">{getAddressDisplay(address)}</span>
      ),
      showTooltip: true,
      truncate: false,
    },
    {
      key: "status",
      header: "Статус",
      render: (address) => (
        <div className="flex gap-2">
          {address.isPrimary && (
            <Badge
              variant="default"
              className="bg-blue-100 text-blue-800 border-blue-200"
            >
              Основной
            </Badge>
          )}
          {address.isSupportableArea && (
            <Badge
              variant="default"
              className="bg-green-100 text-green-800 border-green-200"
            >
              Поддерживаемая зона
            </Badge>
          )}
          {!address.isPrimary && !address.isSupportableArea && (
            <Badge
              variant="default"
              className="bg-red-100 text-red-800 border-red-200"
            >
              Не поддерживаемая зона
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Дата создания",
      render: (address) => formatDateTimeLocal(address.created_at, locale),
    },
    {
      key: "actions",
      header: "Действия",
      render: (address) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDelete(address)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
          <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold truncate">Адреса</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Управление адресами пользователей ({total})
          </p>
        </div>
      </div>

      {/* Статистика по улицам */}
      {mostCommonStreets && mostCommonStreets.length > 0 && (
        <MostCommonStreets
          streets={mostCommonStreets}
          isLoading={isLoadingStreets}
        />
      )}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h2 className="text-xl font-semibold">Список адресов</h2>
        </div>

        {/* Фильтры */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Поиск по названию адреса */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск по названию адреса..."
              value={filters.addressName}
              onChange={(e) => {
                updateFilters({ addressName: e.target.value, page: 1 });
              }}
              className="w-full pl-10 pr-10 py-2 bg-background border border-input text-foreground placeholder:text-muted-foreground rounded-md h-10 outline-none focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring"
            />
            {filters.addressName && (
              <button
                onClick={() => {
                  updateFilters({ addressName: "", page: 1 });
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Фильтр по user_id */}
          <div className="relative">
            <input
              type="text"
              placeholder="Фильтр по ID пользователя..."
              value={filters.userId}
              onChange={(e) => {
                updateFilters({ userId: e.target.value, page: 1 });
              }}
              className="w-full sm:w-[200px] pl-3 pr-10 py-2 bg-background border border-input text-foreground placeholder:text-muted-foreground rounded-md h-10 outline-none focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring"
            />
            {filters.userId && (
              <button
                onClick={() => {
                  updateFilters({ userId: "", page: 1 });
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {addressesList.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Адреса не найдены</p>
          </div>
        ) : (
          <DataTable
            data={addressesList}
            getRowKey={(address) => address.id}
            emptyMessage="Адреса не найдены"
            columns={tableColumns}
            className="min-h-[420px]"
          />
        )}

        {total > 0 && (
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            onPrevious={() =>
              updateFilters({ page: Math.max(1, filters.page - 1) })
            }
            onNext={() =>
              updateFilters({
                page: hasNextPage ? filters.page + 1 : filters.page,
              })
            }
            className="mt-6"
          />
        )}
      </div>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={!!deletingAddress}
        onOpenChange={() => setDeletingAddress(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Вы уверены, что хотите удалить адрес{" "}
              <strong>
                "{deletingAddress && getAddressDisplay(deletingAddress)}"
              </strong>
              ?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Это действие нельзя отменить.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeletingAddress(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
