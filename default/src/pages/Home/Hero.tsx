import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "4rem 4rem 5rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(138,223,122,0.12)",
            border: "1px solid rgba(138,223,122,0.3)",
            borderRadius: "100px",
            padding: "0.35rem 1rem",
            marginBottom: "2rem",
            width: "fit-content",
            animation: "fadeIn 0.8s ease 0.3s both",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--accent)",
              letterSpacing: "0.08em",
            }}
          >
            THE CIRCULAR FASHION PLATFORM
          </span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.5rem, 6vw, 6rem)",
            lineHeight: 1.0,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            marginBottom: "1.5rem",
            animation: "fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.4s both",
          }}
        >
          Fashion<br />
          <em style={{ color: "var(--accent)", fontStyle: "italic" }}>Never</em><br />
          Dies
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.1rem",
            color: "var(--muted)",
            lineHeight: 1.7,
            maxWidth: "380px",
            marginBottom: "2.5rem",
            animation: "fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.6s both",
          }}
        >
          Buy, sell, and exchange pre-loved fashion. Give your wardrobe a
          second life while building a more sustainable world.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            animation: "fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.8s both",
          }}
        >
          <Link
            to="/register"
            style={{
              background: "var(--accent)",
              color: "#0a0a08",
              border: "none",
              padding: "1rem 2.2rem",
              borderRadius: "100px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              textDecoration: "none",
              display: "inline-block",
              transition: "transform 0.25s ease, background 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1) translateY(0)";
            }}
          >
            Start Shopping →
          </Link>
          <a
            href="#how-it-works"
            style={{
              background: "transparent",
              color: "var(--fg)",
              border: "1px solid var(--border)",
              padding: "1rem 2rem",
              borderRadius: "100px",
              fontSize: "1rem",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              textDecoration: "none",
              display: "inline-block",
              transition: "border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--fg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            How It Works
          </a>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "2.5rem",
            marginTop: "3.5rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--border)",
            animation: "fadeUp 1s cubic-bezier(0.16,1,0.3,1) 1s both",
          }}
        >
          {[
            { num: "120K+", label: "Members" },
            { num: "840K", label: "Items listed" },
            { num: "2.4M kg", label: "CO₂ saved" },
          ].map((s) => (
            <div key={s.label}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "var(--fg)",
                  lineHeight: 1.1,
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "var(--muted)",
                  letterSpacing: "0.05em",
                  marginTop: "0.2rem",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right image panel */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=900&h=1200&fit=crop&auto=format"
          alt="Fashion model in editorial look"
          className="hero-bg-img"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            filter: "brightness(0.85)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, var(--bg) 0%, transparent 30%)",
          }}
        />

        {/* Floating sold card */}
        <div
          className="float-anim"
          style={{
            position: "absolute",
            bottom: "15%",
            left: "10%",
            background: "rgba(10,10,8,0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "1.2rem 1.5rem",
            animation: "fadeIn 1s ease 1.2s both, float 6s ease-in-out 2s infinite",
            zIndex: 5,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "var(--accent)",
              letterSpacing: "0.1em",
              marginBottom: "0.4rem",
            }}
          >
            JUST SOLD
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--fg)",
            }}
          >
            Vintage Levi&apos;s Jacket
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "0.5rem",
              gap: "2rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                color: "var(--muted)",
              }}
            >
              Size M · Used: Good
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--accent)",
              }}
            >
              $48
            </span>
          </div>
        </div>

        {/* Spinning badge */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "8%",
            width: 100,
            height: 100,
            animation: "fadeIn 1s ease 1s both",
          }}
        >
          <svg className="spin-badge" viewBox="0 0 100 100" width="100" height="100">
            <defs>
              <path id="circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
            </defs>
            <circle cx="50" cy="50" r="47" fill="none" stroke="var(--accent)" strokeWidth="1" />
            <text fill="var(--accent)" fontSize="10.5" fontFamily="var(--font-mono)" letterSpacing="3">
              <textPath href="#circle">SUSTAINABLE · CIRCULAR · FASHION ·&nbsp;</textPath>
            </text>
            <circle cx="50" cy="50" r="14" fill="var(--accent)" />
            <text x="50" y="55" textAnchor="middle" fill="#0a0a08" fontSize="16" fontFamily="var(--font-display)" fontWeight="700">♻</text>
          </svg>
        </div>
      </div>
    </section>
  );
}
