import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom";

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
import LeaderboardPage from "../pages/Leaderboard";
import ImpactPage from "../pages/Impact";
import NotFoundPage from "../pages/NotFound";

const routes: RouteObject[] = [
  {
    // Public shell — Marquee + Navbar + Footer visible
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "shop", element: <ShopPage /> },
      { path: "impact", element: <ImpactPage /> },
      {
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
        path: "leaderboard",
        element: (
          <ProtectedRoute>
            <LeaderboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "messages",
        element: <Navigate to="/leaderboard" replace />,
      },
    ],
  },
  {
    // Auth pages — clean layout
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];

export const router = createBrowserRouter(routes);
