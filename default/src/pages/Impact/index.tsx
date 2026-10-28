import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../contexts/StoreContext";

export default function ImpactPage() {
  const { impact, addImpact, showToast } = useStore();
  const [calcItems, setCalcItems] = useState(15);
  const [pledged, setPledged] = useState(false);

  // Dynamic calculations based on slider
  const calcCo2 = (calcItems * 3.8).toFixed(1);
  const calcWater = (calcItems * 2700).toLocaleString();
  const calcMoney = (calcItems * 72).toLocaleString();

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast("Impact link copied to clipboard! Share your eco stats 🌿");
  };

  const handlePledge = () => {
    if (pledged) return;
    addImpact(5.2, 3500, 0);
    setPledged(true);
    showToast("Tree pledge recorded! 5.2 kg CO₂ credit added to your lifetime profile 🌱");
  };

  return (
    <section className="section-pad" style={{ minHeight: "100vh", padding: "4rem 2rem 6rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div className="reveal" style={{ marginBottom: "3rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
            LIFETIME SUSTAINABILITY REPORT
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 4vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Your Ecological Footprint
          </h1>
        </div>

        {/* Real-time stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          {[
            {
              label: "Water Preserved",
              value: `${Math.round(impact.water || 0).toLocaleString()} L`,
              icon: "💧",
              desc: `Equivalent to ${(Math.round(impact.water || 0) * 4).toLocaleString()} drinking glasses saved.`,
            },
            {
              label: "CO₂ Prevented",
              value: `${(Math.round(Number(impact.co2 || 0) * 10) / 10).toFixed(1)} kg`,
              icon: "🌱",
              desc: "Equal to emissions from 210 km driven.",
            },
            {
              label: "Garments Cycled",
              value: `${Math.round(impact.items || 0)} pcs`,
              icon: "♻️",
              desc: "Diverted from industrial landfills.",
            },
            {
              label: "Circulated Earnings",
              value: `${Math.round(impact.money || 0).toLocaleString()}₹`,
              icon: "💚",
              desc: "Returned directly to conscious fashionistas.",
            },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className="reveal-scale"
              data-delay={idx * 80}
              style={{
                background: "rgba(138,223,122,0.05)",
                border: "1px solid rgba(138,223,122,0.2)",
                borderRadius: "20px",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{stat.icon}</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.8rem, 2.5vw, 2.4rem)",
                  fontWeight: 900,
                  color: "var(--accent)",
                  letterSpacing: "-0.02em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={stat.value}
              >
                {stat.value}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--fg)", marginTop: "0.5rem", fontWeight: 600 }}>
                {stat.label}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.5rem", lineHeight: 1.5 }}>
                {stat.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Carbon & Water Savings Calculator */}
        <div
          className="reveal-up"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
            INTERACTIVE SIMULATOR
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800, marginBottom: "1.5rem" }}>
            Wardrobe Impact Calculator
          </h2>

          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--fg)" }}>
                Garments you want to cycle this year:
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", fontWeight: 700, color: "var(--accent)" }}>
                {calcItems} pieces
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              value={calcItems}
              onChange={(e) => setCalcItems(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "var(--accent)",
                cursor: "pointer",
              }}
            />
          </div>

          <div className="calc-metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "16px" }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)" }}>PROJECTED CO₂ SAVINGS</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, color: "var(--accent)", marginTop: "4px" }}>
                {calcCo2} kg
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)" }}>WATER PRESERVED</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, color: "var(--accent)", marginTop: "4px" }}>
                {calcWater} L
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)" }}>ESTIMATED EARNINGS</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, color: "var(--fg)", marginTop: "4px" }}>
                {calcMoney}₹
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Celebration & Action Bar */}
        <div
          className="reveal"
          style={{
            background: "linear-gradient(135deg, #0d1f0d, #0d1810)",
            border: "1px solid rgba(138,223,122,0.25)",
            borderRadius: "24px",
            padding: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          <div>
            <span style={{ fontSize: "1.8rem" }}>🏆</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, marginTop: "0.5rem" }}>
              You are in the Top 5% of Circular Sellers!
            </h2>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", maxWidth: "520px", marginTop: "0.4rem", lineHeight: 1.6, fontSize: "0.9rem" }}>
              Your dedicated efforts are actively replacing fast fashion demand. Share your verified milestone certificate or pledge to double your impact.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={handleShare}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--fg)",
                padding: "0.8rem 1.5rem",
                borderRadius: "100px",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              📋 Share Impact
            </button>
            <button
              onClick={handlePledge}
              disabled={pledged}
              style={{
                background: pledged ? "rgba(138,223,122,0.2)" : "var(--accent)",
                color: pledged ? "var(--accent)" : "#0a0a08",
                border: "none",
                padding: "0.8rem 1.6rem",
                borderRadius: "100px",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: pledged ? "default" : "pointer",
              }}
            >
              {pledged ? "✓ Tree Pledge Active" : "🌱 Pledge a Tree (+5.2kg)"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
