import { Button } from "@/core/components/ui/button";
import { StatCard } from "@/core/components/ui/stats/StatCard";
import {
  Activity,
  FileText,
  Shield,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-gradient-to-br from-background via-card to-secondary p-6">
      <div className="flex justify-end w-full items-center gap-2">
        <Button variant="admin-primary" onClick={handleLogin}>{t("home.loginButton")}</Button>
      </div>
      <div className="max-w-7xl flex-1 flex flex-col justify-center mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t("home.welcomeTitle")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("home.welcomeDescription")}
          </p>
        </div>

        {/* Основные карточки статистики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={t("home.stats.users.title")}
            value={t("home.stats.users.value")}
            subtitle={t("home.stats.users.subtitle")}
            icon={Users}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />

          <StatCard
            title={t("home.stats.activity.title")}
            value={t("home.stats.activity.value")}
            subtitle={t("home.stats.activity.subtitle")}
            icon={Activity}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />

          <StatCard
            title={t("home.stats.documents.title")}
            value={t("home.stats.documents.value")}
            subtitle={t("home.stats.documents.subtitle")}
            icon={FileText}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
          />

          <StatCard
            title={t("home.stats.security.title")}
            value={t("home.stats.security.value")}
            subtitle={t("home.stats.security.subtitle")}
            icon={Shield}
            iconBgColor="bg-emerald-100"
            iconColor="text-emerald-600"
          />
        </div>
      </div>
    </div>
  );
};
