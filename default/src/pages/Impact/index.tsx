export default function ImpactPage() {
  return (
    <section style={{ minHeight: "100vh", padding: "4rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
            SUSTAINABILITY REPORT
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 4vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            My Impact
          </h1>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          {[
            { label: "Water Saved", value: "2,400L", icon: "💧" },
            { label: "CO₂ Prevented", value: "14kg", icon: "🌱" },
            { label: "Items Cycled", value: "8", icon: "♻️" },
          ].map(stat => (
            <div key={stat.label} style={{ background: "rgba(138,223,122,0.05)", border: "1px solid rgba(138,223,122,0.15)", borderRadius: "16px", padding: "2rem" }}>
               <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{stat.icon}</div>
               <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 900, color: "var(--accent)", letterSpacing: "-0.02em" }}>{stat.value}</div>
               <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--fg)", marginTop: "0.5rem" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
