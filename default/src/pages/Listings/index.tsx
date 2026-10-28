import { useState } from "react";
import { useStore } from "../../contexts/StoreContext";

export default function ListingsPage() {
  const { listings, updateListingStatus, deleteListing, openNewListingModal } = useStore();
  const [filter, setFilter] = useState<"all" | "active" | "sold">("all");

  const filtered = listings.filter((l) => {
    if (filter === "active") return !l.sold;
    if (filter === "sold") return l.sold;
    return true;
  });

  return (
    <section className="section-pad" style={{ minHeight: "100vh", padding: "4rem 2rem 6rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <div
          className="reveal"
          style={{
            marginBottom: "3rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--accent)",
                letterSpacing: "0.1em",
                marginBottom: "0.75rem",
              }}
            >
              SELLER DASHBOARD · {listings.length} TOTAL PIECES
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 4vw, 4rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              My Listings
            </h1>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {/* Filter buttons */}
            <div style={{ display: "flex", gap: "0.4rem", background: "rgba(255,255,255,0.03)", padding: "4px", borderRadius: "100px", border: "1px solid var(--border)" }}>
              {(["all", "active", "sold"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "0.4rem 1.1rem",
                    borderRadius: "100px",
                    border: "none",
                    background: filter === f ? "var(--accent)" : "transparent",
                    color: filter === f ? "#0a0a08" : "var(--muted)",
                    fontWeight: filter === f ? 700 : 500,
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textTransform: "capitalize",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Create new listing */}
            <button
              onClick={openNewListingModal}
              style={{
                background: "var(--accent)",
                color: "#0a0a08",
                border: "none",
                borderRadius: "100px",
                padding: "0.6rem 1.4rem",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              + New Listing
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        {filtered.length === 0 ? (
          <div
            style={{
              padding: "4rem 2rem",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>👗</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              No {filter !== "all" ? filter : ""} listings found
            </h3>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Ready to clear your wardrobe and earn while preserving the planet?
            </p>
            <button
              onClick={openNewListingModal}
              style={{
                background: "var(--accent)",
                color: "#0a0a08",
                border: "none",
                borderRadius: "100px",
                padding: "0.75rem 1.8rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Create Your First Listing
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filtered.map((item, idx) => (
              <div
                key={item.id}
                className="reveal-scale"
                data-delay={(idx % 4) * 60}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "18px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, border-color 0.2s",
                }}
              >
                {/* Image */}
                <div style={{ aspectRatio: "3/4", background: "#1a1a14", position: "relative" }}>
                  <img src={item.images[0]} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {item.sold && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,8,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.12em", border: "1px solid var(--accent)", padding: "0.3rem 0.8rem", borderRadius: "100px" }}>
                        SOLD
                      </span>
                    </div>
                  )}
                  <div style={{ position: "absolute", bottom: "0.6rem", right: "0.6rem", background: "rgba(10,10,8,0.85)", borderRadius: "100px", padding: "0.25rem 0.65rem", fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 700, color: "var(--accent)" }}>
                    {item.price}₹
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: "0.25rem" }}>
                    {item.title}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
                    {item.brand} · {item.size} · {item.condition}
                  </div>

                  {/* Actions */}
                  <div style={{ marginTop: "auto", display: "flex", gap: "0.5rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
                    <button
                      onClick={() => updateListingStatus(item.id, !item.sold)}
                      style={{
                        flex: 1,
                        background: item.sold ? "rgba(138,223,122,0.12)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${item.sold ? "var(--accent)" : "var(--border)"}`,
                        color: item.sold ? "var(--accent)" : "var(--fg)",
                        padding: "0.5rem 0.5rem",
                        borderRadius: "100px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        fontWeight: 600,
                        transition: "all 0.2s",
                      }}
                    >
                      {item.sold ? "↺ Relist" : "✓ Mark Sold"}
                    </button>
                    <button
                      onClick={() => deleteListing(item.id)}
                      style={{
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        color: "#ef4444",
                        padding: "0.5rem 0.8rem",
                        borderRadius: "100px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        fontWeight: 600,
                        transition: "all 0.2s",
                      }}
                      title="Delete listing"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
