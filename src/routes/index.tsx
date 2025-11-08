import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { HomePage } from "../pages/HomePage";

import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";

import { AssetsPage } from "../pages/AssetsPage";
import { AssetDetailPage } from "../pages/AssetDetailPage";
import { LiabilitiesPage } from "../pages/LiabilitiesPage";
import { LiabilityDetailPage } from "../pages/LiabilityDetailPage";
import { SettingsPage } from "../pages/SettingsPage";

const router = createBrowserRouter([
  {
    // Routes with MainLayout
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "assets",
        element: <AssetsPage />,
      },
      {
        path: "assets/:id",
        element: <AssetDetailPage />,
      },
      {
        path: "liabilities",
        element: <LiabilitiesPage />,
      },
      {
        path: "liabilities/:id",
        element: <LiabilityDetailPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    // Routes without layout (standalone pages)
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  // Add more routes here
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
