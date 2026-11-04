import { useState } from "react";

/**
 * FashionCycle logo — bold wordmark with tracked subtitle.
 *
 * Usage:
 *   <FashionCycleLogo />
 *   <FashionCycleLogo size={48} />
 *
 * `size` scales the whole lockup (the "Fashion" line renders at
 * roughly 1.9x the given size in px). Colors are exposed as props
 * so the mark can be dropped onto light or dark surfaces.
 */
export default function FashionCycleLogo({
  size = 40,
  textColor = "#f5f5f0",
  accentColor = "#8AFF6B",
  background = undefined as string | undefined,
  className = "",
  style = {},
}) {
  const [hovered, setHovered] = useState(false);

  const mainFontSize = size * 1.9;
  const subFontSize = size * 1.3;

  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
        background,
        padding: background ? "1.5rem 1rem" : undefined,
        borderRadius: background ? 12 : undefined,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          fontWeight: 900,
          fontSize: mainFontSize,
          letterSpacing: -mainFontSize * 0.026,
          color: textColor,
          lineHeight: 0.9,
          textTransform: "uppercase",
          position: "relative",
          zIndex: 1,
          transform: hovered ? "scale(1.03)" : "scale(1)",
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        Fashion
      </div>
      <div
        style={{
          fontFamily: '"Brush Script MT", "Segoe Script", cursive',
          fontWeight: 400,
          fontSize: subFontSize,
          color: accentColor,
          marginTop: -mainFontSize * 0.29,
          position: "relative",
          zIndex: 2,
          transform: hovered ? "rotate(-2deg) translateX(4px)" : "rotate(-2deg)",
          transition: "transform 0.4s ease",
        }}
      >
        Cycle
      </div>
    </div>
  );
}
