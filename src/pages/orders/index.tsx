import { useState } from "react";
import { useOrders } from "@/modules/orders/hooks/useOrders";
import { Package, XCircle, LayoutGrid, Table as TableIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { OrderStatus, OrderResponseDto } from "@/modules/orders/types/orders";
import { OrderCard } from "./ui/OrderCard";
import { OrderStats } from "./ui/OrderStats";
import { Button } from "@/core/components/ui/button";
import { DataTable, Column } from "@/core/components/ui/DataTable";
import { useLocalStorageQuery } from "@/core/hooks/utils/useLocalStorageQuery";
import { formatDateTimeLocal } from "@/core/utils/dateUtils";
import { kopecksToRubles } from "@/core/utils/price";
import { OrderBadge } from "@/modules/orders/components/order-badge";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { Pagination } from "@/core/components/ui/Pagination";

export const OrdersPage = () => {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === "en" ? "en" : "ru") as "ru" | "en";

  // Использование localStorage через React Query
  const [viewMode, setViewMode] = useLocalStorageQuery<"cards" | "table">("ordersViewMode", "table");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: ordersData, isLoading, error } = useOrders({
    page,
    limit,
  });

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

  const orders = ordersData?.orders || [];
  const total = ordersData?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;

  const stats = {
    total,
    new: orders.filter(o => o.status === OrderStatus.NEW).length,
    paid: orders.filter(o => o.status === OrderStatus.PAID).length,
    canceled: orders.filter(o => o.status === OrderStatus.CANCELED).length,
    inProgress: orders.filter(o => o.status === OrderStatus.IN_PROGRESS).length,
    completed: orders.filter(o => o.status === OrderStatus.DONE).length,
  };

  const tableColumns: Column<OrderResponseDto>[] = [
    {
      key: "id",
      header: "ID заказа",
      render: (order) => (
        <span className="font-mono text-xs">#{order.id.slice(-8)}</span>
      ),
    },
    {
      key: "customer",
      header: "Клиент",
      render: (order) => (
        <div>
          <div className="font-medium">{order.customer.name}</div>
          <div className="text-xs text-muted-foreground">{order.customer.phone}</div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Описание",
      render: (order) => order.description,
      showTooltip: true,
    },
    {
      key: "address",
      header: "Адрес",
      render: (order) => order.address,
      showTooltip: true,
    },
    {
      key: "status",
      header: "Статус",
      render: (order) => <OrderBadge status={order.status} />,
    },
    {
      key: "price",
      header: "Сумма",
      render: (order) => (
        <span className="font-bold text-primary">{kopecksToRubles(order.price)} ₽</span>
      ),
    },
    {
      key: "createdAt",
      header: "Дата",
      render: (order) => formatDateTimeLocal(order.createdAt, locale),
    },
    {
      key: "actions",
      header: "Действия",
      render: (order) => (
        <Link to={`/admin/orders/${order.id}`}>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Просмотр
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Заголовок */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
          <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold truncate">{t("orders.title")}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("orders.subtitle", { count: total })}
          </p>
        </div>
      </div>

      <OrderStats stats={stats} />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h2 className="text-xl font-semibold">{t("orders.list")}</h2>
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

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("orders.empty")}</p>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <DataTable
            data={orders}
            getRowKey={(order) => order.id}
            emptyMessage={t("orders.empty")}
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
