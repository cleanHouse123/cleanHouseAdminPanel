
import { useState } from "react";
import { useLocations, useDeleteLocation } from "@/modules/locations/hooks/useLocations";
import { MapPin, XCircle, LayoutGrid, Table as TableIcon, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/core/components/ui/button";
import { LocationCard } from "./ui/LocationCard";
import { LocationStats } from "./ui/LocationStats";
import { DataTable, Column } from "@/core/components/ui/DataTable";
import { useLocalStorageQuery } from "@/core/hooks/utils/useLocalStorageQuery";
import { LocationDto } from "@/modules/locations/types";
import { formatDateTimeLocal } from "@/core/utils/dateUtils";
import { Badge } from "@/core/components/ui/badge";
import { cn } from "@/core/lib/utils";
import { Pagination } from "@/core/components/ui/Pagination";

export const LocationsPage = () => {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === "en" ? "en" : "ru") as "ru" | "en";
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 40;

  const { data: paginationData, isLoading, error } = useLocations({ page, limit });
  const { mutateAsync: deleteLocation } = useDeleteLocation();

  // Использование localStorage через React Query
  const [viewMode, setViewMode] = useLocalStorageQuery<"cards" | "table">("locationsViewMode", "table");

  const handleCreateLocation = () => {
    navigate("/admin/create-location");
  };

  const handleDelete = (locationId: string) => {
    deleteLocation(locationId);
  };

  const getLocationDisplayName = (location: LocationDto) => {
    const parts = [
      location.settlement,
      location.city,
      location.area,
      location.region,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : t("locations.noLocation");
  };

  const getLocationType = (location: LocationDto) => {
    if (location.settlement) return "settlement";
    if (location.city) return "city";
    if (location.area) return "area";
    if (location.region) return "region";
    return "unknown";
  };

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case "settlement":
        return "bg-green-100 text-green-800 border-green-200";
      case "city":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "area":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "region":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const tableColumns: Column<LocationDto>[] = [
    {
      key: "name",
      header: "Название",
      render: (location) => (
        <div className="font-medium">{getLocationDisplayName(location)}</div>
      ),
      showTooltip: true,
    },
    {
      key: "region",
      header: "Регион",
      render: (location) => location.region || "-",
      showTooltip: true,
    },
    {
      key: "area",
      header: "Область",
      render: (location) => location.area || "-",
      showTooltip: true,
    },
    {
      key: "city",
      header: "Город",
      render: (location) => location.city || "-",
      showTooltip: true,
    },
    {
      key: "settlement",
      header: "Населенный пункт",
      render: (location) => location.settlement || "-",
      showTooltip: true,
    },
    {
      key: "type",
      header: "Тип",
      render: (location) => {
        const type = getLocationType(location);
        return (
          <Badge className={cn(getLocationTypeColor(type))}>
            {t(`locations.type.${type}`)}
          </Badge>
        );
      },
    },
    {
      key: "createdAt",
      header: "Дата создания",
      render: (location) => formatDateTimeLocal(location.created_at, locale),
    },
    {
      key: "actions",
      header: "Действия",
      render: (location) => (
        <button
          onClick={() => handleDelete(location.id)}
          className="p-2 hover:bg-red-50 rounded-md transition-colors text-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

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

  const locationsList = paginationData?.data || [];
  const total = paginationData?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;

  const stats = {
    total,
    regions: locationsList.filter(loc => loc.region && !loc.area && !loc.city && !loc.settlement).length,
    cities: locationsList.filter(loc => loc.city && !loc.settlement).length,
    settlements: locationsList.filter(loc => loc.settlement).length,
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold truncate">{t("locations.title")}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t("locations.subtitle", { count: total })}
            </p>
          </div>
        </div>

        <Button
          onClick={handleCreateLocation}
          className="w-full sm:w-auto flex-shrink-0"
        >
          {t("locations.createLocation")}
        </Button>
      </div>

      <LocationStats stats={stats} />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h2 className="text-xl font-semibold">{t("locations.list")}</h2>
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

        {locationsList.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("locations.empty")}</p>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {locationsList.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        ) : (
          <DataTable
            data={locationsList}
            getRowKey={(location) => location.id}
            emptyMessage={t("locations.empty")}
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
