import { BANNER_HEIGHT } from "../../utils/layoutConstants";

const items = [
  "♻ GIVE YOUR WARDROBE A NEW LIFE",
  "✦ 100% SUSTAINABLE FASHION",
  "♻ BUY · SELL · EXCHANGE",
  "✦ JOIN 120,000+ MEMBERS",
  "♻ ZERO WASTE FASHION",
  "✦ EARN WHILE YOU CLEAR YOUR CLOSET",
];
const doubled = [...items, ...items];

export default function Marquee() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        height: `${BANNER_HEIGHT}px`,
        background: "var(--accent)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid rgba(0,0,0,0.15)",
      }}
    >
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#0a0a08",
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
              paddingRight: "4rem",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
