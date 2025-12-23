import { AdminLayout } from "@/core/components/layout/AdminLayout";
import { OrdersPage } from "@/pages/orders";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { createBrowserRouter } from "react-router-dom";
import { AdminPage } from "@/pages/admins";
import { CreateAdminPage } from "@/pages/create-admin";
import { EditAdminPage } from "@/pages/edit-admin";
import { UsersPage } from "@/pages/users";
import { CreateCurrierPage } from "@/pages/create-currier";
import { EditUserPage } from "@/pages/edit-user";
import { OrderDetailsPage } from "@/pages/order-details";
import { SubscriptionPlansPage } from "@/pages/subscription-plans";
import { ProtectedRoute } from "./ProtectedRoute";
import { LocationsPage } from "@/pages/locations";
import { CreateLocationPage } from "@/pages/create-location";
import AdTokensPage from "@/pages/ad-tokens";
import { WorkTimePage } from "@/pages/work-time";
import { AddressesPage } from "@/pages/adresses";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <OrdersPage />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "orders/:orderId",
        element: <OrderDetailsPage />,
      },
      {
        path: "admin",
        element: <AdminPage />,
      },
      {
        path: "admin/:id/edit",
        element: <EditAdminPage />,
      },
      {
        path: "create-admin",
        element: <CreateAdminPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "users/:id/edit",
        element: <EditUserPage />,
      },
      {
        path: "create-currier",
        element: <CreateCurrierPage />,
      },
      {
        path: "subscription-plans",
        element: <SubscriptionPlansPage />,
      },
      {
        path: "locations",
        element: <LocationsPage />,
      },
      {
        path: "create-location",
        element: <CreateLocationPage />,
      },
      {
        path: "ad-tokens",
        element: <AdTokensPage />,
      },
      {
        path: "work-time",
        element: <WorkTimePage />,
      },
      {
        path: "addresses",
        element: <AddressesPage />,
      },
    ],
  },
]);
