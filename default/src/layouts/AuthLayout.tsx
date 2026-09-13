import { Link, Outlet } from "react-router-dom";

/**
 * Minimal centered layout for Login / Register pages.
 * No Navbar or Footer — keeps auth pages clean and focused.
 */
export default function AuthLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "2rem",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
          marginBottom: "2.5rem",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
          }}
        >
          ♻
        </div>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--fg)",
          }}
        >
          Fashion<span style={{ color: "var(--accent)" }}>Cycle</span>
        </span>
      </Link>

      {/* Page content (Login / Register form) */}
      <Outlet />
    </div>
  );
}
