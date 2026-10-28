import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useStore } from "../../contexts/StoreContext";
import { apiRequest } from "../../services/api";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const {
    impact,
    listings,
    orders,
    openNewListingModal,
    showToast,
    collectionsStatus,
    fetchCollectionsStatus,
    deleteCollection,
    createOrSeedCollection,
    wipeAllCollections,
    seedAllCollections,
    isMongoConnected,
  } = useStore();
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isDbLoading, setIsDbLoading] = useState(false);

  useEffect(() => {
    fetchCollectionsStatus();
  }, []);

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

  function handleLogout() {
    logout();
    showToast("Signed out successfully. See you soon! 🌿", "info");
    navigate("/");
  }

  const savedAppraisals = chatHistory.filter((m) => m.sender === "bot" && m.details?.topAction);

  const stats = [
    { label: "Active Listings", value: listings.filter((l) => !l.sold).length },
    { label: "Orders Tracked", value: orders.length },
    { label: "AI Appraisals", value: savedAppraisals.length },
    { label: "CO₂ Saved (kg)", value: impact.co2.toFixed(1) },
  ];

  return (
    <section className="section-pad" style={{ minHeight: "100vh", padding: "4rem 2rem 6rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: "840px", margin: "0 auto" }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
              <span style={{ color: "var(--accent)", fontSize: "1.1rem" }}>✓</span>
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
              {currentUser.email} · Verified Circular Member
            </div>
          </div>

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
            { label: "My Listings", desc: `${listings.length} pieces managed`, href: "/listings" },
            { label: "Orders & Shipments", desc: `${orders.length} active orders`, href: "/orders" },
            { label: "Sustainability Report", desc: `${impact.co2.toFixed(1)} kg CO₂ avoided`, href: "/impact" },
            {
              label: "CycleBot AI History",
              desc: `${chatHistory.length} messages in MongoDB`,
              isAction: true,
              onClick: () => window.dispatchEvent(new CustomEvent("open-cyclebot", { detail: { tab: "history" } })),
            },
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

        {/* CycleBot AI History Section */}
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

        {/* MongoDB Collections & Database Control */}
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
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.08em" }}>
                  🍃 MONGODB DATABASE CONTROL
                </span>
                <span
                  style={{
                    background: isMongoConnected ? "rgba(138,223,122,0.15)" : "rgba(239,68,68,0.15)",
                    color: isMongoConnected ? "var(--accent)" : "#ef4444",
                    border: `1px solid ${isMongoConnected ? "rgba(138,223,122,0.3)" : "rgba(239,68,68,0.3)"}`,
                    padding: "2px 8px",
                    borderRadius: "100px",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {isMongoConnected ? "LIVE CONNECTED" : "OFFLINE / LOCAL"}
                </span>
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                Manage Collections & Data
              </h2>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                disabled={isDbLoading}
                onClick={async () => {
                  setIsDbLoading(true);
                  await seedAllCollections();
                  setIsDbLoading(false);
                }}
                style={{
                  background: "rgba(138,223,122,0.14)",
                  border: "1px solid rgba(138,223,122,0.3)",
                  color: "var(--accent)",
                  borderRadius: "100px",
                  padding: "0.5rem 1rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                🌱 Seed All Collections
              </button>

              <button
                disabled={isDbLoading}
                onClick={async () => {
                  if (window.confirm("Are you sure you want to drop all MongoDB collections? This resets the database to a clean slate.")) {
                    setIsDbLoading(true);
                    await wipeAllCollections();
                    setIsDbLoading(false);
                  }
                }}
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#ef4444",
                  borderRadius: "100px",
                  padding: "0.5rem 1rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🗑️ Wipe All Collections
              </button>

              <button
                onClick={fetchCollectionsStatus}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)",
                  color: "var(--fg)",
                  borderRadius: "100px",
                  padding: "0.5rem 0.85rem",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                }}
                title="Refresh collection counts"
              >
                ↻ Refresh
              </button>
            </div>
          </div>

          {/* Grid of collections */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              { id: "listings", label: "Listings", desc: "Garments in marketplace", icon: "🏷️", defaultCount: listings.length },
              { id: "orders", label: "Orders", desc: "Eco deliveries & shipments", icon: "📦", defaultCount: orders.length },
              { id: "chatmessages", label: "Chat Messages", desc: "CycleBot AI conversation turns", icon: "💬", defaultCount: chatHistory.length },
              { id: "conversations", label: "Conversations", desc: "Buyer & seller inbox chats", icon: "🤝", defaultCount: 3 },
              { id: "saveditems", label: "Saved Items", desc: "Wishlist products", icon: "❤️", defaultCount: 2 },
              { id: "impacts", label: "Impact Tracker", desc: "CO₂ & water conservation stats", icon: "🌿", defaultCount: 1 },
              { id: "notifications", label: "Notifications", desc: "Live system alerts", icon: "🔔", defaultCount: 4 },
              { id: "leaderboards", label: "Leaderboards", desc: "Rankings & circular scores", icon: "🏆", defaultCount: 18 },
              { id: "communityposts", label: "Community", desc: "Voices & testimonials", icon: "👥", defaultCount: 3 },
              { id: "newsletters", label: "Newsletter", desc: "Subscriber emails", icon: "📬", defaultCount: 1 },
            ].map((col) => {
              const liveStat = collectionsStatus.find((s) => s.name === col.id);
              const count = liveStat ? liveStat.count : col.defaultCount;

              return (
                <div
                  key={col.id}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "1.15rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "1.1rem" }}>{col.icon}</span>
                        <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.92rem", color: "var(--fg)" }}>
                          {col.label}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.68rem",
                          background: count > 0 ? "rgba(138,223,122,0.12)" : "rgba(255,255,255,0.06)",
                          color: count > 0 ? "var(--accent)" : "var(--muted)",
                          padding: "2px 6px",
                          borderRadius: "6px",
                          fontWeight: 700,
                        }}
                      >
                        {count} docs
                      </span>
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)" }}>
                      db.{col.id} · {col.desc}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "6px", marginTop: "auto" }}>
                    <button
                      onClick={() => createOrSeedCollection(col.id)}
                      style={{
                        flex: 1,
                        background: "rgba(138,223,122,0.08)",
                        border: "1px solid rgba(138,223,122,0.25)",
                        color: "var(--accent)",
                        padding: "5px 8px",
                        borderRadius: "8px",
                        fontSize: "0.68rem",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--accent)";
                        e.currentTarget.style.color = "#0a0a08";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(138,223,122,0.08)";
                        e.currentTarget.style.color = "var(--accent)";
                      }}
                    >
                      + Seed / Create
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete collection "${col.id}" from MongoDB?`)) {
                          deleteCollection(col.id);
                        }
                      }}
                      style={{
                        flex: 1,
                        background: "rgba(239,68,68,0.06)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        color: "#ef4444",
                        padding: "5px 8px",
                        borderRadius: "8px",
                        fontSize: "0.68rem",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#ef4444";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(239,68,68,0.06)";
                        e.currentTarget.style.color = "#ef4444";
                      }}
                    >
                      ✕ Drop Collection
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
            Browse Marketplace
          </Link>
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
