import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Mail, Phone, User, Shield, CheckCircle, XCircle, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/core/lib/utils";
import { Admin } from "@/modules/admins/types/admin";

interface AdminCardProps {
  admin: Admin;
}

export const AdminCard = ({ admin }: AdminCardProps) => {
  const { t } = useTranslation();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {admin.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatDate(admin.createdAt)}
              </p>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            {t("admins.role.admin")}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Email */}
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">{t("common.email")}</p>
            <p className="text-sm text-muted-foreground">{admin.email}</p>
          </div>
          <div className="flex items-center gap-1">
            {admin.isEmailVerified ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span className={cn(
              "text-xs",
              admin.isEmailVerified ? "text-green-600" : "text-red-600"
            )}>
              {admin.isEmailVerified ? t("admins.verified") : t("admins.notVerified")}
            </span>
          </div>
        </div>

        {/* Телефон */}
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">{t("common.phone")}</p>
            <p className="text-sm text-muted-foreground">{admin.phone}</p>
          </div>
          <div className="flex items-center gap-1">
            {admin.isPhoneVerified ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span className={cn(
              "text-xs",
              admin.isPhoneVerified ? "text-green-600" : "text-red-600"
            )}>
              {admin.isPhoneVerified ? t("admins.verified") : t("admins.notVerified")}
            </span>
          </div>
        </div>

        {/* ID администратора */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {t("admins.id")}
            </p>
            <p className="text-sm font-mono">
              {admin.id.slice(-8)}
            </p>
          </div>
        </div>

        {/* Дата последнего обновления */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {t("admins.lastUpdated")}
            </p>
            <p className="text-sm">
              {formatDate(admin.updatedAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
