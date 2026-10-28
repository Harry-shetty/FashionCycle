import { useNavigate } from "react-router-dom";
import { useStore } from "../../contexts/StoreContext";
import type { Listing } from "../../types/listing.types";

const conditionColor: Record<string, string> = {
  "Like New": "#8adf7a",
  Excellent: "#c8f564",
  Good: "#f0ece3",
};

export default function FeaturedItems() {
  const navigate = useNavigate();
  const { listings, openItemModal, savedIds, toggleSave } = useStore();

  const curatedItems = listings.slice(0, 4);

  return (
    <section id="shop" className="section-pad" style={{ padding: "8rem 4rem", background: "#0d0d0b" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "3rem",
          }}
        >
          <div>
            <div
              className="reveal"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--accent)",
                letterSpacing: "0.1em",
                marginBottom: "0.75rem",
              }}
            >
              CURATED DROPS
            </div>
            <h2
              className="reveal"
              data-delay="100"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Today&apos;s picks
            </h2>
          </div>
          <button
            onClick={() => navigate("/shop")}
            className="reveal-right"
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--fg)",
              padding: "0.75rem 1.75rem",
              borderRadius: "100px",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              transition: "border-color 0.2s, color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent)";
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--fg)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            View all →
          </button>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}
        >
          {curatedItems.map((item: Listing, i: number) => {
            const isSaved = savedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="reveal"
                data-delay={i * 100}
                onClick={() => openItemModal(item)}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "3/4",
                    borderRadius: "16px",
                    overflow: "hidden",
                    marginBottom: "1rem",
                    background: "#1a1a16",
                    transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  onMouseEnter={(e) => {
                    const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                    if (img) img.style.transform = "scale(1.08)";
                    const overlay = e.currentTarget.querySelector(".quick-overlay") as HTMLElement;
                    if (overlay) overlay.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                    if (img) img.style.transform = "scale(1)";
                    const overlay = e.currentTarget.querySelector(".quick-overlay") as HTMLElement;
                    if (overlay) overlay.style.opacity = "0";
                  }}
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />
                  
                  {/* Condition Tag */}
                  <div
                    style={{
                      position: "absolute",
                      top: "0.75rem",
                      left: "0.75rem",
                      background: "rgba(10,10,8,0.85)",
                      backdropFilter: "blur(8px)",
                      borderRadius: "100px",
                      padding: "0.25rem 0.75rem",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.65rem",
                      color: conditionColor[item.condition] || "var(--fg)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {item.condition}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(item.id);
                    }}
                    style={{
                      position: "absolute",
                      top: "0.75rem",
                      right: "0.75rem",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: "none",
                      background: "rgba(10,10,8,0.75)",
                      backdropFilter: "blur(6px)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.95rem",
                      color: isSaved ? "var(--accent)" : "var(--fg)",
                      transition: "transform 0.2s",
                      zIndex: 3,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {isSaved ? "♥" : "♡"}
                  </button>

                  {/* Price Tag */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0.75rem",
                      right: "0.75rem",
                      background: "var(--accent)",
                      borderRadius: "100px",
                      padding: "0.35rem 0.9rem",
                      fontFamily: "var(--font-display)",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "#0a0a08",
                    }}
                  >
                    {item.price}₹
                  </div>

                  {/* Quick Action Overlay */}
                  <div
                    className="quick-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(10,10,8,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.25s ease",
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        background: "rgba(10,10,8,0.9)",
                        border: "1px solid var(--accent)",
                        color: "var(--accent)",
                        padding: "0.5rem 1.25rem",
                        borderRadius: "100px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      QUICK VIEW
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    color: "var(--muted)",
                    letterSpacing: "0.06em",
                    marginBottom: "0.25rem",
                  }}
                >
                  {item.brand} · Size {item.size}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
