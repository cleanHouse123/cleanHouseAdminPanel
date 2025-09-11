import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import {
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/core/lib/utils";
import { User } from "@/modules/users/types";
import { UserRole } from "@/core/types/user";

interface UserCardProps {
  user: User;
}

export const UserCard = ({ user }: UserCardProps) => {
  const { t } = useTranslation();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="bg-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-semibold truncate">
                {user.name}
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
          <Badge 
            className={cn(
              "self-start sm:self-center",
              user.role === UserRole.ADMIN 
                ? "bg-purple-100 text-purple-800 border-purple-200" 
                : user.role === UserRole.CUSTOMER
                ? "bg-blue-100 text-blue-800 border-blue-200"
                : user.role === UserRole.CURRIER
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-gray-100 text-gray-800 border-gray-200"
            )}
          >
            {user.role === UserRole.ADMIN ? t("admins.role.admin") : 
             user.role === UserRole.CUSTOMER ? t("common.customer") : 
             user.role === UserRole.CURRIER ? t("common.currier") : user.role}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4">
        {/* Role */}
        <div className="flex items-start gap-2">
          <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium">{t("common.role")}</p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {user.role}
            </p>
          </div>
        </div>
        {/* Email */}
        <div className="flex items-start gap-2">
          <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium">
              {t("common.email")}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {user.isEmailVerified ? (
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            ) : (
              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
            )}
            <span
              className={cn(
                "text-xs hidden sm:inline",
                user.isEmailVerified ? "text-green-600" : "text-red-600"
              )}
            >
              {user.isEmailVerified
                ? t("admins.verified")
                : t("admins.notVerified")}
            </span>
          </div>
        </div>

        {/* Телефон */}
        <div className="flex items-start gap-2">
          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium">
              {t("common.phone")}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {user.phone}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {user.isPhoneVerified ? (
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            ) : (
              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
            )}
            <span
              className={cn(
                "text-xs hidden sm:inline",
                user.isPhoneVerified ? "text-green-600" : "text-red-600"
              )}
            >
              {user.isPhoneVerified
                ? t("admins.verified")
                : t("admins.notVerified")}
            </span>
          </div>
        </div>

        {/* ID администратора */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">
              {t("admins.id")}
            </p>
            <p className="text-xs sm:text-sm font-mono truncate">
              {user.id.slice(-8)}
            </p>
          </div>
        </div>

        {/* Дата последнего обновления */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">
              {t("admins.lastUpdated")}
            </p>
            <p className="text-xs sm:text-sm truncate">
              {formatDate(user.updatedAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
