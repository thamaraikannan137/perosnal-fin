import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { CounterPage } from "../pages/CounterPage";
import { ThemeExamplePage } from "../pages/ThemeExamplePage";

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
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "counter",
        element: <CounterPage />,
      },
      {
        path: "theme-example",
        element: <ThemeExamplePage />,
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
