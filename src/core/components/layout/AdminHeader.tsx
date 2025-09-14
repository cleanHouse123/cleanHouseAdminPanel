import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/core/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { ROUTES } from "@/core/constants/routes";
import { Menu, X, User, LogOut, List, Users } from "lucide-react";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { LanguageSwitcher } from "@/core/feauture/language/LanguageSwitcher";
import { ThemeToggle } from "@/core/feauture/theme/theme-toggle";

export const AdminHeader = () => {
  const { t } = useTranslation();
  const { clearUser, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    clearUser();
    navigate(ROUTES.ADMIN.LOGIN);
  };

  const isActive = (path: string) => location.pathname === path;

  const closeMenu = () => setIsMenuOpen(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16">
      <div className="flex h-full">
        {/* Левая часть - как nav bar */}
        <div className="hidden md:flex w-64 bg-muted/50 border-r border-b border-border items-center px-6">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-foreground">Admin Panel</h1>
          </div>
        </div>

        {/* Мобильная левая часть */}
        <div className="md:hidden flex items-center px-4 bg-muted/50 border-r border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="mr-2"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Admin</h1>
        </div>

        {/* Правая часть - элементы управления */}
        <div className="flex-1 bg-background border-b border-border flex items-center justify-end px-2 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />

            <ThemeToggle/>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-full hover:bg-accent"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-accent rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-foreground">
                    {user?.email ? user.email.split('@')[0] : 'User_name'}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="end">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  {t("nav.logout")}
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 top-16 bg-muted/90 z-40 md:hidden">
          <nav className="flex flex-col p-4 space-y-2">
            <Button
              variant={isActive(ROUTES.ADMIN.ORDERS.LIST) ? "default" : "ghost"}
              onClick={() => {
                navigate(`${ROUTES.ADMIN.ORDERS.LIST}`);
                closeMenu();
              }}
              className={`w-full justify-start gap-2 rounded-lg ${
                isActive(ROUTES.ADMIN.ORDERS.LIST)
                  ? "bg-secondary hover:bg-secondary text-foreground"
                  : "hover:bg-accent text-foreground"
              }`}
            >
              <List className="h-4 w-4" />
              {t("nav.orders")}
            </Button>

            <Button
              variant={isActive(ROUTES.ADMIN.ADMIN.LIST) ? "default" : "ghost"}
              onClick={() => {
                navigate(`${ROUTES.ADMIN.ADMIN.LIST}`);
                closeMenu();
              }}
              className={`w-full justify-start gap-2 rounded-lg ${
                isActive(ROUTES.ADMIN.ADMIN.LIST)
                  ? "bg-secondary hover:bg-secondary text-foreground"
                  : "hover:bg-accent text-foreground"
              }`}
            >
              <Users className="h-4 w-4" />
              {t("nav.admins")}
            </Button>

            <Button
              variant={isActive(ROUTES.ADMIN.USERS.LIST) ? "default" : "ghost"}
              onClick={() => {
                navigate(`${ROUTES.ADMIN.USERS.LIST}`);
                closeMenu();
              }}
              className={`w-full justify-start gap-2 rounded-lg ${
                isActive(ROUTES.ADMIN.USERS.LIST)
                  ? "bg-secondary hover:bg-secondary text-foreground"
                  : "hover:bg-accent text-foreground"
              }`}
            >
              <Users className="h-4 w-4" />
              {t("nav.admins")}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
