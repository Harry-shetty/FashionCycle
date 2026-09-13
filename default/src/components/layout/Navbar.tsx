import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { BANNER_HEIGHT, NAVBAR_HEIGHT } from "../../utils/layoutConstants";

const PUBLIC_LINKS = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Shop", href: "/register" },
  { label: "Impact", href: "/#impact" },
  { label: "Community", href: "/#community" },
];

const AUTH_LINKS = [
  { label: "Home", href: "/home" },
  { label: "Shop", href: "/shop" },
  { label: "My Listings", href: "/listings" },
  { label: "Orders", href: "/orders" },
  { label: "Messages", href: "/messages" },
  { label: "My Impact", href: "/impact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav
      style={{
        position: "fixed",
        top: BANNER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 2rem",
        height: `${NAVBAR_HEIGHT}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(10,10,8,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
        transition: "background 0.5s ease, border-color 0.5s ease",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse-green 3s ease infinite",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 4V2M12 22v-2M4 12H2M22 12h-2M6.34 6.34 4.93 4.93M19.07 19.07l-1.41-1.41M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
              stroke="#0a0a08"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="4" fill="#0a0a08" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.35rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--fg)",
          }}
        >
          Fashion<span style={{ color: "var(--accent)" }}>Cycle</span>
        </span>
      </Link>

      {/* Desktop nav links */}
      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
        {(isAuthenticated ? AUTH_LINKS : PUBLIC_LINKS).map((item) => (
          <Link
            key={item.label}
            to={item.href}
            style={{
              color: "var(--muted)",
              textDecoration: "none",
              fontSize: "0.875rem",
              letterSpacing: "0.02em",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--muted)")
            }
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Auth actions */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {isAuthenticated ? (
          <>
            <Link
              to="/profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: "#0a0a08",
                }}
              >
                {user?.name.slice(0, 2).toUpperCase()}
              </div>
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--fg)",
                padding: "0.5rem 1.25rem",
                borderRadius: "100px",
                fontSize: "0.875rem",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "border-color 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ef4444";
                e.currentTarget.style.color = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--fg)";
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--fg)",
                padding: "0.5rem 1.25rem",
                borderRadius: "100px",
                fontSize: "0.875rem",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                textDecoration: "none",
                transition: "border-color 0.2s ease, color 0.2s ease",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--fg)";
              }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              style={{
                background: "var(--accent)",
                border: "none",
                color: "#0a0a08",
                padding: "0.55rem 1.35rem",
                borderRadius: "100px",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                textDecoration: "none",
                transition: "transform 0.2s ease, background 0.2s ease",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.background = "var(--accent2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "var(--accent)";
              }}
            >
              List a Piece
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
