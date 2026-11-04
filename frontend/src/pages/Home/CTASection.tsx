import { Link } from "react-router-dom";
import { useStore } from "../../contexts/StoreContext";

export default function CTASection() {
  const { openNewListingModal } = useStore();

  return (
    <section
      className="section-pad"
      style={{
        padding: "8rem 4rem",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(138,223,122,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          className="reveal"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--accent)",
            letterSpacing: "0.1em",
            marginBottom: "1.5rem",
          }}
        >
          JOIN THE MOVEMENT
        </div>
        <h2
          className="reveal"
          data-delay="100"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 5vw, 5.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.0,
            marginBottom: "1.5rem",
          }}
        >
          Your closet.<br />
          <em style={{ color: "var(--accent)" }}>The planet.</em><br />
          Both win.
        </h2>
        <p
          className="reveal"
          data-delay="200"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.1rem",
            color: "var(--muted)",
            lineHeight: 1.7,
            marginBottom: "3rem",
          }}
        >
          Start your FashionCycle journey today. List your first piece in under
          2 minutes, zero fees, 100% circular impact.
        </p>
        <div
          className="reveal"
          data-delay="300"
          style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link
            to="/shop"
            style={{
              background: "var(--accent)",
              color: "#0a0a08",
              border: "none",
              padding: "1.1rem 2.5rem",
              borderRadius: "100px",
              fontSize: "1.05rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              textDecoration: "none",
              display: "inline-block",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05) translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 20px 60px rgba(138,223,122,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1) translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Explore Marketplace →
          </Link>

          <button
            onClick={openNewListingModal}
            style={{
              background: "transparent",
              color: "var(--fg)",
              border: "1px solid var(--border)",
              padding: "1.1rem 2.2rem",
              borderRadius: "100px",
              fontSize: "1.05rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              display: "inline-block",
              transition: "border-color 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            + List Your First Piece
          </button>
        </div>
      </div>
    </section>
  );
}
