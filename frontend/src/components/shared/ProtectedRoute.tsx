import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import CircularLoader from "./CircularLoader";
import type { UserRole } from "../../types/user.types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * Wraps protected routes — redirects to /login if not authenticated.
 * Enforces role-based access control (RBAC) when allowedRoles is specified.
 */
export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isAuthReady, role, switchRole } = useAuth();
  const navigate = useNavigate();

  if (!isAuthReady || isLoading) {
    return (
      <CircularLoader
        fullScreen
        size={84}
        message="Authenticating Circular Access…"
        subtext="Verifying secure credentials & role permissions"
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const requiredRole = allowedRoles[0];
    const isSellerRequired = requiredRole === "seller";

    return (
      <section
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "var(--bg)",
        }}
      >
        <div
          style={{
            maxWidth: "520px",
            width: "100%",
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "3rem 2.5rem",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: isSellerRequired ? "rgba(234, 179, 8, 0.12)" : "rgba(138, 223, 122, 0.12)",
              border: `1px solid ${isSellerRequired ? "rgba(234, 179, 8, 0.3)" : "rgba(138, 223, 122, 0.3)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 1.5rem",
            }}
          >
            {isSellerRequired ? "🏷️" : "🛍️"}
          </div>

          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: isSellerRequired ? "#facc15" : "var(--accent)",
              letterSpacing: "0.1em",
              marginBottom: "0.5rem",
            }}
          >
            ROLE RESTRICTION · {isSellerRequired ? "SELLER ACCESS ONLY" : "BUYER ACCESS ONLY"}
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
              color: "var(--fg)",
            }}
          >
            {isSellerRequired ? "Seller Dashboard & Inventory" : "Buyer Exclusive Portal"}
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.92rem",
              color: "var(--muted)",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            {isSellerRequired
              ? "You are currently browsing with a Buyer profile. Listing items, adjusting pricing, and managing inventory require Seller permissions."
              : "You are currently in Seller mode. Tracking personal purchases and buyer rewards requires a Buyer profile."}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <button
              onClick={() => navigate("/login")}
              style={{
                width: "100%",
                background: "var(--accent)",
                color: "#0a0a08",
                border: "none",
                borderRadius: "100px",
                padding: "0.85rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Sign in with {isSellerRequired ? "Seller Account (admin@gmail.com)" : "Buyer Account"}
            </button>

            <button
              onClick={() => navigate("/home")}
              style={{
                width: "100%",
                background: "transparent",
                color: "var(--muted)",
                border: "1px solid var(--border)",
                borderRadius: "100px",
                padding: "0.8rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Return to Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}

