import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useStore } from "../../contexts/StoreContext";
import CircularLoader from "../../components/shared/CircularLoader";
import type { UserRole } from "../../types/user.types";

export default function RegisterPage() {
  const { register, loginAsDemo } = useAuth();
  const { showToast } = useStore();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>("buyer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register({ name, email, password, role });
      showToast(`Welcome to FashionCycle as a verified ${role}! 🎉`);
      navigate(role === "seller" ? "/listings" : "/shop");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  function handleDemoBuyer() {
    loginAsDemo("Sophia Laurent", "buyer");
    showToast("Signed in as Demo Buyer (Sophia Laurent) 🛍️");
    navigate("/shop");
  }

  function handleDemoSeller() {
    loginAsDemo("Harsha EcoStudio", "seller");
    showToast("Signed in as Demo Seller (Harsha EcoStudio) 🏷️");
    navigate("/listings");
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
          Join FashionCycle
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--muted)" }}>
          Create your account — it&apos;s free forever
        </p>
      </div>

      {/* 1-Click Role-Based Demo Access */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
        <button
          type="button"
          onClick={handleDemoBuyer}
          style={{
            width: "100%",
            background: "rgba(138,223,122,0.12)",
            border: "1px solid var(--accent)",
            color: "var(--accent)",
            borderRadius: "100px",
            padding: "0.8rem",
            fontSize: "0.9rem",
            fontWeight: 700,
            fontFamily: "var(--font-body)",
            cursor: "pointer",
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
          <span>🛍️</span> Quick Demo as Buyer
        </button>

        <button
          type="button"
          onClick={handleDemoSeller}
          style={{
            width: "100%",
            background: "rgba(234, 179, 8, 0.12)",
            border: "1px solid rgba(234, 179, 8, 0.45)",
            color: "#facc15",
            borderRadius: "100px",
            padding: "0.8rem",
            fontSize: "0.9rem",
            fontWeight: 700,
            fontFamily: "var(--font-body)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            transition: "transform 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.background = "rgba(234, 179, 8, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "rgba(234, 179, 8, 0.12)";
          }}
        >
          <span>🏷️</span> Quick Demo as Seller
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>OR CREATE AN ACCOUNT</span>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      </div>

      {/* Role Selection Tabs */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label
          style={{
            display: "block",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--muted)",
            letterSpacing: "0.08em",
            marginBottom: "0.5rem",
          }}
        >
          CHOOSE ACCOUNT ROLE *
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.6rem",
            background: "rgba(255,255,255,0.03)",
            padding: "4px",
            borderRadius: "14px",
            border: "1px solid var(--border)",
          }}
        >
          <button
            type="button"
            onClick={() => setRole("buyer")}
            style={{
              padding: "0.75rem 0.5rem",
              borderRadius: "10px",
              border: role === "buyer" ? "1px solid var(--accent)" : "1px solid transparent",
              background: role === "buyer" ? "rgba(138,223,122,0.14)" : "transparent",
              color: role === "buyer" ? "var(--accent)" : "var(--muted)",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              fontWeight: 700,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.2rem",
              transition: "all 0.2s",
            }}
          >
            <span>🛍️ Buyer</span>
            <span style={{ fontSize: "0.65rem", fontWeight: 500, opacity: 0.8 }}>Shop & Track Orders</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("seller")}
            style={{
              padding: "0.75rem 0.5rem",
              borderRadius: "10px",
              border: role === "seller" ? "1px solid #facc15" : "1px solid transparent",
              background: role === "seller" ? "rgba(234, 179, 8, 0.14)" : "transparent",
              color: role === "seller" ? "#facc15" : "var(--muted)",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              fontWeight: 700,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.2rem",
              transition: "all 0.2s",
            }}
          >
            <span>🏷️ Seller</span>
            <span style={{ fontSize: "0.65rem", fontWeight: 500, opacity: 0.8 }}>List Pieces & Sales</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label
            htmlFor="name"
            style={{
              display: "block",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--muted)",
              letterSpacing: "0.06em",
              marginBottom: "0.5rem",
            }}
          >
            FULL NAME
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Smith"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>

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
          <div style={{ position: "relative", width: "100%" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              style={{
                ...inputStyle,
                paddingRight: "2.75rem",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: "0.85rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                padding: "0.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: showPassword ? "var(--accent)" : "var(--muted)",
                transition: "color 0.2s ease, transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = showPassword ? "var(--accent)" : "var(--muted)")
              }
            >
              {showPassword ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
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
            background: loading ? "rgba(138,223,122,0.18)" : "var(--accent)",
            color: loading ? "var(--accent)" : "#0a0a08",
            border: loading ? "1px solid var(--accent)" : "none",
            borderRadius: "100px",
            padding: "0.9rem",
            fontSize: "1rem",
            fontWeight: 700,
            fontFamily: "var(--font-body)",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
            transition: "transform 0.2s ease, background 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {loading ? (
            <>
              <CircularLoader size={22} spinSpeedSeconds={3} style={{ padding: 0 }} />
              <span>Creating circular account…</span>
            </>
          ) : (
            "Create Account →"
          )}
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
        Already have an account?{" "}
        <Link
          to="/login"
          style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
