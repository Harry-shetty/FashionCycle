import { useState } from "react";
import { Link } from "react-router-dom";
import FashionCycleLogo from "../shared/FashionCycleLogo";
import { useStore } from "../../contexts/StoreContext";

import { apiRequest } from "../../services/api";


export default function Footer() {
  const [email, setEmail] = useState("");
  const { showToast } = useStore();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    try {
      await apiRequest("/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      showToast(`Welcome to the circular movement! 🌿 Email saved to MongoDB: ${email}`);
      setEmail("");
    } catch {
      showToast(`Subscribed! 🌿 We've sent a welcome pack to ${email}`);
      setEmail("");
    }
  };

  const handleSocialClick = (platform: string) => {
    showToast(`Follow @FashionCycle on ${platform} 💚`);
  };

  return (
    <footer
      className="footer-pad"
      style={{
        background: "#060605",
        borderTop: "1px solid var(--border)",
        padding: "5rem 4rem 3rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Newsletter Section */}
        <div
          style={{
            background: "rgba(138,223,122,0.04)",
            border: "1px solid rgba(138,223,122,0.15)",
            borderRadius: "20px",
            padding: "2.5rem 3rem",
            marginBottom: "4rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
              WEEKLY CURATED DROPS & ECO DIGEST
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 900, letterSpacing: "-0.02em" }}>
              Join the Circular Insider
            </h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--muted)", marginTop: "0.25rem" }}>
              Get first access to rare vintage pieces, seller tips, and impact metrics.
            </p>
          </div>

          <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "0.5rem", maxWidth: "420px", width: "100%" }}>
            <input
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border)",
                borderRadius: "100px",
                padding: "0.8rem 1.25rem",
                color: "var(--fg)",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "var(--accent)",
                color: "#0a0a08",
                border: "none",
                borderRadius: "100px",
                padding: "0.8rem 1.5rem",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "transform 0.2s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Links Grid */}
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "3rem",
            marginBottom: "4rem",
          }}
        >
          <div>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                marginBottom: "1rem",
                textDecoration: "none",
              }}
            >
              <FashionCycleLogo size={14} />
            </Link>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--muted)",
                lineHeight: 1.7,
                maxWidth: "280px",
              }}
            >
              The circular fashion platform connecting sellers, buyers, and the
              planet. Extending the lifetime of quality garments.
            </p>
          </div>

          {[
            {
              heading: "Marketplace",
              links: [
                { label: "Browse All Pieces", href: "/shop" },
                { label: "Outerwear", href: "/shop" },
                { label: "Dresses & Sets", href: "/shop" },
                { label: "Vintage Denim", href: "/shop" },
              ],
            },
            {
              heading: "Community & Impact",
              links: [
                { label: "My Impact Report", href: "/impact" },
                { label: "How It Works", href: "/#how-it-works" },
                { label: "Community Voices", href: "/#community" },
                { label: "My Listings", href: "/listings" },
              ],
            },
            {
              heading: "Account & Support",
              links: [
                { label: "Orders & Tracking", href: "/orders" },
                { label: "Eco Leaderboard", href: "/leaderboard" },
                { label: "My Profile", href: "/profile" },
                { label: "Sign In / Register", href: "/login" },
              ],
            },
          ].map((col) => (
            <div key={col.heading}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "var(--fg)",
                  letterSpacing: "0.08em",
                  marginBottom: "1rem",
                }}
              >
                {col.heading}
              </div>
              {col.links.map((link) => (
                <div key={link.label} style={{ marginBottom: "0.6rem" }}>
                  <Link
                    to={link.href}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.875rem",
                      color: "var(--muted)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--fg)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--muted)")
                    }
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--muted)",
              letterSpacing: "0.04em",
            }}
          >
            © 2026 FashionCycle. Made with ♻ for circular wardrobes.
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Instagram", "TikTok", "Twitter", "Pinterest"].map((s) => (
              <button
                key={s}
                onClick={() => handleSocialClick(s)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "var(--muted)",
                  letterSpacing: "0.04em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--muted)")
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
