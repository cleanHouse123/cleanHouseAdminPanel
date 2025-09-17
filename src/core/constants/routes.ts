export const ROUTES = {
  ADMIN: {
    LOGIN: "/login",
    REGISTER: "/register",
    ORDERS: {
      LIST: "/admin/orders",
      CREATE: "/admin/orders/create",
      DETAILS: (id: string) => `/admin/orders/${id}`,
      EDIT: (id: string) => `/admin/orders/${id}/edit`,
    },
    ADMIN: {
      LIST: "/admin/admin",
    },
    USERS: {
      LIST: "/admin/users",
    },
    SUBSCRIPTION_PLANS: {
      LIST: "/admin/subscription-plans",
    },
  },
} as const;
