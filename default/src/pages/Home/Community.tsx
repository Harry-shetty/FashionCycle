import { useState, useEffect } from "react";
import { apiRequest } from "../../services/api";

const testimonials = [
  {
    name: "Harsha Shetty",
    handle: "@ariawears",
    text: "I've cleared out my entire winter wardrobe and made 380₹. The whole process was so smooth — FashionCycle is genuinely changing how I think about clothes.",
    avatar: "AC",
    items: 14,
  },
  {
    name: "Rohit Kapoor",
    handle: "@rohitk",
    text: "Found a Comme des Garçons jacket here for 90₹. That's not possible anywhere else. This platform attracts people who actually care about fashion.",
    avatar: "RK",
    items: 8,
  },
  {
    name: "Priya Nair",
    handle: "@priyaonrepeat",
    text: "The sustainability impact tracker is so motivating. Seeing how many kg of CO₂ I've saved makes the whole experience feel meaningful.",
    avatar: "PN",
    items: 23,
  },
];

export default function Community() {
  const [posts, setPosts] = useState(testimonials);

  useEffect(() => {
    apiRequest<typeof testimonials>("/community")
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setPosts(res);
        }
      })
      .catch((err) => {
        console.warn("MongoDB community voices fetch notice:", err);
      });
  }, []);

  return (
    <section id="community" className="section-pad" style={{ padding: "8rem 4rem", background: "#0d0d0b" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
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
            COMMUNITY VOICES
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
            Loved by fashion<br />
            <em style={{ color: "var(--accent)" }}>forward</em> people
          </h2>
        </div>

        <div className="categories-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          {posts.map((t, i) => (
            <div
              key={t.name}
              className="reveal"
              data-delay={i * 150}
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "2rem",
                transition: "transform 0.3s ease, border-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(138,223,122,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#0a0a08",
                    flexShrink: 0,
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: "var(--fg)",
                    }}
                  >
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.65rem",
                      color: "var(--muted)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {t.handle} · {t.items} items sold
                  </div>
                </div>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: "var(--muted)",
                  lineHeight: 1.75,
                  fontStyle: "italic",
                }}
              >
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
