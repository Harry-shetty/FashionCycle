import React from "react";
import { useNavigate } from "react-router-dom";

export interface BackButtonProps {
  label?: string;
  fallback?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function BackButton({
  label = "Back",
  fallback = "/home",
  style,
  className = "",
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    // If the browser has back history within the app, go back. Otherwise fallback.
    if (window.history.state && typeof window.history.state.idx === "number" && window.history.state.idx > 0) {
      navigate(-1);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`fc-back-btn ${className}`}
      aria-label={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid var(--border)",
        color: "var(--fg)",
        padding: "0.45rem 1rem",
        borderRadius: "100px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.78rem",
        fontWeight: 600,
        letterSpacing: "0.03em",
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        textDecoration: "none",
        userSelect: "none",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.color = "var(--accent)";
        e.currentTarget.style.background = "rgba(138, 223, 122, 0.08)";
        e.currentTarget.style.transform = "translateX(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = "var(--fg)";
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
        e.currentTarget.style.transform = "translateX(0)";
      }}
    >
      <span style={{ fontSize: "0.95rem", lineHeight: 1 }}>←</span>
      <span>{label}</span>
    </button>
  );
}

