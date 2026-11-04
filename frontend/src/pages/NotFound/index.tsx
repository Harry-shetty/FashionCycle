import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        textAlign: "center",
        padding: "4rem",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "10rem",
          fontWeight: 900,
          color: "rgba(138,223,122,0.08)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        404
      </div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          marginTop: "-3rem",
          marginBottom: "1rem",
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "1rem",
          color: "var(--muted)",
          lineHeight: 1.7,
          maxWidth: "420px",
          marginBottom: "2.5rem",
        }}
      >
        This page has gone out of style. Let&apos;s get you back to something
        more fashionable.
      </p>
      <Link
        to="/"
        style={{
          background: "var(--accent)",
          color: "#0a0a08",
          border: "none",
          padding: "0.9rem 2.25rem",
          borderRadius: "100px",
          fontSize: "1rem",
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          textDecoration: "none",
          display: "inline-block",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        ← Back to Home
      </Link>
    </section>
  );
}
