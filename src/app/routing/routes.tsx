import { AdminLayout } from "@/core/components/layout/AdminLayout";
import { OrdersPage } from "@/pages/orders";
import { HomePage } from "@/pages/home";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { createBrowserRouter } from "react-router-dom";
import { AdminPage } from "@/pages/admins";
import { CreateAdminPage } from "@/pages/create-admin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
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
    element: <AdminLayout />,
    children: [
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "admin",
        element: <AdminPage />,
      },
      {
        path: "create-admin",
        element: <CreateAdminPage />,
      },
    ],
  },
]);
