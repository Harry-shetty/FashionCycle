import { createBrowserRouter, type RouteObject } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../components/shared/ProtectedRoute";

import LandingPage from "../pages/Landing";
import HomePage from "../pages/Home";
import ShopPage from "../pages/Shop";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import ProfilePage from "../pages/Profile";
import ListingsPage from "../pages/Listings";
import OrdersPage from "../pages/Orders";
import MessagesPage from "../pages/Messages";
import ImpactPage from "../pages/Impact";
import NotFoundPage from "../pages/NotFound";

const routes: RouteObject[] = [
  {
    // Public shell — Navbar + Footer visible to everyone
    element: <RootLayout />,
    children: [
      // ① Default page: shown first to every visitor
      { index: true, element: <LandingPage /> },
      { path: "shop", element: <ShopPage /> },
      {
        // Authenticated home dashboard
        path: "home",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "listings",
        element: (
          <ProtectedRoute>
            <ListingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "messages",
        element: (
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "impact",
        element: (
          <ProtectedRoute>
            <ImpactPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    // Authenticated home dashboard (has its own sidebar/topbar)
    path: "home",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    // Auth pages — minimal chrome, no Navbar
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];

export const router = createBrowserRouter(routes);
