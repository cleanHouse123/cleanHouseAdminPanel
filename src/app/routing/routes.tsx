import { AdminLayout } from "@/core/components/layout/AdminLayout";
import { OrdersPage } from "@/pages/orders";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { createBrowserRouter } from "react-router-dom";
import { AdminPage } from "@/pages/admins";
import { CreateAdminPage } from "@/pages/create-admin";
import { UsersPage } from "@/pages/users";
import { CreateCurrierPage } from "@/pages/create-currier";
import { OrderDetailsPage } from "@/pages/order-details";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
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
        path: "create-admin",
        element: <CreateAdminPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "create-currier",
        element: <CreateCurrierPage />,
      },
    ],
  },
]);
