import { Package, Clock, CheckCircle, DollarSign, XCircle } from "lucide-react";
import { StatCard } from "@/core/components/ui/stats/StatCard";
import { useTranslation } from "react-i18next";

interface OrderStatsProps {
  stats: {
    total: number;
    paid: number;
    new: number;
    canceled: number;
    inProgress: number;
    completed: number;
  };
}
export const OrderStats = ({ stats }: OrderStatsProps) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title={t("orders.stats.total")}
        value={stats.total}
        subtitle={t("orders.stats.totalSubtitle")}
        icon={Package}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard
        title={t("orders.stats.paid")}
        value={stats.paid}
        subtitle={t("orders.stats.paidSubtitle")}
        icon={DollarSign}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard
        title={t("orders.stats.new")}
        value={stats.new}
        subtitle={t("orders.stats.newSubtitle")}
        icon={Clock}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
      />
      <StatCard
        title={t("orders.stats.inProgress")}
        value={stats.inProgress}
        subtitle={t("orders.stats.inProgressSubtitle")}
        icon={Package}
        iconBgColor="bg-orange-100"
        iconColor="text-orange-600"
      />
      <StatCard
        title={t("orders.stats.completed")}
        value={stats.completed}
        subtitle={t("orders.stats.completedSubtitle")}
        icon={CheckCircle}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard
        title={t("orders.stats.canceled")}
        value={stats.canceled}
        subtitle={t("orders.stats.canceledSubtitle")}
        icon={XCircle}
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
      />
    </div>
  );
};
