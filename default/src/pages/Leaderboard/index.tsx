import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useStore } from "../../contexts/StoreContext";
import { apiRequest } from "../../services/api";

interface LeaderboardUser {
  rank: number;
  name: string;
  handle: string;
  avatar: string;
  city: string;
  co2Saved: number;
  itemsCycled: number;
  badge: string;
  points: number;
  isCurrentUser?: boolean;
}

const LEADERBOARD_DATA: Record<"month" | "allTime" | "local", LeaderboardUser[]> = {
  month: [
    { rank: 1, name: "Aarav Mehta", handle: "@aaravcycles", avatar: "AM", city: "Bengaluru, IN", co2Saved: 184.2, itemsCycled: 42, badge: "🌱 Eco Master", points: 4850 },
    { rank: 2, name: "Priya Sharma", handle: "@priyawears", avatar: "PS", city: "Mumbai, IN", co2Saved: 142.8, itemsCycled: 36, badge: "♻️ Zero Waste Hero", points: 3920 },
    { rank: 3, name: "Elena Rostova", handle: "@elenavintage", avatar: "ER", city: "Bengaluru, IN", co2Saved: 118.5, itemsCycled: 29, badge: "👗 Vintage Curator", points: 3150 },
    { rank: 4, name: "Harsha (You)", handle: "@harsha", avatar: "HA", city: "Bengaluru, IN", co2Saved: 48.4, itemsCycled: 12, badge: "🌿 Rising Cycler", points: 1420, isCurrentUser: true },
    { rank: 5, name: "Kavya Nair", handle: "@kavyacircles", avatar: "KN", city: "Delhi, IN", co2Saved: 44.1, itemsCycled: 11, badge: "✨ Trend Setter", points: 1310 },
    { rank: 6, name: "Rohan Varma", handle: "@rohanthrift", avatar: "RV", city: "Hyderabad, IN", co2Saved: 39.6, itemsCycled: 9, badge: "👕 Denim Saver", points: 1180 },
    { rank: 7, name: "Ananya Deshmukh", handle: "@ananyastyle", avatar: "AD", city: "Pune, IN", co2Saved: 35.2, itemsCycled: 8, badge: "🧵 Stitch Rebel", points: 990 },
    { rank: 8, name: "Dev Patel", handle: "@devvintage", avatar: "DP", city: "Bengaluru, IN", co2Saved: 31.0, itemsCycled: 7, badge: "🌟 Conscious Shopper", points: 860 },
  ],
  allTime: [
    { rank: 1, name: "Zara Chen", handle: "@zaracircular", avatar: "ZC", city: "Singapore", co2Saved: 684.5, itemsCycled: 186, badge: "👑 Planet Champion", points: 18900 },
    { rank: 2, name: "Aarav Mehta", handle: "@aaravcycles", avatar: "AM", city: "Bengaluru, IN", co2Saved: 542.0, itemsCycled: 134, badge: "🌱 Eco Master", points: 14200 },
    { rank: 3, name: "Mateo Silva", handle: "@mateothrift", avatar: "MS", city: "Lisbon, PT", co2Saved: 478.2, itemsCycled: 112, badge: "♻️ Zero Waste Legend", points: 12100 },
    { rank: 4, name: "Priya Sharma", handle: "@priyawears", avatar: "PS", city: "Mumbai, IN", co2Saved: 390.6, itemsCycled: 94, badge: "👗 Vintage Icon", points: 9800 },
    { rank: 14, name: "Harsha (You)", handle: "@harsha", avatar: "HA", city: "Bengaluru, IN", co2Saved: 148.4, itemsCycled: 34, badge: "🌿 Verified Cycler", points: 3420, isCurrentUser: true },
  ],
  local: [
    { rank: 1, name: "Aarav Mehta", handle: "@aaravcycles", avatar: "AM", city: "Bengaluru, IN", co2Saved: 184.2, itemsCycled: 42, badge: "🌱 Eco Master", points: 4850 },
    { rank: 2, name: "Elena Rostova", handle: "@elenavintage", avatar: "ER", city: "Bengaluru, IN", co2Saved: 118.5, itemsCycled: 29, badge: "👗 Vintage Curator", points: 3150 },
    { rank: 3, name: "Harsha (You)", handle: "@harsha", avatar: "HA", city: "Bengaluru, IN", co2Saved: 48.4, itemsCycled: 12, badge: "🌿 Top 3 in Bengaluru", points: 1420, isCurrentUser: true },
    { rank: 4, name: "Dev Patel", handle: "@devvintage", avatar: "DP", city: "Bengaluru, IN", co2Saved: 31.0, itemsCycled: 7, badge: "🌟 Conscious Shopper", points: 860 },
    { rank: 5, name: "Nisha Rao", handle: "@nishaloops", avatar: "NR", city: "Bengaluru, IN", co2Saved: 28.5, itemsCycled: 6, badge: "🧵 Local Thrift Hero", points: 740 },
  ],
};

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { impact } = useStore();
  const [tab, setTab] = useState<"month" | "allTime" | "local">("month");
  const [mongoData, setMongoData] = useState<Record<"month" | "allTime" | "local", LeaderboardUser[]> | null>(null);

  useEffect(() => {
    apiRequest<LeaderboardUser[]>(`/leaderboard?period=${tab}`)
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setMongoData((prev) => ({
            ...(prev || LEADERBOARD_DATA),
            [tab]: res,
          }));
        }
      })
      .catch((err) => {
        console.warn("MongoDB leaderboard fetch notice (using cached/fallback):", err);
      });
  }, [tab]);

  const list = (mongoData && mongoData[tab]) || LEADERBOARD_DATA[tab];
  const topThree = list.slice(0, 3);
  const others = list.slice(3);

  const currentUserData = list.find((u) => u.isCurrentUser) || {
    rank: 4,
    name: user?.name || "Harsha",
    handle: "@harsha",
    avatar: "HA",
    city: "Bengaluru, IN",
    co2Saved: Number(impact.co2) || 48.4,
    itemsCycled: Number(impact.items) || 12,
    badge: "🌿 Rising Cycler",
    points: 1420,
    isCurrentUser: true,
  };

  return (
    <section className="section-pad" style={{ minHeight: "100vh", padding: "4rem 2rem 6rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        {/* Header */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(138,223,122,0.1)",
              border: "1px solid rgba(138,223,122,0.25)",
              padding: "4px 14px",
              borderRadius: "100px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--accent)",
              letterSpacing: "0.08em",
              marginBottom: "1rem",
            }}
          >
            <span>🏆 COMMUNITY ECO RANKINGS</span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "0.75rem",
            }}
          >
            Circular Leaderboard
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "var(--muted)",
              maxWidth: 540,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Honoring the top fashion circulars preventing carbon emissions and diverting textiles from landfills.
          </p>

          {/* Timeframe Filter Pills */}
          <div
            className="leaderboard-filter-pill-container"
            style={{
              display: "inline-flex",
              gap: "6px",
              background: "rgba(255,255,255,0.03)",
              padding: "5px",
              borderRadius: "100px",
              border: "1px solid var(--border)",
              marginTop: "2rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { id: "month" as const, label: "This Month" },
              { id: "allTime" as const, label: "All Time" },
              { id: "local" as const, label: "Bengaluru Hub" },
            ].map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  className="leaderboard-filter-btn"
                  onClick={() => setTab(t.id)}
                  style={{
                    padding: "0.48rem 1.4rem",
                    borderRadius: "100px",
                    border: active ? "1px solid var(--accent)" : "1px solid transparent",
                    background: active ? "var(--accent)" : "transparent",
                    color: active ? "#0a0a08" : "var(--muted)",
                    fontWeight: active ? 800 : 500,
                    fontFamily: "var(--font-body)",
                    fontSize: "0.84rem",
                    cursor: "pointer",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: active ? "0 4px 18px rgba(138,223,122,0.4)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "var(--fg)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "var(--muted)";
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }
                  }}
                >
                  {active && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0a0a08" }} />}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Podium: Top 3 Visual Display */}
        <div
          className="leaderboard-podium-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem",
            alignItems: "flex-end",
          }}
        >
          {topThree.map((item, idx) => {
            const podiumMedals = ["🥇 1ST PLACE", "🥈 2ND PLACE", "🥉 3RD PLACE"];
            const podiumColors = ["#ffd700", "#e5e7eb", "#cd7f32"];
            const isFirst = idx === 0;

            return (
              <div
                key={item.handle}
                className="reveal-scale leaderboard-podium-card"
                data-delay={idx * 100}
                style={{
                  background: isFirst
                    ? "radial-gradient(ellipse at top, rgba(138,223,122,0.18) 0%, rgba(19,19,16,0.95) 75%)"
                    : "var(--card-bg)",
                  border: isFirst ? "1px solid rgba(138,223,122,0.4)" : "1px solid var(--border)",
                  borderRadius: "24px",
                  padding: isFirst ? "2.5rem 2rem" : "2rem",
                  textAlign: "center",
                  position: "relative",
                  boxShadow: isFirst ? "0 20px 45px -10px rgba(138,223,122,0.2)" : "none",
                  transform: isFirst ? "scale(1.04)" : "scale(1)",
                  transition: "transform 0.2s ease",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: podiumColors[idx],
                    marginBottom: "1rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  {podiumMedals[idx]}
                </div>

                <div
                  style={{
                    width: isFirst ? 76 : 64,
                    height: isFirst ? 76 : 64,
                    borderRadius: "50%",
                    background: isFirst
                      ? "linear-gradient(135deg, var(--accent), var(--accent2))"
                      : "rgba(255,255,255,0.08)",
                    color: isFirst ? "#0a0a08" : "var(--fg)",
                    margin: "0 auto 1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: isFirst ? "1.6rem" : "1.3rem",
                    boxShadow: isFirst ? "0 0 25px rgba(138,223,122,0.4)" : "none",
                  }}
                >
                  {item.avatar}
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: isFirst ? "1.45rem" : "1.2rem",
                    fontWeight: 700,
                    color: "var(--fg)",
                    marginBottom: "0.2rem",
                  }}
                >
                  {item.name}
                </h3>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.75rem" }}>
                  {item.handle} · {item.city}
                </div>

                <div
                  style={{
                    display: "inline-block",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    borderRadius: "100px",
                    padding: "3px 10px",
                    fontSize: "0.7rem",
                    fontFamily: "var(--font-body)",
                    color: "var(--accent)",
                    marginBottom: "1.25rem",
                  }}
                >
                  {item.badge}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 900, color: "var(--accent)" }}>
                      {item.co2Saved} kg
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)" }}>CO₂ SAVED</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 900, color: "var(--fg)" }}>
                      {item.itemsCycled}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)" }}>PIECES CYCLED</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Rankings List */}
        <div
          className="reveal-up"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            marginBottom: "3rem",
          }}
        >
          <div
            className="leaderboard-table-header"
            style={{
              padding: "1.25rem 2rem",
              background: "#0e0e0b",
              borderBottom: "1px solid var(--border)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              color: "var(--muted)",
              letterSpacing: "0.06em",
            }}
          >
            <span>RANK</span>
            <span>MEMBER</span>
            <span className="leaderboard-col-desktop" style={{ textAlign: "right" }}>CO₂ SAVED</span>
            <span className="leaderboard-col-desktop" style={{ textAlign: "right" }}>CYCLED</span>
            <span className="leaderboard-col-desktop" style={{ textAlign: "right" }}>POINTS</span>
            <span className="leaderboard-col-mobile" style={{ textAlign: "right" }}>IMPACT & SCORE</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {list.map((item, i) => (
              <div
                key={item.handle}
                className="leaderboard-table-row"
                style={{
                  alignItems: "center",
                  padding: "1.2rem 2rem",
                  borderBottom: i < list.length - 1 ? "1px solid var(--border)" : "none",
                  background: item.isCurrentUser ? "rgba(138,223,122,0.08)" : "transparent",
                  borderLeft: item.isCurrentUser ? "4px solid var(--accent)" : "4px solid transparent",
                  transition: "background 0.2s",
                }}
              >
                {/* Rank Number */}
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    color: item.rank <= 3 ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  #{item.rank}
                </div>

                {/* Member Profile */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, overflow: "hidden" }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: item.isCurrentUser
                        ? "linear-gradient(135deg, var(--accent), var(--accent2))"
                        : "rgba(255,255,255,0.08)",
                      color: item.isCurrentUser ? "#0a0a08" : "var(--fg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      flexShrink: 0,
                    }}
                  >
                    {item.avatar}
                  </div>
                  <div style={{ minWidth: 0, overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          color: "var(--fg)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.name}
                      </span>
                      {item.isCurrentUser && (
                        <span
                          style={{
                            background: "var(--accent)",
                            color: "#0a0a08",
                            fontSize: "0.58rem",
                            fontFamily: "var(--font-mono)",
                            fontWeight: 800,
                            padding: "1px 6px",
                            borderRadius: "100px",
                          }}
                        >
                          YOU
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.68rem",
                        color: "var(--muted)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.handle} · {item.badge}
                    </div>
                  </div>
                </div>

                {/* Desktop: CO2 Saved */}
                <div
                  className="leaderboard-col-desktop"
                  style={{ textAlign: "right", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent)", fontSize: "1.05rem" }}
                >
                  {item.co2Saved} kg
                </div>

                {/* Desktop: Items Cycled */}
                <div
                  className="leaderboard-col-desktop"
                  style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--fg)" }}
                >
                  {item.itemsCycled} pcs
                </div>

                {/* Desktop: Circular Points */}
                <div
                  className="leaderboard-col-desktop"
                  style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#38bdf8", fontSize: "0.85rem" }}
                >
                  {item.points.toLocaleString()} pts
                </div>

                {/* Mobile: Combined Impact & Score */}
                <div className="leaderboard-mobile-stats">
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--accent)", fontSize: "0.98rem" }}>
                    {item.co2Saved} kg
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "var(--muted)", whiteSpace: "nowrap" }}>
                    {item.itemsCycled} pcs · <span style={{ color: "#38bdf8", fontWeight: 700 }}>{item.points.toLocaleString()} pts</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner: How to climb the leaderboard */}
        <div
          className="leaderboard-cta-banner"
          style={{
            background: "linear-gradient(135deg, #0e1e0f 0%, #152210 100%)",
            border: "1px solid rgba(138,223,122,0.25)",
            borderRadius: "20px",
            padding: "2rem 2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--fg)", marginBottom: "0.4rem" }}>
              Ready to climb the rankings?
            </h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--muted)", margin: 0 }}>
              List your pre-loved clothing, buy circular drops, and divert garments from landfills to earn green points.
            </p>
          </div>
          <Link
            to="/shop"
            style={{
              background: "var(--accent)",
              color: "#0a0a08",
              padding: "0.75rem 1.6rem",
              borderRadius: "100px",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "0.9rem",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Explore Circular Drops →
          </Link>
        </div>
      </div>
    </section>
  );
}

