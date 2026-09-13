import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      await register({ name, email, password });
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
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

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {[
          { id: "name", label: "FULL NAME", type: "text", value: name, onChange: setName, placeholder: "Jane Smith" },
          { id: "email", label: "EMAIL", type: "email", value: email, onChange: setEmail, placeholder: "you@example.com" },
          { id: "password", label: "PASSWORD", type: "password", value: password, onChange: setPassword, placeholder: "Min. 6 characters" },
        ].map((field) => (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "var(--muted)",
                letterSpacing: "0.06em",
                marginBottom: "0.5rem",
              }}
            >
              {field.label}
            </label>
            <input
              id={field.id}
              type={field.type}
              required
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder={field.placeholder}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>
        ))}

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
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {loading ? "Creating account…" : "Create Account →"}
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
