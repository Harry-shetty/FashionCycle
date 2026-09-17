export default function MessagesPage() {
  return (
    <section style={{ minHeight: "100vh", padding: "4rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
            INBOX
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 4vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Messages
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "40vh", fontFamily: "var(--font-mono)", color: "var(--muted)", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "16px" }}>
          NO NEW MESSAGES
        </div>
      </div>
    </section>
  );
}
