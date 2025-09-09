import { Shield, CheckCircle, XCircle, Users } from 'lucide-react'
import { StatCard } from '@/core/components/ui/stats/StatCard'
import { useTranslation } from 'react-i18next'

interface AdminStatsProps {
  stats: {
    total: number;
    verified: number;
    unverified: number;
    emailVerified: number;
  }
}

export const AdminStats = ({ stats }: AdminStatsProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title={t("admins.stats.total")}
        value={stats.total}
        subtitle={t("admins.stats.totalSubtitle")}
        icon={Users}
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
      />
      <StatCard
        title={t("admins.stats.verified")}
        value={stats.verified}
        subtitle={t("admins.stats.verifiedSubtitle")}
        icon={CheckCircle}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard
        title={t("admins.stats.unverified")}
        value={stats.unverified}
        subtitle={t("admins.stats.unverifiedSubtitle")}
        icon={XCircle}
        iconBgColor="bg-red-100"
        iconColor="text-red-600"
      />
      <StatCard
        title={t("admins.stats.emailVerified")}
        value={stats.emailVerified}
        subtitle={t("admins.stats.emailVerifiedSubtitle")}
        icon={Shield}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
    </div>
  )
}
