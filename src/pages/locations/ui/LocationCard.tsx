import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import {
  MapPin,
  Calendar,
  Hash,
  Building,
  Map,
  Navigation,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/core/lib/utils";
import { LocationDto } from "@/modules/locations/types";
import { getLocationTypeI18nKey } from "@/modules/locations/utils/locationTypeI18n";
import { formatDateTime } from "@/core/utils/dateUtils";
import { DeleteLocation } from "@/modules/locations/components/delete-location";

interface LocationCardProps {
  location: LocationDto;
}

export const LocationCard = ({ location }: LocationCardProps) => {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === "en" ? "en" : "ru") as "ru" | "en";

  const getLocationDisplayName = () => {
    const parts = [
      location.sub_area,
      location.city_district,
      location.settlement,
      location.city,
      location.area,
      location.region,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : t("locations.noLocation");
  };

  const getLocationType = () => {
    if (location.sub_area) return "subArea";
    if (location.city_district) return "cityDistrict";
    if (location.settlement) return "settlement";
    if (location.city) return "city";
    if (location.area) return "area";
    if (location.region) return "region";
    return "unknown";
  };

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case "subArea":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "cityDistrict":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
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

  const locationType = getLocationType();

  return (
    <Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-semibold truncate">
                {getLocationDisplayName()}
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {formatDateTime(location.created_at, locale)}
              </p>
            </div>
          </div>
          <Badge 
            className={cn(
              "self-start sm:self-center",
              getLocationTypeColor(locationType)
            )}
          >
            {t(getLocationTypeI18nKey(locationType))}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4">
        {/* Region */}
        {location.region && (
          <div className="flex items-start gap-2">
            <Map className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium">{t("locations.region")}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {location.region}
              </p>
            </div>
          </div>
        )}

        {/* Area */}
        {location.area && (
          <div className="flex items-start gap-2">
            <Navigation className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium">{t("locations.area")}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {location.area}
              </p>
            </div>
          </div>
        )}

        {/* City */}
        {location.city && (
          <div className="flex items-start gap-2">
            <Building className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium">{t("locations.city")}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {location.city}
              </p>
            </div>
          </div>
        )}

        {/* Settlement */}
        {location.settlement && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium">{t("locations.settlement")}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {location.settlement}
              </p>
            </div>
          </div>
        )}

        {location.city_district && (
          <div className="flex items-start gap-2">
            <Building className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium">{t("locations.cityDistrict")}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {location.city_district}
              </p>
            </div>
          </div>
        )}

        {location.sub_area && (
          <div className="flex items-start gap-2">
            <Navigation className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium">{t("locations.subArea")}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {location.sub_area}
              </p>
            </div>
          </div>
        )}

        {/* Street */}
        {location.street && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium">{t("locations.street")}</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {location.street}
              </p>
            </div>
          </div>
        )}

        {/* ID */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">
              {t("locations.id")}
            </p>
            <p className="text-xs sm:text-sm font-mono truncate">
              {location.id.slice(-8)}
            </p>
          </div>
        </div>

        {/* Дата последнего обновления */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">
              {t("locations.lastUpdated")}
            </p>
            <p className="text-xs sm:text-sm truncate">
              {formatDateTime(location.updated_at, locale)}
            </p>
          </div>
        </div>


        <DeleteLocation locationId={location.id} />
      </CardContent>
    </Card>
  );
};
