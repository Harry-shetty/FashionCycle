const conditionColor: Record<string, string> = {
  "Like New": "#8adf7a",
  Excellent: "#c8f564",
  Good: "#f0ece3",
};

const items = [
  {
    title: "Vintage Blazer",
    brand: "Ralph Lauren",
    size: "L",
    condition: "Excellent",
    price: 85,
    img: "https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=600&h=800&fit=crop&auto=format",
  },
  {
    title: "Silk Wrap Dress",
    brand: "Zara",
    size: "M",
    condition: "Good",
    price: 42,
    img: "https://images.unsplash.com/photo-1664076458686-3449062080ac?w=600&h=800&fit=crop&auto=format",
  },
  {
    title: "Linen Co-ord Set",
    brand: "& Other Stories",
    size: "S",
    condition: "Like New",
    price: 68,
    img: "https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?w=600&h=800&fit=crop&auto=format",
  },
  {
    title: "Wool Overcoat",
    brand: "Massimo Dutti",
    size: "M",
    condition: "Good",
    price: 110,
    img: "https://images.unsplash.com/photo-1659522761084-79196b64abe4?w=600&h=800&fit=crop&auto=format",
  },
];

export default function FeaturedItems() {
  return (
    <section id="shop" style={{ padding: "8rem 4rem", background: "#0d0d0b" }}>
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
              transition: "border-color 0.2s, color 0.2s",
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
            View all →
          </button>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}
        >
          {items.map((item, i) => (
            <div key={item.title} className="reveal" data-delay={i * 100} style={{ cursor: "pointer" }}>
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
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                  if (img) img.style.transform = "scale(1)";
                }}
              >
                <img
                  src={item.img}
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
      </div>
    </section>
  );
}
