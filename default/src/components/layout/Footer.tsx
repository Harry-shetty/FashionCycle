import { Link } from "react-router-dom";
import FashionCycleLogo from "../shared/FashionCycleLogo";
export default function Footer() {
  return (
    <footer
      style={{
        background: "#060605",
        borderTop: "1px solid var(--border)",
        padding: "4rem 4rem 2rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
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
              planet.
            </p>
          </div>

          {[
            {
              heading: "Platform",
              links: [
                { label: "Browse", href: "/shop" },
                { label: "Sell", href: "/register" },
                { label: "Exchange", href: "/shop" },
              ],
            },
            {
              heading: "Company",
              links: [
                { label: "About", href: "/#impact" },
                { label: "Blog", href: "#" },
                { label: "Careers", href: "#" },
                { label: "Press", href: "#" },
              ],
            },
            {
              heading: "Support",
              links: [
                { label: "Help Center", href: "#" },
                { label: "Contact", href: "#" },
                { label: "Safety", href: "#" },
                { label: "Terms", href: "#" },
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
            © 2026 FashionCycle. Made with ♻ for the planet.
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Instagram", "TikTok", "Twitter"].map((s) => (
              <a
                key={s}
                href="#"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "var(--muted)",
                  textDecoration: "none",
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
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
