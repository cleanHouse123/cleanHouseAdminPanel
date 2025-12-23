import { Button } from '@/core/components/ui/button'
import { ROUTES } from '@/core/constants/routes'
import { List, Users, CreditCard, MapPin, Link, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

export const AdminNavBar = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path
  const isRTL = i18n.language === 'ar' || i18n.language === 'he'

  return (
    <nav
      className={`hidden md:flex flex-col gap-2 w-64 min-h-[calc(100vh-64px)] bg-muted/50 border-border py-6 px-2 fixed top-16 z-40 ${isRTL ? 'right-0 border-l' : 'left-0 border-r'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Button
        variant={isActive(ROUTES.ADMIN.ORDERS.LIST) ? 'default' : 'ghost'}
        onClick={() => navigate(`${ROUTES.ADMIN.ORDERS.LIST}`)}
        className={`justify-start gap-2 rounded-lg ${isActive(ROUTES.ADMIN.ORDERS.LIST)
          ? 'bg-secondary hover:bg-secondary text-foreground'
          : 'hover:bg-accent text-foreground'
          }`}
      >
        <List className="h-4 w-4" />
        {t('nav.orders')}
      </Button>

      <Button
        variant={isActive(ROUTES.ADMIN.ADMIN.LIST) ? 'default' : 'ghost'}
        onClick={() => navigate(`${ROUTES.ADMIN.ADMIN.LIST}`)}
        className={`justify-start gap-2 rounded-lg ${isActive(ROUTES.ADMIN.ADMIN.LIST)
          ? 'bg-secondary hover:bg-secondary text-foreground'
          : 'hover:bg-accent text-foreground'
          }`}
      >
        <Users className="h-4 w-4" />
        {t('nav.admins')}
      </Button>

      <Button
        variant={isActive(ROUTES.ADMIN.LOCATIONS.LIST) ? 'default' : 'ghost'}
        onClick={() => navigate(`${ROUTES.ADMIN.LOCATIONS.LIST}`)}
        className={`justify-start gap-2 rounded-lg ${isActive(ROUTES.ADMIN.LOCATIONS.LIST)
          ? 'bg-secondary hover:bg-secondary text-foreground'
          : 'hover:bg-accent text-foreground'
          }`}
      >
        <MapPin className="h-4 w-4" />
        {t('nav.locations')}
      </Button>

      <Button
        variant={isActive(ROUTES.ADMIN.USERS.LIST) ? 'default' : 'ghost'}
        onClick={() => navigate(`${ROUTES.ADMIN.USERS.LIST}`)}
        className={`justify-start gap-2 rounded-lg ${isActive(ROUTES.ADMIN.USERS.LIST)
          ? 'bg-secondary hover:bg-secondary text-foreground'
          : 'hover:bg-accent text-foreground'
          }`}
      >
        <Users className="h-4 w-4" />
        {t('nav.users')}
      </Button>

      <Button
        variant={isActive(ROUTES.ADMIN.SUBSCRIPTION_PLANS.LIST) ? 'default' : 'ghost'}
        onClick={() => navigate(`${ROUTES.ADMIN.SUBSCRIPTION_PLANS.LIST}`)}
        className={`justify-start gap-2 rounded-lg ${isActive(ROUTES.ADMIN.SUBSCRIPTION_PLANS.LIST)
          ? 'bg-secondary hover:bg-secondary text-foreground'
          : 'hover:bg-accent text-foreground'
          }`}
      >
        <CreditCard className="h-4 w-4" />
        {t('nav.subscriptionPlans')}
      </Button>

      <Button
        variant={isActive(ROUTES.ADMIN.AD_TOKENS.LIST) ? 'default' : 'ghost'}
        onClick={() => navigate(`${ROUTES.ADMIN.AD_TOKENS.LIST}`)}
        className={`justify-start gap-2 rounded-lg ${isActive(ROUTES.ADMIN.AD_TOKENS.LIST)
          ? 'bg-secondary hover:bg-secondary text-foreground'
          : 'hover:bg-accent text-foreground'
          }`}
      >
        <Link className="h-4 w-4" />
        Рекламные ссылки
      </Button>

      <Button
        variant={isActive(ROUTES.ADMIN.WORK_TIME.CREATE) ? 'default' : 'ghost'}
        onClick={() => navigate(`${ROUTES.ADMIN.WORK_TIME.CREATE}`)}
        className={`justify-start gap-2 rounded-lg ${isActive(ROUTES.ADMIN.WORK_TIME.CREATE)
          ? 'bg-secondary hover:bg-secondary text-foreground'
          : 'hover:bg-accent text-foreground'
          }`}
      >
        <Clock className="h-4 w-4" />
        Рабочие часы
      </Button>

      <Button
        variant={isActive(ROUTES.ADMIN.ADDRESSES.LIST) ? 'default' : 'ghost'}
        onClick={() => navigate(`${ROUTES.ADMIN.ADDRESSES.LIST}`)}
        className={`justify-start gap-2 rounded-lg ${isActive(ROUTES.ADMIN.ADDRESSES.LIST)
          ? 'bg-secondary hover:bg-secondary text-foreground'
          : 'hover:bg-accent text-foreground'
          }`}
      >
        <MapPin className="h-4 w-4" />
        Адреса
      </Button>
    </nav>
  )
} 