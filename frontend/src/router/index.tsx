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
import CommunityPage from "../pages/Community";
import ProductDetailPage from "../pages/ProductDetail";
import WishlistPage from "../pages/Wishlist";
import PaymentPage from "../pages/Payment";
import NotFoundPage from "../pages/NotFound";

const routes: RouteObject[] = [
  {
    // Public shell — Marquee + Navbar + Footer visible
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "shop", element: <ShopPage /> },
      { path: "product/:id", element: <ProductDetailPage /> },
      { path: "payment", element: <PaymentPage /> },
      { path: "checkout", element: <PaymentPage /> },
      { path: "wishlist", element: <WishlistPage /> },
      { path: "impact", element: <ImpactPage /> },
      { path: "community", element: <CommunityPage /> },
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
          <ProtectedRoute allowedRoles={["seller"]}>
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
