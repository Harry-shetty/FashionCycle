import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null; // ProtectedRoute handles the redirect

  const stats = [
    { label: "Items Sold", value: user.itemsSold },
    { label: "CO₂ Saved (kg)", value: user.co2Saved.toFixed(1) },
  ];

  return (
    <section style={{ minHeight: "100vh", padding: "4rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Profile header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            marginBottom: "3rem",
            padding: "2.5rem",
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "24px",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.75rem",
              color: "#0a0a08",
              flexShrink: 0,
            }}
          >
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                marginBottom: "0.25rem",
              }}
            >
              {user.name}
            </h1>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--muted)",
                letterSpacing: "0.04em",
              }}
            >
              {user.email}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "2rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  color: "var(--accent)",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "var(--muted)",
                  letterSpacing: "0.05em",
                  marginTop: "0.5rem",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link
            to="/shop"
            style={{
              background: "var(--accent)",
              color: "#0a0a08",
              border: "none",
              padding: "0.85rem 2rem",
              borderRadius: "100px",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              textDecoration: "none",
              display: "inline-block",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Browse Shop
          </Link>
          <button
            onClick={logout}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--fg)",
              padding: "0.85rem 2rem",
              borderRadius: "100px",
              fontSize: "0.95rem",
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
        </div>
      </div>
    </section>
  );
}
