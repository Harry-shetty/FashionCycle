import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useStore } from "../../contexts/StoreContext";
import { apiRequest } from "../../services/api";
import BackButton from "../../components/shared/BackButton";

export default function ProfilePage() {
  const { user, role, isSeller, isBuyer, switchRole, logout } = useAuth();
  const {
    impact,
    listings,
    orders,
    openNewListingModal,
    showToast,
  } = useStore();
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const currentUser = user || {
    name: "Sophia Laurent",
    email: "sophia@fashioncycle.eco",
  };

  useEffect(() => {
    const email = currentUser.email || "default-user";
    apiRequest<any[]>(`/chatbot/history?userId=${encodeURIComponent(email)}`)
      .then((res) => {
        if (Array.isArray(res)) setChatHistory(res);
      })
      .catch(() => {
        const local = localStorage.getItem(`fc_chat_${email}`);
        if (local) {
          try {
            setChatHistory(JSON.parse(local));
          } catch {}
        }
      });
  }, [currentUser.email]);

  async function handleLogout() {
    await logout();
    showToast("Signed out successfully. See you soon! 🌿", "info");
    navigate("/");
  }

  const savedAppraisals = chatHistory.filter((m) => m.sender === "bot" && m.details?.topAction);

  const stats = [
    ...(isSeller ? [{ label: "Active Listings", value: listings.filter((l) => !l.sold).length }] : []),
    { label: "Orders Tracked", value: orders.length },
    ...(isBuyer ? [{ label: "AI Appraisals", value: savedAppraisals.length }] : []),
    { label: "CO₂ Saved (kg)", value: impact.co2.toFixed(1) },
  ];

  return (
    <section className="section-pad" style={{ minHeight: "100vh", padding: "4rem 2rem 6rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: "840px", margin: "0 auto" }}>
        {/* Top Back Navigation */}
        <div style={{ marginBottom: "2rem" }}>
          <BackButton fallback="/home" label="Back to Home" />
        </div>

        {/* Profile header */}
        <div
          className="reveal"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            marginBottom: "2.5rem",
            padding: "2.5rem",
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "1.85rem",
              color: "#0a0a08",
              flexShrink: 0,
            }}
          >
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                {currentUser.name}
              </h1>
              <span
                style={{
                  background: isSeller ? "rgba(234, 179, 8, 0.15)" : "rgba(138, 223, 122, 0.15)",
                  border: `1px solid ${isSeller ? "rgba(234, 179, 8, 0.4)" : "rgba(138, 223, 122, 0.4)"}`,
                  color: isSeller ? "#facc15" : "var(--accent)",
                  padding: "0.2rem 0.75rem",
                  borderRadius: "100px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}
              >
                {isSeller ? "🏷️ VERIFIED SELLER" : "🛍️ CIRCULAR BUYER"}
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--muted)",
                letterSpacing: "0.04em",
                marginTop: "0.25rem",
              }}
            >
              {currentUser.email} · {isSeller ? "Wardrobe Circulation Merchant" : "Sustainable Fashion Connoisseur"}
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {isSeller ? (
              <button
                onClick={openNewListingModal}
                style={{
                  background: "var(--accent)",
                  color: "#0a0a08",
                  border: "none",
                  padding: "0.75rem 1.6rem",
                  borderRadius: "100px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                + List a Piece
              </button>
            ) : (
              <button
                onClick={() => navigate("/shop")}
                style={{
                  background: "var(--accent)",
                  color: "#0a0a08",
                  border: "none",
                  padding: "0.75rem 1.6rem",
                  borderRadius: "100px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                🛍️ Browse Market
              </button>
            )}
          </div>
        </div>

        {/* Live Profile Stats */}
        <div
          className="stats-grid-4"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          {stats.map((s, idx) => (
            <div
              key={s.label}
              className="reveal-scale"
              data-delay={idx * 60}
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "18px",
                padding: "1.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
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
                  fontSize: "0.68rem",
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

        {/* Role & Permissions Controller */}
        <div
          style={{
            background: isSeller ? "rgba(234, 179, 8, 0.05)" : "rgba(138, 223, 122, 0.05)",
            border: `1px solid ${isSeller ? "rgba(234, 179, 8, 0.25)" : "rgba(138, 223, 122, 0.25)"}`,
            borderRadius: "20px",
            padding: "1.75rem 2rem",
            marginBottom: "2.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: isSeller ? "#facc15" : "var(--accent)",
                letterSpacing: "0.08em",
                marginBottom: "0.4rem",
                fontWeight: 700,
              }}
            >
              ACTIVE ROLE-BASED ACCESS CONTROL (RBAC)
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "var(--fg)",
                marginBottom: "0.5rem",
              }}
            >
              {isSeller ? "🏷️ Seller Portal Active" : "🛍️ Buyer Interface Active"}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.88rem",
                color: "var(--muted)",
                lineHeight: 1.5,
                maxWidth: "680px",
                margin: 0,
              }}
            >
              {isSeller
                ? "As a Seller, you have exclusive access to list new pieces into MongoDB Atlas, update pricing, manage inventory status (relist/mark sold), and monitor revenue. Buying pieces is handled by buyer accounts."
                : "As a Buyer, you can explore sustainable pieces, checkout instantly with Indian Rupee (₹) pricing, track shipment steps, save wishlist favorites, and monitor your personal eco impact."}
            </p>
          </div>
        </div>

        {/* Navigation Shortcuts */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            padding: "1.5rem 2rem",
            marginBottom: "2.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            ...(isSeller ? [{ label: "My Listings", desc: `${listings.length} pieces managed`, href: "/listings" }] : []),
            { label: "Orders & Shipments", desc: `${orders.length} active orders`, href: "/orders" },
            { label: "Sustainability Report", desc: `${impact.co2.toFixed(1)} kg CO₂ avoided`, href: "/impact" },
            ...(isBuyer
              ? [
                  {
                    label: "CycleBot AI History",
                    desc: `${chatHistory.length} messages in MongoDB`,
                    isAction: true,
                    onClick: () => window.dispatchEvent(new CustomEvent("open-cyclebot", { detail: { tab: "history" } })),
                  },
                ]
              : []),
          ].map((item) =>
            "isAction" in item && item.isAction ? (
              <div
                key={item.label}
                onClick={item.onClick}
                style={{
                  background: "rgba(138,223,122,0.06)",
                  border: "1px solid rgba(138,223,122,0.25)",
                  borderRadius: "14px",
                  padding: "1.25rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(138,223,122,0.25)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--accent)" }}>
                  {item.label} 📜 →
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", marginTop: "4px" }}>
                  {item.desc}
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.href!}
                style={{
                  textDecoration: "none",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "1.25rem",
                  display: "block",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "var(--fg)" }}>
                  {item.label} →
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", marginTop: "4px" }}>
                  {item.desc}
                </div>
              </Link>
            )
          )}
        </div>

        {/* CycleBot AI History Section (Buyers only) */}
        {isBuyer && (
          <div
            style={{
              background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "2rem",
            marginBottom: "2.5rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.08em", marginBottom: "4px" }}>
                🍃 MONGODB PERSISTENCE
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                Saved CycleBot Garment Appraisals
              </h2>
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-cyclebot", { detail: { tab: "history" } }))}
              style={{
                background: "rgba(138,223,122,0.14)",
                border: "1px solid rgba(138,223,122,0.3)",
                color: "var(--accent)",
                borderRadius: "100px",
                padding: "0.5rem 1.25rem",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.color = "#0a0a08";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(138,223,122,0.14)";
                e.currentTarget.style.color = "var(--accent)";
              }}
            >
              <span>📜 Open History Explorer</span>
              <span>→</span>
            </button>
          </div>

          {savedAppraisals.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2.5rem 1.5rem",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "16px",
                border: "1px dashed var(--border)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👗</div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--fg)", margin: "0 0 6px" }}>
                No garment appraisals saved yet
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--muted)", margin: "0 0 16px", maxWidth: 400, marginInline: "auto" }}>
                Upload photos of your clothes in CycleBot to see probability percentages for selling, repairing, or donating. All analyses are automatically archived in MongoDB!
              </p>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-cyclebot", { detail: { tab: "chat" } }))}
                style={{
                  background: "var(--accent)",
                  color: "#0a0a08",
                  border: "none",
                  borderRadius: "100px",
                  padding: "0.6rem 1.4rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Appraise a Garment with AI →
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
              {savedAppraisals.slice(0, 4).map((appraisal, idx) => {
                const top = appraisal.details?.topAction;
                const value = appraisal.details?.estimatedValue;
                const co2 = appraisal.details?.co2Saved;
                return (
                  <div
                    key={appraisal.id || idx}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--border)",
                      borderRadius: "16px",
                      padding: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)" }}>
                          🕒 {appraisal.timestamp}
                        </span>
                        {top && (
                          <span
                            style={{
                              background: "rgba(138,223,122,0.15)",
                              color: "var(--accent)",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              borderRadius: "100px",
                              padding: "2px 8px",
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            {top.icon} {top.action} ({top.percentage}%)
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--fg)", fontWeight: 600, margin: "0 0 10px", lineHeight: 1.4 }}>
                        {top?.reason || "Garment Circular Evaluation"}
                      </p>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                        {value && (
                          <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--accent2)" }}>
                            💰 {value}
                          </span>
                        )}
                        {co2 && (
                          <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
                            🌱 {co2}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent("open-cyclebot", { detail: { tab: "history" } }))}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--border)",
                        color: "var(--fg)",
                        borderRadius: "100px",
                        padding: "6px 12px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "center",
                        transition: "all 0.2s",
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
                      View in CycleBot →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {isSeller ? (
            <Link
              to="/listings"
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
              Manage Inventory
            </Link>
          ) : (
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
              Browse Marketplace
            </Link>
          )}
          <button
            onClick={handleLogout}
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
