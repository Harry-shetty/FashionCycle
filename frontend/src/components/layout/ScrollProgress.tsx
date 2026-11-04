import { useState, useEffect } from "react";
import { BANNER_HEIGHT, NAVBAR_HEIGHT } from "../../utils/layoutConstants";

/**
 * ScrollProgress displays a glowing, luxury gradient progress line
 * at the top of the viewport (directly underneath the fixed Navbar)
 * that smoothly indicates page scroll depth.
 */
export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 20) {
            const current = (window.scrollY / totalHeight) * 100;
            setScrollProgress(Math.min(100, Math.max(0, current)));
          } else {
            setScrollProgress(0);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: BANNER_HEIGHT + NAVBAR_HEIGHT - 2,
        left: 0,
        width: "100%",
        height: "2.5px",
        zIndex: 999,
        pointerEvents: "none",
        background: "rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          width: `${scrollProgress}%`,
          height: "100%",
          background: "linear-gradient(90deg, var(--accent) 0%, #38bdf8 50%, #a78bfa 100%)",
          boxShadow: "0 0 10px rgba(138,223,122,0.7), 0 0 4px #38bdf8",
          transition: "width 0.08s ease-out",
          borderRadius: "0 2px 2px 0",
          opacity: scrollProgress > 0.5 ? 1 : 0,
        }}
      />
    </div>
  );
}

