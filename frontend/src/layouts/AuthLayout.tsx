import { Link, Outlet } from "react-router-dom";
import FashionCycleLogo from "../components/shared/FashionCycleLogo";
import ToastContainer from "../components/shared/ToastContainer";
import ScrollToTop from "../components/shared/ScrollToTop";
import BackButton from "../components/shared/BackButton";

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
        position: "relative",
      }}
    >
      <ScrollToTop />

      {/* Top Left Back Navigation */}
      <div style={{ position: "absolute", top: "1.75rem", left: "1.75rem" }}>
        <BackButton fallback="/" label="Back to Site" />
      </div>

      {/* Logo */}
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          textDecoration: "none",
          marginBottom: "2.5rem",
        }}
      >
        <FashionCycleLogo size={16} />
      </Link>

      {/* Page content (Login / Register form) */}
      <Outlet />
      <ToastContainer />
    </div>
  );
}
