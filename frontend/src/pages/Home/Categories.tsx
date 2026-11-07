import { useNavigate } from "react-router-dom";

const cats = [
  {
    label: "Jackets",
    count: "14,200",
    img: "https://images.unsplash.com/photo-1646654793829-222c56e60300?w=600&h=400&fit=crop&auto=format",
  },
  {
    label: "Denim",
    count: "18,400",
    img: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&h=400&fit=crop&auto=format",
  },
  {
    label: "Long Coats",
    count: "9,600",
    img: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=400&fit=crop&auto=format",
  },
  {
    label: "Tees & Tops",
    count: "24,800",
    img: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=400&fit=crop&auto=format",
  },
  {
    label: "Sweaters",
    count: "16,100",
    img: "https://images.unsplash.com/photo-1523523262500-ec13396518c6?w=600&h=400&fit=crop&auto=format",
  },
];

export default function Categories() {
  const navigate = useNavigate();

  return (
    <section className="section-pad" style={{ padding: "8rem 4rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "3rem" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--accent)",
              letterSpacing: "0.1em",
              marginBottom: "0.75rem",
            }}
          >
            BROWSE BY CATEGORY
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Find your style
          </h2>
        </div>

        <div className="two-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {cats.map((cat, i) => (
            <div
              key={cat.label}
              className={i % 2 === 0 ? "reveal-left" : "reveal-right"}
              data-delay={i * 100}
              onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.label)}`)}
              style={{
                position: "relative",
                height: "280px",
                borderRadius: "20px",
                overflow: "hidden",
                cursor: "pointer",
                background: "#1a1a16",
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                if (img) img.style.transform = "scale(1.1)";
                const border = e.currentTarget.querySelector(".cat-border") as HTMLElement;
                if (border) border.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                if (img) img.style.transform = "scale(1)";
                const border = e.currentTarget.querySelector(".cat-border") as HTMLElement;
                if (border) border.style.borderColor = "transparent";
              }}
            >
              <img
                src={cat.img}
                alt={cat.label}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                  filter: "brightness(0.6)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                }}
              />
              <div
                className="cat-border"
                style={{
                  position: "absolute",
                  inset: 0,
                  border: "2px solid transparent",
                  borderRadius: "20px",
                  transition: "border-color 0.3s ease",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "var(--fg)",
                    marginBottom: "0.2rem",
                  }}
                >
                  {cat.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: "rgba(255,255,255,0.7)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {cat.count} items →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
