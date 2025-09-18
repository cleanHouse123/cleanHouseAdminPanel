import { MapPin, Building, Navigation, Map } from "lucide-react";
import { StatCard } from "@/core/components/ui/stats/StatCard";
import { useTranslation } from "react-i18next";

interface LocationStatsProps {
  stats: {
    total: number;
    regions: number;
    cities: number;
    settlements: number;
  };
}

export const LocationStats = ({ stats }: LocationStatsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title={t("locations.stats.total")}
        value={stats.total}
        subtitle={t("locations.stats.totalSubtitle")}
        icon={MapPin}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard
        title={t("locations.stats.regions")}
        value={stats.regions}
        subtitle={t("locations.stats.regionsSubtitle")}
        icon={Map}
        iconBgColor="bg-orange-100"
        iconColor="text-orange-600"
      />
      <StatCard
        title={t("locations.stats.cities")}
        value={stats.cities}
        subtitle={t("locations.stats.citiesSubtitle")}
        icon={Building}
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
      />
      <StatCard
        title={t("locations.stats.settlements")}
        value={stats.settlements}
        subtitle={t("locations.stats.settlementsSubtitle")}
        icon={Navigation}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
    </div>
  );
};
