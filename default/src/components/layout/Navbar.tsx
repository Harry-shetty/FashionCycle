import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useStore } from "../../contexts/StoreContext";
import FashionCycleLogo from "../shared/FashionCycleLogo";
import { BANNER_HEIGHT, NAVBAR_HEIGHT } from "../../utils/layoutConstants";

const PUBLIC_LINKS = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Shop", href: "/shop" },
  { label: "Impact", href: "/impact" },
  { label: "Community", href: "/#community" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { openNewListingModal, showToast } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const authLinks = [
    { label: "Home", href: "/home" },
    { label: "Shop", href: "/shop" },
    { label: "My Listings", href: "/listings" },
    { label: "Orders", href: "/orders" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "My Impact", href: "/impact" },
  ];

  const isItemActive = (href: string) => {
    if (location.pathname === href) return true;
    if ((href === "/home" || href === "/") && (location.pathname === "/" || location.pathname === "/home")) {
      return true;
    }
    if (href !== "/" && href !== "/home" && !href.startsWith("/#") && location.pathname.startsWith(href)) {
      return true;
    }
    if (href.startsWith("/#") && location.pathname === "/" && location.hash === href.replace("/", "")) {
      return true;
    }
    return false;
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLogout() {
    logout();
    showToast("Signed out successfully. See you soon! 🌿", "info");
    setMobileMenuOpen(false);
    navigate("/");
  }

  function handleListPieceClick() {
    setMobileMenuOpen(false);
    if (isAuthenticated) {
      openNewListingModal();
    } else {
      showToast("Please sign in or use Demo Login to list your pieces!", "info");
      navigate("/login");
    }
  }

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: BANNER_HEIGHT,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 clamp(1rem, 3vw, 2rem)",
          height: `${NAVBAR_HEIGHT}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled || mobileMenuOpen ? "rgba(10,10,8,0.96)" : "rgba(10,10,8,0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: scrolled || mobileMenuOpen
            ? "1px solid var(--border)"
            : "1px solid rgba(255,255,255,0.06)",
          boxShadow: scrolled ? "0 10px 30px -5px rgba(0,0,0,0.6)" : "none",
          transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
        >
          <FashionCycleLogo size={12} />
        </Link>

        {/* Desktop nav links */}
        <div className="desktop-nav-links" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {(isAuthenticated ? authLinks : PUBLIC_LINKS).map((item) => {
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.label}
                to={item.href}
                style={{
                  color: active ? "var(--accent)" : "var(--muted)",
                  background: active ? "rgba(138,223,122,0.12)" : "transparent",
                  border: active ? "1px solid rgba(138,223,122,0.3)" : "1px solid transparent",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "100px",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  letterSpacing: "0.02em",
                  fontFamily: "var(--font-body)",
                  fontWeight: active ? 700 : 500,
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  boxShadow: active ? "0 0 14px rgba(138,223,122,0.18)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "var(--fg)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  } else {
                    e.currentTarget.style.background = "rgba(138,223,122,0.18)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "var(--muted)";
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                  } else {
                    e.currentTarget.style.color = "var(--accent)";
                    e.currentTarget.style.background = "rgba(138,223,122,0.12)";
                    e.currentTarget.style.borderColor = "rgba(138,223,122,0.3)";
                  }
                }}
              >
                {active && (
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "inline-block",
                      boxShadow: "0 0 8px var(--accent)",
                      animation: "pulse-green 1.5s infinite alternate",
                    }}
                  />
                )}
                {item.label}
                {"badge" in item && Boolean(item.badge) && (
                  <span
                    style={{
                      background: "var(--accent)",
                      color: "#0a0a08",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      borderRadius: "100px",
                      padding: "1px 6px",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {String(item.badge)}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth actions */}
        <div className="desktop-nav-links" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {isAuthenticated ? (
            <>
              <button
                onClick={openNewListingModal}
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
                  transition: "transform 0.2s ease, background 0.2s ease",
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
                + List a Piece
              </button>

              <Link
                to="/profile"
                title="Your Profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  textDecoration: "none",
                  padding: "3px",
                  borderRadius: "50%",
                  outline: isItemActive("/profile") ? "2px solid var(--accent)" : "2px solid transparent",
                  outlineOffset: "2px",
                  boxShadow: isItemActive("/profile") ? "0 0 14px rgba(138,223,122,0.5)" : "none",
                  transition: "all 0.2s ease",
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
              <button
                onClick={handleListPieceClick}
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
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen((o) => !o)}
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            width: "42px",
            height: "42px",
            color: "var(--fg)",
            fontSize: "1.25rem",
            cursor: "pointer",
          }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: BANNER_HEIGHT + NAVBAR_HEIGHT,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(10,10,8,0.98)",
            backdropFilter: "blur(24px)",
            zIndex: 99,
            display: "flex",
            flexDirection: "column",
            padding: "2rem 1.5rem",
            overflowY: "auto",
            animation: "fadeIn 0.2s ease both",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
            {(isAuthenticated ? authLinks : PUBLIC_LINKS).map((item) => {
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    fontWeight: active ? 800 : 600,
                    color: active ? "var(--accent)" : "var(--fg)",
                    background: active ? "rgba(138,223,122,0.12)" : "transparent",
                    textDecoration: "none",
                    padding: "0.75rem 1rem",
                    borderRadius: "14px",
                    border: active ? "1px solid rgba(138,223,122,0.3)" : "1px solid transparent",
                    borderBottom: !active ? "1px solid rgba(255,255,255,0.05)" : undefined,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    {active && (
                      <span
                        style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: "var(--accent)",
                          boxShadow: "0 0 8px var(--accent)",
                        }}
                      />
                    )}
                    {item.label}
                  </span>
                  {active ? (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.68rem",
                        letterSpacing: "0.08em",
                        color: "var(--accent)",
                        background: "rgba(138,223,122,0.16)",
                        padding: "2px 8px",
                        borderRadius: "100px",
                        fontWeight: 700,
                      }}
                    >
                      CURRENT
                    </span>
                  ) : "badge" in item && Boolean(item.badge) ? (
                    <span
                      style={{
                        background: "var(--accent)",
                        color: "#0a0a08",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        borderRadius: "100px",
                        padding: "2px 8px",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {String(item.badge)}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button
              onClick={handleListPieceClick}
              style={{
                width: "100%",
                background: "var(--accent)",
                color: "#0a0a08",
                border: "none",
                borderRadius: "100px",
                padding: "0.9rem",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              + List a Piece
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid var(--border)",
                    color: "var(--fg)",
                    borderRadius: "100px",
                    padding: "0.85rem",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  View Profile ({user?.name})
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    color: "#ef4444",
                    borderRadius: "100px",
                    padding: "0.85rem",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--fg)",
                  borderRadius: "100px",
                  padding: "0.85rem",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  textAlign: "center",
                  display: "block",
                }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
