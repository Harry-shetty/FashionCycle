import React from "react";

interface CircularLoaderProps {
  /** Diameter of the circular badge in px (default: 80) */
  size?: number;
  /** Primary loading label displayed under the spinner */
  message?: string;
  /** Secondary subtle subtext displayed under the label */
  subtext?: string;
  /** Whether to render as a full page/viewport centered loader */
  fullScreen?: boolean;
  /** Circular text displayed around the rotating ring */
  ringText?: string;
  /** Spin animation speed in seconds (default: 10) */
  spinSpeedSeconds?: number;
  /** Optional custom container style */
  style?: React.CSSProperties;
}

/**
 * CircularLoader — Brand loader component featuring the FashionCycle
 * rotating "SUSTAINABLE · CIRCULAR · FASHION" eco-badge with central ♻ icon.
 */
export default function CircularLoader({
  size = 80,
  message,
  subtext,
  fullScreen = false,
  ringText = "SUSTAINABLE · CIRCULAR · FASHION · ",
  spinSpeedSeconds = 8,
  style,
}: CircularLoaderProps) {
  const containerStyle: React.CSSProperties = fullScreen
    ? {
        minHeight: "75vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "transparent",
        ...style,
      }
    : {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        ...style,
      };

  const id = React.useId().replace(/:/g, "_");
  const pathId = `circular_loader_path_${id}`;

  return (
    <div style={containerStyle} role="status" aria-label={message || "Loading"}>
      {/* Spinning Stamp Badge */}
      <div
        style={{
          width: size,
          height: size,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          style={{
            animation: `spin-slow ${spinSpeedSeconds}s linear infinite`,
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          <defs>
            <path
              id={pathId}
              d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            />
          </defs>

          {/* Outer ring */}
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.2"
            opacity="0.85"
          />

          {/* Circular text */}
          <text
            fill="var(--accent)"
            fontSize="10"
            fontFamily="var(--font-mono)"
            letterSpacing="2.5"
            fontWeight="700"
          >
            <textPath href={`#${pathId}`}>{ringText}</textPath>
          </text>

          {/* Center Green Disk */}
          <circle cx="50" cy="50" r="14.5" fill="var(--accent)" />

          {/* Center Recycle Symbol */}
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fill="#0a0a08"
            fontSize="16"
            fontFamily="var(--font-display)"
            fontWeight="800"
          >
            ♻
          </text>
        </svg>
      </div>

      {/* Message and Subtext */}
      {message && (
        <div
          style={{
            marginTop: "1.25rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            color: "var(--accent)",
            letterSpacing: "0.12em",
            fontWeight: 700,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      {subtext && (
        <div
          style={{
            marginTop: "0.35rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            color: "var(--muted)",
            textAlign: "center",
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
}

