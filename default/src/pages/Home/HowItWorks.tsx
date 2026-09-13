export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "List Your Pieces",
      desc: "Upload photos, set your price, add details. Your listing goes live in minutes — no listing fees.",
      icon: "📸",
    },
    {
      number: "02",
      title: "Ship or Exchange",
      desc: "Sell items and ship them out, or arrange local swaps. We handle the payment and buyer protection.",
      icon: "📦",
    },
    {
      number: "03",
      title: "Earn & Repeat",
      desc: "Get paid instantly when your item sells. Use earnings to shop more sustainable fashion.",
      icon: "💚",
    },
  ];

  return (
    <section id="how-it-works" style={{ padding: "8rem 4rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
            marginBottom: "6rem",
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
                marginBottom: "1rem",
              }}
            >
              HOW IT WORKS
            </div>
            <h2
              className="reveal"
              data-delay="100"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 4vw, 4rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Three steps to a circular wardrobe
            </h2>
          </div>
          <p
            className="reveal-right"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.1rem",
              color: "var(--muted)",
              lineHeight: 1.8,
            }}
          >
            FashionCycle makes it effortless to participate in the circular
            economy. Whether you&apos;re clearing out your closet or hunting for
            unique pieces, we&apos;ve built the platform to make it seamless.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="reveal"
              data-delay={i * 150}
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "2.5rem 2rem",
                position: "relative",
                overflow: "hidden",
                cursor: "default",
                transition: "transform 0.3s ease, border-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "6rem",
                  fontWeight: 900,
                  color: "rgba(138,223,122,0.06)",
                  position: "absolute",
                  top: "-1rem",
                  right: "-0.5rem",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {step.number}
              </div>
              <div style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>{step.icon}</div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "var(--accent)",
                  letterSpacing: "0.1em",
                  marginBottom: "0.75rem",
                }}
              >
                STEP {step.number}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  color: "var(--muted)",
                  lineHeight: 1.7,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
