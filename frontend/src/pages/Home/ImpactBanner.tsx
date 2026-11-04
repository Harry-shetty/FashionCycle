const stats = [
  { value: "2.4M", unit: "kg CO₂", label: "prevented from entering the atmosphere" },
  { value: "840K", unit: "garments", label: "rescued from landfill and given new homes" },
  { value: "6.2M", unit: "liters", label: "of water saved through circular fashion" },
  { value: "120K", unit: "members", label: "building a more sustainable wardrobe" },
];

export default function ImpactBanner() {
  return (
    <section
      id="impact"
      className="section-pad"
      style={{
        padding: "8rem 4rem",
        background: "var(--accent)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "rgba(0,0,0,0.5)",
              letterSpacing: "0.1em",
              marginBottom: "1rem",
            }}
          >
            OUR IMPACT
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 4vw, 4rem)",
              fontWeight: 900,
              color: "#0a0a08",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Fashion that heals<br />
            <em>the planet</em>
          </h2>
        </div>

        <div className="stats-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }}>
          {stats.map((s, i) => (
            <div
              key={s.unit}
              className="reveal"
              data-delay={i * 120}
              style={{
                textAlign: "center",
                padding: "2rem 1rem",
                background: "rgba(255,255,255,0.35)",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.6)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.8rem",
                  fontWeight: 900,
                  color: "#0a0a08",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "rgba(0,0,0,0.6)",
                  letterSpacing: "0.05em",
                  marginTop: "0.3rem",
                  marginBottom: "0.5rem",
                }}
              >
                {s.unit}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  color: "rgba(0,0,0,0.55)",
                  lineHeight: 1.5,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
