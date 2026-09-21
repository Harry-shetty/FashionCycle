import { useEffect, useState } from "react";
import { getListings } from "../../services/listings.service";
import type { Listing } from "../../types/listing.types";

const conditionColor: Record<string, string> = {
  "Like New": "#8adf7a",
  Excellent: "#c8f564",
  Good: "#f0ece3",
  Fair: "var(--muted)",
};

export default function ShopPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListings()
      .then(setListings)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ minHeight: "100vh", padding: "4rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--accent)",
              letterSpacing: "0.1em",
              marginBottom: "0.75rem",
            }}
          >
            ALL LISTINGS
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
            Shop the cycle
          </h1>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "40vh",
              fontFamily: "var(--font-mono)",
              color: "var(--muted)",
              fontSize: "0.85rem",
              letterSpacing: "0.06em",
            }}
          >
            LOADING…
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {listings.map((item) => (
              <div key={item.id} style={{ cursor: "pointer" }}>
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "3/4",
                    borderRadius: "16px",
                    overflow: "hidden",
                    marginBottom: "1rem",
                    background: "#1a1a16",
                  }}
                  onMouseEnter={(e) => {
                    const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                    if (img) img.style.transform = "scale(1.08)";
                  }}
                  onMouseLeave={(e) => {
                    const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                    if (img) img.style.transform = "scale(1)";
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
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
