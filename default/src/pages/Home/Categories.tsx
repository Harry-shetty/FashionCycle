const cats = [
  {
    label: "Tops & Tees",
    count: "24,800",
    img: "https://images.unsplash.com/photo-1637228393246-c38a4b3d2011?w=600&h=400&fit=crop&auto=format",
  },
  {
    label: "Outerwear",
    count: "8,400",
    img: "https://images.unsplash.com/photo-1619161519929-befcb28d6384?w=600&h=400&fit=crop&auto=format",
  },
  {
    label: "Dresses",
    count: "18,600",
    img: "https://images.unsplash.com/photo-1624192647570-1131acc12ccf?w=600&h=400&fit=crop&auto=format",
  },
  {
    label: "Denim",
    count: "11,200",
    img: "https://images.unsplash.com/photo-1642359730306-4e80ff12ff6d?w=600&h=400&fit=crop&auto=format",
  },
];

export default function Categories() {
  return (
    <section style={{ padding: "8rem 4rem", background: "var(--bg)" }}>
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {cats.map((cat, i) => (
            <div
              key={cat.label}
              className={i % 2 === 0 ? "reveal-left" : "reveal-right"}
              data-delay={i * 100}
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
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                if (img) img.style.transform = "scale(1)";
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
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {cat.count} items
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
