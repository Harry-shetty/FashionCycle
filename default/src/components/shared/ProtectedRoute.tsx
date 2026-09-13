import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/**
 * Wraps protected routes — redirects to /login if not authenticated.
 * Shows a brief loading state while auth initialises to avoid flash-redirect.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          color: "var(--muted)",
          letterSpacing: "0.08em",
        }}
      >
        LOADING…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }

  return <>{children}</>;
}
