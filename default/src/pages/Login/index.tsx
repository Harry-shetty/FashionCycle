import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useStore } from "../../contexts/StoreContext";

export default function LoginPage() {
  const { login, loginAsDemo } = useAuth();
  const { showToast } = useStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("harsha@gmail.com");
  const [password, setPassword] = useState("iambatman");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      showToast("Signed in successfully! Welcome back 🌿");
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function handleDemoAccess() {
    loginAsDemo("Sophia Laurent");
    showToast("Signed in as Demo User (Sophia Laurent) 🚀");
    navigate("/home");
  }

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "0.85rem 1rem",
    color: "var(--fg)",
    fontFamily: "var(--font-body)",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s ease",
  } as const;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "24px",
        padding: "2.5rem",
      }}
    >
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            marginBottom: "0.5rem",
          }}
        >
          Welcome back
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
            color: "var(--muted)",
          }}
        >
          Sign in to your FashionCycle account
        </p>
      </div>

      {/* 1-Click Demo Login Button */}
      <button
        type="button"
        onClick={handleDemoAccess}
        style={{
          width: "100%",
          background: "rgba(138,223,122,0.12)",
          border: "1px solid var(--accent)",
          color: "var(--accent)",
          borderRadius: "100px",
          padding: "0.85rem",
          fontSize: "0.95rem",
          fontWeight: 700,
          fontFamily: "var(--font-body)",
          cursor: "pointer",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          transition: "transform 0.2s, background 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.02)";
          e.currentTarget.style.background = "rgba(138,223,122,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.background = "rgba(138,223,122,0.12)";
        }}
      >
        <span>⚡</span> Quick Demo Sign-in (1-Click)
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>OR SIGN IN WITH EMAIL</span>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label
            htmlFor="email"
            style={{
              display: "block",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--muted)",
              letterSpacing: "0.06em",
              marginBottom: "0.5rem",
            }}
          >
            EMAIL
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            style={{
              display: "block",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--muted)",
              letterSpacing: "0.06em",
              marginBottom: "0.5rem",
            }}
          >
            PASSWORD
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "10px",
              padding: "0.75rem 1rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "var(--muted)" : "var(--accent)",
            color: "#0a0a08",
            border: "none",
            borderRadius: "100px",
            padding: "0.9rem",
            fontSize: "1rem",
            fontWeight: 700,
            fontFamily: "var(--font-body)",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "0.5rem",
            transition: "transform 0.2s ease, background 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {loading ? "Signing in…" : "Sign In →"}
        </button>
      </form>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          color: "var(--muted)",
          textAlign: "center",
          marginTop: "1.5rem",
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
