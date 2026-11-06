import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import FashionCycleLogo from "../../components/shared/FashionCycleLogo";
import { useAuth } from "../../hooks/useAuth";
import { useStore } from "../../contexts/StoreContext";
import { useReveal } from "../../hooks/useReveal";
import { FEED, RECOMMENDED } from "../../data/mock";
import type { Listing } from "../../types/listing.types";
import { useLeaderboard } from "../../hooks/useLeaderboard";

/* ─── Animated counter ─── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        let start = 0;
        const step = target / 60;
        const t = setInterval(() => {
          start += step;
          if (start >= target) {
            setVal(target);
            clearInterval(t);
          } else setVal(Math.floor(start));
        }, 16);
      },
      { threshold: 0.5 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [target]);
  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Shared styles ─── */
const card = {
  background: "var(--card-bg)",
  border: "1px solid var(--border)",
  borderRadius: "18px",
};

/* ─── Welcome Banner ─── */
function WelcomeBanner() {
  const { user, isSeller, isBuyer } = useAuth();
  const { listings, orders, savedIds, openNewListingModal } = useStore();
  const navigate = useNavigate();

  const isDemo = user?.email === "harsha@gmail.com" || user?.email === "admin@gmail.com";
  const firstName = (user?.name || (isSeller ? "STUDIO" : "BUYER")).split(" ")[0].toUpperCase();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const userListings = isSeller ? listings.filter((l) => !l.sold) : [];
  const activeCount = isDemo ? (userListings.length || 5) : userListings.length;
  const inTransitCount = orders.filter((o) => o.status === "In Transit" || o.status === "Processing").length || (isDemo ? 1 : 0);
  const userOrdersCount = orders.length || (isDemo ? 4 : 0);

  // Synchronized leaderboard rank & badge from shared useLeaderboard hook
  const { currentUserData } = useLeaderboard("month");
  const leaderboardRank = currentUserData.rank > 0 ? `#${currentUserData.rank}` : "—";
  const leaderboardBadge = isDemo
    ? "✦ TOP 5%"
    : currentUserData.rank > 0 && currentUserData.rank <= 10
    ? "✦ TOP BUYER"
    : currentUserData.rank > 0
    ? "✦ ACTIVE BUYER"
    : "🌱 NEW BUYER";
  const leaderboardSubtext = currentUserData.rank > 0
    ? "View top buyers rank →"
    : "Join buyer leaderboard →";

  const statCards = isSeller
    ? [
        {
          id: "listings",
          count: activeCount,
          label: "Active Listings",
          badge: activeCount > 0 ? "✦ CIRCULATING" : "✦ READY",
          badgeColor: "var(--accent)",
          badgeBg: "rgba(138,223,122,0.14)",
          icon: "🏷️",
          subtext: activeCount > 0 ? "Manage wardrobe →" : "List your first item →",
          link: "/listings",
        },
        {
          id: "community",
          count: "24+",
          label: "Seller Community",
          badge: "✦ VERIFIED",
          badgeColor: "var(--accent)",
          badgeBg: "rgba(138,223,122,0.14)",
          icon: "👥",
          subtext: "Explore seller network →",
          link: "/community",
        },
        {
          id: "orders",
          count: inTransitCount,
          label: inTransitCount === 1 ? "Customer Dispatch" : "Customer Dispatches",
          badge: inTransitCount > 0 ? "🚚 EN ROUTE" : "✦ STANDBY",
          badgeColor: inTransitCount > 0 ? "#fbbf24" : "var(--accent)",
          badgeBg: inTransitCount > 0 ? "rgba(251,191,36,0.14)" : "rgba(138,223,122,0.14)",
          icon: "📦",
          subtext: inTransitCount > 0 ? "Fulfill orders →" : "View seller orders →",
          link: "/orders",
        },
      ]
    : [
        {
          id: "wishlist",
          count: savedIds.length,
          label: "Wishlist Saved",
          badge: savedIds.length > 0 ? "♥ CURATED" : "♥ EXPLORE",
          badgeColor: "var(--accent)",
          badgeBg: "rgba(138,223,122,0.14)",
          icon: "♥",
          subtext: savedIds.length > 0 ? "View your saved archive →" : "Discover pieces to save →",
          link: "/wishlist",
        },
        {
          id: "leaderboard",
          count: leaderboardRank,
          label: "Top Buyers Rank",
          badge: leaderboardBadge,
          badgeColor: "var(--accent)",
          badgeBg: "rgba(138,223,122,0.14)",
          icon: "🏆",
          subtext: leaderboardSubtext,
          link: "/leaderboard",
        },
        {
          id: "orders",
          count: inTransitCount > 0 ? inTransitCount : userOrdersCount,
          label: inTransitCount > 0
            ? (inTransitCount === 1 ? "Shipment En Route" : "Shipments En Route")
            : (userOrdersCount === 1 ? "Order Placed" : "Orders Placed"),
          badge: inTransitCount > 0
            ? "🚚 DELIVERING"
            : userOrdersCount > 0
            ? "✦ COMPLETED"
            : "✦ READY TO SHOP",
          badgeColor: inTransitCount > 0 ? "#fbbf24" : "var(--accent)",
          badgeBg: inTransitCount > 0 ? "rgba(251,191,36,0.14)" : "rgba(138,223,122,0.14)",
          icon: "📦",
          subtext: inTransitCount > 0
            ? "Track eco-delivery →"
            : userOrdersCount > 0
            ? "View order history →"
            : "Explore marketplace →",
          link: userOrdersCount > 0 ? "/orders" : "/shop",
        },
      ];

  return (
    <div
      className="rv welcome-banner-content"
      style={{
        ...card,
        background: "radial-gradient(ellipse at 85% 20%, rgba(138,223,122,0.15) 0%, rgba(13,31,13,0.85) 45%, #0d140e 100%)",
        border: "1px solid rgba(138,223,122,0.25)",
        boxShadow: "0 24px 60px -15px rgba(0,0,0,0.7), 0 0 35px rgba(138,223,122,0.06)",
        borderRadius: "24px",
        padding: "2.5rem 2.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "2.5rem",
        overflow: "hidden",
        position: "relative",
        marginBottom: "2rem",
      }}
    >
      {/* Floating Animated Ambient Glow Orbs */}
      <div
        style={{
          position: "absolute",
          right: -40,
          top: -40,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(138,223,122,0.18) 0%, transparent 65%)",
          filter: "blur(30px)",
          pointerEvents: "none",
          animation: "float 7s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "25%",
          bottom: -60,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,245,100,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          animation: "float-gentle 9s ease-in-out infinite alternate",
        }}
      />

      {/* Left Column: Greeting, Main Headline & Subtext */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "560px" }}>
        {/* Pulsing Status Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(138,223,122,0.08)",
            border: "1px solid rgba(138,223,122,0.25)",
            padding: "4px 12px",
            borderRadius: "100px",
            marginBottom: "0.85rem",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "var(--accent)",
              boxShadow: "0 0 8px var(--accent)",
              animation: "pulse-dot 2s infinite ease-in-out",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              color: "var(--accent)",
              letterSpacing: "0.12em",
              fontWeight: 700,
            }}
          >
            {greeting.toUpperCase()}, {firstName}
          </span>
          <span
            style={{
              display: "inline-block",
              color: "var(--accent)",
              fontSize: "0.75rem",
              animation: "spin-slow 16s linear infinite",
            }}
          >
            ✦
          </span>
        </div>

        {/* Elegant Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 3.8vw, 3.2rem)",
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.08,
            marginBottom: "0.85rem",
          }}
        >
          Your wardrobe,<br />
          <span
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, #c8f564 50%, #6ee7b7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontStyle: "italic",
              display: "inline-block",
            }}
          >
            working for you
          </span>
        </h1>

        {/* Informative Subtext */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.95rem",
            color: "var(--muted)",
            lineHeight: 1.6,
            marginBottom: "1.5rem",
            maxWidth: 480,
          }}
        >
          {isSeller ? (
            <>
              You are currently managing your inventory as a <strong style={{ color: "#facc15" }}>Verified Seller</strong> with <strong style={{ color: "var(--fg)" }}>{activeCount} active listings</strong> and <strong style={{ color: "var(--fg)" }}>{inTransitCount} customer dispatch</strong>.
            </>
          ) : (
            <>
              You are exploring the circular wardrobe as a <strong style={{ color: "var(--accent)" }}>Conscious Buyer</strong>, with <strong style={{ color: "var(--fg)" }}>{inTransitCount} order tracked</strong> and <strong style={{ color: "var(--accent)" }}>Rank #4 on Top Buyers Leaderboard</strong>.
            </>
          )}
        </p>

        {/* Quick Action Pill Buttons for Seller only */}
        {isSeller && (
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={() => openNewListingModal()}
              style={{
                background: "var(--accent)",
                color: "#0a0a08",
                border: "none",
                borderRadius: "100px",
                padding: "0.65rem 1.4rem",
                fontSize: "0.88rem",
                fontWeight: 700,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 6px 20px rgba(138,223,122,0.3)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(138,223,122,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(138,223,122,0.3)";
              }}
            >
              <span>+</span> List New Item (Seller)
            </button>

            <button
              onClick={() => navigate("/listings")}
              style={{
                background: "rgba(255,255,255,0.04)",
                color: "var(--fg)",
                border: "1px solid var(--border)",
                borderRadius: "100px",
                padding: "0.65rem 1.25rem",
                fontSize: "0.88rem",
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "border-color 0.2s ease, background 0.2s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#facc15";
                e.currentTarget.style.background = "rgba(234,179,8,0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span>Manage Inventory</span>
              <span style={{ color: "#facc15" }}>→</span>
            </button>
          </div>
        )}
      </div>

      {/* Right Column: 3 Enhanced Interactive Metric Cards */}
      <div
        className="welcome-stats-row"
        style={{
          display: "flex",
          gap: "1.1rem",
          position: "relative",
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        {statCards.map((cardItem, idx) => (
          <div
            key={cardItem.id}
            onClick={() => navigate(cardItem.link)}
            className="welcome-stat-pill"
            style={{
              background: "rgba(15, 23, 16, 0.65)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(138,223,122,0.2)",
              borderRadius: "18px",
              padding: "1.25rem 1.2rem",
              width: "182px",
              minWidth: "172px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s, box-shadow 0.25s, background 0.25s",
              animation: `fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1}s backwards`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.background = "rgba(20, 36, 22, 0.85)";
              e.currentTarget.style.boxShadow = "0 18px 36px -8px rgba(138,223,122,0.2), 0 0 1px 1px rgba(138,223,122,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.borderColor = "rgba(138,223,122,0.2)";
              e.currentTarget.style.background = "rgba(15, 23, 16, 0.65)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
            }}
          >
            {/* Top row: Status Badge & Floating Animated Icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.95rem",
                gap: "10px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.58rem",
                  color: cardItem.badgeColor,
                  background: cardItem.badgeBg,
                  border: `1px solid ${cardItem.badgeColor}40`,
                  padding: "3px 9px",
                  borderRadius: "100px",
                  letterSpacing: "0.05em",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  lineHeight: 1.2,
                  flexShrink: 0,
                }}
              >
                {cardItem.badge}
              </span>
              <span
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontSize: "1.05rem",
                  lineHeight: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  animation: "float-gentle 3.2s ease-in-out infinite",
                  animationDelay: `${idx * 0.4}s`,
                  filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))",
                }}
              >
                {cardItem.icon}
              </span>
            </div>

            {/* Middle: Big Animated Counter & Label */}
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.2rem",
                  fontWeight: 900,
                  color: "var(--fg)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  marginBottom: "0.35rem",
                }}
              >
                {cardItem.count}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  color: "var(--fg)",
                  fontWeight: 600,
                  lineHeight: 1.25,
                }}
              >
                {cardItem.label}
              </div>
            </div>

            {/* Bottom: Subtle Action Subtext */}
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.64rem",
                color: "var(--accent)",
                marginTop: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                whiteSpace: "nowrap",
              }}
            >
              <span>{cardItem.subtext}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Stats Row ─── */
function StatsRow() {
  const { impact, listings, orders } = useStore();
  const { user, isSeller } = useAuth();
  const navigate = useNavigate();

  const isDemo = user?.email === "harsha@gmail.com" || user?.email === "admin@gmail.com";

  // Calculate dynamic delivered earnings strictly from delivered customer orders
  const isOrderDelivered = (status?: string) => {
    const s = (status || "").toLowerCase().trim();
    return s.includes("deliver") || s.includes("complete") || s.includes("received");
  };
  const deliveredOrders = orders.filter((o) => isOrderDelivered(o.status));
  const deliveredEarnings = deliveredOrders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);

  const userSavings = (impact.money !== undefined && impact.money !== null && impact.money > 0)
    ? impact.money
    : (isDemo ? 480 : 0);

  const userWater = (impact.water !== undefined && impact.water !== null && impact.water > 0)
    ? impact.water
    : (isDemo ? (isSeller ? 3600 : 2400) : 0);

  const userCo2 = (impact.co2 !== undefined && impact.co2 !== null && impact.co2 > 0)
    ? Math.round(impact.co2)
    : (isDemo ? (isSeller ? 74 : 48) : 0);

  const userEarnings = isSeller
    ? (deliveredEarnings > 0
        ? deliveredEarnings
        : ((impact.money !== undefined && impact.money !== null && impact.money > 0)
            ? impact.money
            : (isDemo ? 1240 : 0)))
    : ((impact.money !== undefined && impact.money !== null && impact.money > 0)
        ? impact.money
        : (isDemo ? 1240 : 0));

  const userOrdersCount = orders.length > 0
    ? orders.length
    : (isDemo ? (isSeller ? 5 : 4) : 0);

  const activeDeliveries = orders.filter((o) => o.status === "In Transit" || o.status === "Processing").length;
  const userActiveDeliveries = orders.length > 0
    ? activeDeliveries
    : (isDemo ? 1 : 0);

  const stats = isSeller
    ? [
        {
          label: "Total Earnings",
          value: userEarnings,
          prefix: "",
          suffix: "₹",
          trend: deliveredOrders.length > 0
            ? `${deliveredOrders.length} orders delivered · Settled`
            : (userEarnings > 0 ? "+124₹ this month" : "Start selling to earn"),
          up: userEarnings > 0,
          link: "/orders",
        },
        {
          label: "Items Listed",
          value: listings.length,
          prefix: "",
          suffix: " pcs",
          trend: `${listings.filter((l) => !l.sold).length} active in stock`,
          up: true,
          link: "/listings",
        },
        {
          label: "Water Diverted",
          value: impact.water,
          prefix: "",
          suffix: " L",
          trend: impact.water > 0 ? "Top 5% of community" : "Conserve water with reuse",
          up: impact.water > 0,
          link: "/impact",
        },
        {
          label: "CO₂ Avoided",
          value: Math.round(impact.co2),
          prefix: "",
          suffix: " kg",
          trend: impact.co2 > 0 ? "Verified carbon offset" : "Zero emissions generated",
          up: impact.co2 > 0,
          link: "/impact",
        },
      ]
    : [
        {
          label: "Circular Savings",
          value: userSavings,
          prefix: "",
          suffix: "₹",
          trend: userSavings > 0 ? "↑ Saved vs buying retail" : "Start your circular wardrobe",
          up: userSavings > 0,
          link: "/impact",
        },
        {
          label: "Orders Tracked",
          value: userOrdersCount,
          prefix: "",
          suffix: userOrdersCount === 1 ? " order" : " orders",
          trend: userOrdersCount > 0
            ? (userActiveDeliveries > 0
                ? `↑ ${userActiveDeliveries} active ${userActiveDeliveries === 1 ? "delivery" : "deliveries"}`
                : "All orders delivered")
            : "No orders placed yet",
          up: userOrdersCount > 0,
          link: "/orders",
        },
        {
          label: "Water Conserved",
          value: userWater,
          prefix: "",
          suffix: " L",
          trend: userWater > 0 ? "↑ Freshwater preserved" : "Conserve water with each order",
          up: userWater > 0,
          link: "/impact",
        },
        {
          label: "CO₂ Prevented",
          value: userCo2,
          prefix: "",
          suffix: " kg",
          trend: userCo2 > 0 ? "↑ Your conscious footprint" : "Reduce carbon by thrifting",
          up: userCo2 > 0,
          link: "/impact",
        },
      ];

  return (
    <div
      className="stats-grid-4"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="rv stat-card-item"
          data-d={i * 80}
          onClick={() => navigate(s.link)}
          style={{
            ...card,
            padding: "1.5rem",
            cursor: "pointer",
            transition: "transform 0.3s ease, border-color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(138,223,122,0.3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "var(--muted)",
              letterSpacing: "0.08em",
              marginBottom: "0.75rem",
            }}
          >
            {s.label.toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "var(--fg)",
              lineHeight: 1,
            }}
          >
            {s.prefix}
            <Counter target={s.value} suffix={s.suffix} />
          </div>
          <div
            style={{
              marginTop: "0.6rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                color: s.up ? "var(--accent)" : "#f87171",
                fontFamily: "var(--font-mono)",
              }}
            >
              {s.up ? "↑" : "↓"} {s.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── My Listings ─── */
function MyListings() {
  const { listings, openItemModal, openNewListingModal } = useStore();
  const [filter, setFilter] = useState<"all" | "active" | "sold">("all");
  const navigate = useNavigate();

  const filtered = listings.filter((l) => {
    if (filter === "active") return !l.sold;
    if (filter === "sold") return l.sold;
    return true;
  });

  return (
    <div className="card-pad" style={{ ...card, padding: "1.75rem", marginBottom: "1.5rem", opacity: 1 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "var(--accent)",
              letterSpacing: "0.1em",
              marginBottom: "0.3rem",
            }}
          >
            MY CLOSET · {listings.length} PIECES
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Active Listings
          </h2>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {(["all", "active", "sold"] as const).map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "0.42rem 1.1rem",
                  borderRadius: "100px",
                  border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                  background: active ? "rgba(138,223,122,0.18)" : "transparent",
                  color: active ? "var(--accent)" : "var(--muted)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textTransform: "capitalize",
                  boxShadow: active ? "0 0 12px rgba(138,223,122,0.25)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "var(--fg)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "var(--muted)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }
                }}
              >
                {active && <span style={{ marginRight: 6 }}>●</span>}
                {f}
              </button>
            );
          })}
          <button
            onClick={openNewListingModal}
            style={{
              background: "var(--accent)",
              color: "#0a0a08",
              border: "none",
              borderRadius: "100px",
              padding: "0.4rem 1rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            + New
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "2.5rem 1.5rem",
            background: "rgba(255, 255, 255, 0.02)",
            borderRadius: "14px",
            border: "1px dashed var(--border)",
          }}
        >
          <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>👗</div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              fontWeight: 700,
              marginBottom: "0.35rem",
            }}
          >
            {filter === "sold"
              ? "No sold pieces yet"
              : filter === "active"
              ? "No active listings right now"
              : "Your wardrobe is waiting to be listed"}
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              color: "var(--muted)",
              maxWidth: 380,
              margin: "0 auto 1.25rem",
              lineHeight: 1.5,
            }}
          >
            {filter === "sold"
              ? "When pieces you list are purchased by fellow circular fashion lovers, they appear here."
              : "Give clothes a circular second life, reduce landfill carbon, and earn circular credits."}
          </p>
          <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center" }}>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                style={{
                  background: "transparent",
                  color: "var(--fg)",
                  border: "1px solid var(--border)",
                  borderRadius: "100px",
                  padding: "0.45rem 1.1rem",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                View All Pieces
              </button>
            )}
            <button
              onClick={openNewListingModal}
              style={{
                background: "var(--accent)",
                color: "#0a0a08",
                border: "none",
                borderRadius: "100px",
                padding: "0.45rem 1.25rem",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + List an Item Now
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="four-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {filtered.slice(0, 4).map((item) => {
              const imageSrc =
                (item.images && item.images.length > 0 && item.images[0]) ||
                (item as any).img ||
                "https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=600&h=800&fit=crop&auto=format";

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    opacity: 1,
                    transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <div
                    style={{
                      aspectRatio: "3/4",
                      borderRadius: "14px",
                      overflow: "hidden",
                      background: "#1a1a14",
                      marginBottom: "0.75rem",
                      position: "relative",
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    {item.sold && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(10,10,8,0.65)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: "var(--accent)",
                            letterSpacing: "0.12em",
                            border: "1px solid var(--accent)",
                            padding: "0.3rem 0.8rem",
                            borderRadius: "100px",
                          }}
                        >
                          SOLD
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0.5rem",
                        right: "0.5rem",
                        background: "rgba(10,10,8,0.85)",
                        borderRadius: "100px",
                        padding: "0.25rem 0.65rem",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "var(--accent)",
                      }}
                    >
                      {item.price}₹
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      marginBottom: "0.2rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      color: "var(--muted)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item.brand} · {item.size}
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length > 4 && (
            <div style={{ marginTop: "1.25rem", textAlign: "right" }}>
              <button
                onClick={() => navigate("/listings")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--accent)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                View all {filtered.length} closet pieces →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Buyer Curated Drops (Buyer Home Component) ─── */
function BuyerCuratedDrops() {
  const { listings, openItemModal, savedIds, toggleSave } = useStore();
  const [selectedCat, setSelectedCat] = useState("All");
  const navigate = useNavigate();

  const available = listings.filter((l) => !l.sold);
  const filtered = selectedCat === "All" ? available : available.filter((l) => l.category === selectedCat);

  const categories = ["All", "Jackets", "Denim", "Long Coats", "Tees & Tops", "Sweaters"];

  return (
    <div className="card-pad" style={{ ...card, padding: "1.75rem", marginBottom: "1.5rem", opacity: 1 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "var(--accent)",
              letterSpacing: "0.1em",
              marginBottom: "0.3rem",
            }}
          >
            BUYER MARKETPLACE · {available.length} AVAILABLE FOR PURCHASE
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Fresh Circular Drops
          </h2>
        </div>

        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                padding: "0.3rem 0.75rem",
                borderRadius: "100px",
                border: "none",
                background: selectedCat === c ? "var(--accent)" : "rgba(255,255,255,0.05)",
                color: selectedCat === c ? "#0a0a08" : "var(--muted)",
                cursor: "pointer",
                fontWeight: selectedCat === c ? 700 : 500,
                transition: "all 0.2s ease",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--muted)" }}>
          <p>No circular pieces found in this category.</p>
        </div>
      ) : (
        <div
          className="four-col-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {filtered.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s, border-color 0.2s",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(138,223,122,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div style={{ aspectRatio: "4/5", position: "relative", overflow: "hidden", background: "#141410" }}>
                <img
                  src={item.images[0]}
                  alt={item.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "0.6rem",
                    left: "0.6rem",
                    background: "rgba(10,10,8,0.75)",
                    backdropFilter: "blur(6px)",
                    borderRadius: "100px",
                    padding: "0.2rem 0.55rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    color: "var(--muted)",
                  }}
                >
                  {item.category}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(item.id);
                  }}
                  style={{
                    position: "absolute",
                    top: "0.6rem",
                    right: "0.6rem",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(10,10,8,0.75)",
                    backdropFilter: "blur(6px)",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    color: savedIds.includes(item.id) ? "var(--accent)" : "var(--muted)",
                  }}
                  title={savedIds.includes(item.id) ? "Remove from wishlist" : "Save to wishlist"}
                >
                  {savedIds.includes(item.id) ? "♥" : "♡"}
                </button>
                <div
                  style={{
                    position: "absolute",
                    bottom: "0.6rem",
                    right: "0.6rem",
                    background: "rgba(10,10,8,0.85)",
                    borderRadius: "100px",
                    padding: "0.25rem 0.7rem",
                    fontFamily: "var(--font-display)",
                    fontSize: "0.95rem",
                    fontWeight: 800,
                    color: "var(--accent)",
                  }}
                >
                  {item.price}₹
                </div>
              </div>

              <div style={{ padding: "1rem", display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--fg)" }}>
                  {item.title}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)", marginBottom: "0.85rem" }}>
                  {item.brand} · Size {item.size} · {item.condition}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${item.id}`);
                  }}
                  style={{
                    marginTop: "auto",
                    width: "100%",
                    background: "var(--accent)",
                    color: "#0a0a08",
                    border: "none",
                    borderRadius: "100px",
                    padding: "0.55rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ⚡ View & Buy ({item.price}₹)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Two-column: Orders + Leaderboard ─── */
function OrdersAndLeaderboard() {
  const { orders, openOrderTrackingModal } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { list, currentUserData, isDemo } = useLeaderboard("month");

  const statusColor: Record<string, string> = {
    Delivered: "var(--accent)",
    "In Transit": "#fbbf24",
    Processing: "#60a5fa",
  };

  const topLeaders = list.slice(0, 4);

  return (
    <div
      className="two-col-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      {/* Orders Column */}
      <div className="rv-l card-pad" style={{ ...card, padding: "1.75rem" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--accent)",
            letterSpacing: "0.1em",
            marginBottom: "0.3rem",
          }}
        >
          PURCHASES
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.3rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "1.25rem",
          }}
        >
          Recent Orders
        </h2>

        {orders.length === 0 ? (
          <div
            style={{
              padding: "2.5rem 1.5rem",
              textAlign: "center",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "14px",
              border: "1px dashed var(--border)",
              marginTop: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: "0.6rem" }}>🛍️</div>
            <div style={{ color: "var(--fg)", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.3rem" }}>
              No orders placed yet
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", maxWidth: "280px", margin: "0 auto" }}>
              Explore curated circular drops to track and receive your sustainable items.
            </div>
          </div>
        ) : (
          orders.slice(0, 3).map((o, i) => (
            <div
              key={o.id}
              onClick={() => openOrderTrackingModal(o)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.85rem 0",
                borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "10px",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "#1a1a14",
                }}
              >
                <img
                  src={o.img}
                  alt={o.item}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "var(--fg)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {o.item}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.62rem",
                    color: "var(--muted)",
                    marginTop: "2px",
                  }}
                >
                  {o.id} · {o.date}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "var(--fg)",
                  }}
                >
                  {o.price}₹
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.62rem",
                    color: statusColor[o.status] || "var(--muted)",
                    marginTop: "2px",
                  }}
                >
                  {o.status}
                </div>
              </div>
            </div>
          ))
        )}

        <button
          onClick={() => navigate("/orders")}
          style={{
            marginTop: "1rem",
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--muted)",
            padding: "0.55rem 1.25rem",
            borderRadius: "100px",
            fontSize: "0.8rem",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            width: "100%",
            transition: "color 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--fg)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--muted)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          View all orders →
        </button>
      </div>

      {/* Leaderboard Column */}
      <div className="rv-r card-pad" style={{ ...card, padding: "1.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "var(--accent)",
              letterSpacing: "0.1em",
            }}
          >
            TOP BUYERS RANKINGS
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              background: "rgba(138,223,122,0.12)",
              color: "var(--accent)",
              padding: "2px 8px",
              borderRadius: "100px",
              fontWeight: 700,
            }}
          >
            MONTHLY
          </span>
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.3rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "1.25rem",
          }}
        >
          🏆 Top Buyers Leaderboard
        </h2>

        {/* Top Leaders */}
        {topLeaders.map((leader, i) => {
          const medal = leader.rank === 1 ? "🥇" : leader.rank === 2 ? "🥈" : leader.rank === 3 ? "🥉" : "🌿";
          return (
            <div
              key={leader.handle}
              onClick={() => navigate("/leaderboard")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 0",
                borderBottom: i < topLeaders.length - 1 ? "1px solid var(--border)" : "none",
                cursor: "pointer",
                background: leader.isCurrentUser ? "rgba(138,223,122,0.06)" : "transparent",
                borderRadius: leader.isCurrentUser ? "10px" : "0",
                paddingLeft: leader.isCurrentUser ? "8px" : "0",
                paddingRight: leader.isCurrentUser ? "8px" : "0",
                transition: "background 0.2s, opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {/* Rank / Medal */}
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", width: "24px", textAlign: "center" }}>
                {medal}
              </div>

              {/* Avatar */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: leader.isCurrentUser
                    ? "linear-gradient(135deg,var(--accent),var(--accent2))"
                    : "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  color: leader.isCurrentUser ? "#0a0a08" : "var(--fg)",
                  flexShrink: 0,
                }}
              >
                {leader.avatar}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.85rem", color: "var(--fg)" }}>
                    {leader.name}
                  </span>
                  {leader.isCurrentUser && (
                    <span style={{ background: "var(--accent)", color: "#0a0a08", fontSize: "0.55rem", fontWeight: 800, padding: "1px 5px", borderRadius: "100px", fontFamily: "var(--font-mono)" }}>
                      YOU
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)" }}>
                  {leader.itemsCycled} cycled · {leader.badge}
                </div>
              </div>

              {/* CO2 Saved & Points */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", color: "var(--accent)" }}>
                  {leader.co2Saved} kg
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--muted)" }}>
                  {leader.points.toLocaleString()} PTS
                </div>
              </div>
            </div>
          );
        })}

        {user && !topLeaders.some((l) => l.isCurrentUser) && (
          <div
            onClick={() => navigate("/leaderboard")}
            style={{
              marginTop: "0.85rem",
              padding: "0.65rem 0.85rem",
              borderRadius: "10px",
              background: "rgba(138,223,122,0.06)",
              border: "1px dashed rgba(138,223,122,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "#0a0a08",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  fontFamily: "var(--font-display)",
                }}
              >
                {currentUserData.avatar}
              </div>
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--fg)" }}>
                  {currentUserData.name}
                </div>
                <div style={{ fontSize: "0.62rem", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                  {currentUserData.itemsCycled > 0
                    ? `${currentUserData.itemsCycled} cycled · ${currentUserData.badge}`
                    : "0 cycled · 🌱 New Cycler"}
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: "var(--accent)",
                  fontWeight: 700,
                }}
              >
                {currentUserData.rank > 0 ? `#${currentUserData.rank}` : "Unranked"}
              </span>
              <div style={{ fontSize: "0.58rem", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                {currentUserData.co2Saved > 0
                  ? `${currentUserData.co2Saved} kg · ${currentUserData.points.toLocaleString()} pts`
                  : "Start thrifting"}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate("/leaderboard")}
          style={{
            marginTop: "1rem",
            background: "rgba(138,223,122,0.08)",
            border: "1px solid rgba(138,223,122,0.25)",
            color: "var(--accent)",
            padding: "0.55rem 1.25rem",
            borderRadius: "100px",
            fontSize: "0.8rem",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            width: "100%",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--accent)";
            e.currentTarget.style.color = "#0a0a08";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(138,223,122,0.08)";
            e.currentTarget.style.color = "var(--accent)";
          }}
        >
          View Full Buyers Leaderboard 🏆 →
        </button>
      </div>
    </div>
  );
}

/* ─── Activity Feed ─── */
function ActivityFeed() {
  const { openItemModal, savedIds, toggleSave } = useStore();
  const navigate = useNavigate();

  return (
    <div className="rv card-pad" style={{ ...card, padding: "1.75rem", marginBottom: "1.5rem" }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: "var(--accent)",
          letterSpacing: "0.1em",
          marginBottom: "0.3rem",
        }}
      >
        FOLLOWING
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.4rem",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          marginBottom: "1.25rem",
        }}
      >
        Activity Feed
      </h2>
      <div className="four-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {FEED.map((f, i) => {
          const mockListing: Listing = {
            id: `feed-${i}`,
            title: f.item,
            brand: f.user,
            size: "M",
            condition: "Excellent",
            category: "Outerwear",
            price: f.price,
            images: [f.img],
            sellerId: f.handle,
            createdAt: new Date().toISOString(),
            sold: false,
          };
          const isSaved = savedIds.includes(mockListing.id);

          return (
            <div
              key={i}
              className="rv-s"
              data-d={i * 80}
              onClick={() => navigate(`/product/${mockListing.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div
                style={{
                  aspectRatio: "3/4",
                  borderRadius: "14px",
                  overflow: "hidden",
                  position: "relative",
                  background: "#1a1a14",
                  marginBottom: "0.75rem",
                }}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                  if (img) img.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                  if (img) img.style.transform = "scale(1)";
                }}
              >
                <img
                  src={f.img}
                  alt={f.item}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(mockListing.id);
                  }}
                  style={{
                    position: "absolute",
                    top: "0.6rem",
                    right: "0.6rem",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(10,10,8,0.7)",
                    backdropFilter: "blur(8px)",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isSaved ? "var(--accent)" : "var(--fg)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {isSaved ? "♥" : "♡"}
                </button>
                <div
                  style={{
                    position: "absolute",
                    bottom: "0.6rem",
                    left: "0.6rem",
                    right: "0.6rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,var(--accent),var(--accent2))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "0.6rem",
                      color: "#0a0a08",
                      flexShrink: 0,
                    }}
                  >
                    {f.avatar}
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.72rem",
                      color: "rgba(255,255,255,0.85)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {f.user}
                  </span>
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    color: "var(--muted)",
                    letterSpacing: "0.04em",
                    marginBottom: "0.25rem",
                  }}
                >
                  {f.action} · {f.time}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    marginBottom: "0.15rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {f.item}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    color: "var(--accent)",
                    fontWeight: 600,
                  }}
                >
                  {f.price}₹
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Recommended ─── */
function Recommended() {
  const { openItemModal, savedIds, toggleSave } = useStore();
  const navigate = useNavigate();

  return (
    <div className="rv card-pad" style={{ ...card, padding: "1.75rem", marginBottom: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "var(--accent)",
              letterSpacing: "0.1em",
              marginBottom: "0.3rem",
            }}
          >
            CURATED FOR YOU
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Recommended
          </h2>
        </div>
        <button
          onClick={() => navigate("/community")}
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--muted)",
            padding: "0.45rem 1.1rem",
            borderRadius: "100px",
            fontSize: "0.8rem",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            transition: "color 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--fg)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--muted)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          See all →
        </button>
      </div>

      <div className="four-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {RECOMMENDED.map((item, i) => {
          const mockListing: Listing = {
            id: `rec-${i}`,
            title: item.title,
            brand: item.brand,
            size: item.size,
            condition: item.condition as any,
            category: "Outerwear",
            price: item.price,
            images: [item.img],
            sellerId: "curated-drop",
            createdAt: new Date().toISOString(),
            sold: false,
          };
          const isSaved = savedIds.includes(mockListing.id);

          return (
            <div
              key={i}
              className="rv-s"
              data-d={i * 80}
              onClick={() => navigate(`/product/${mockListing.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div
                style={{
                  aspectRatio: "3/4",
                  borderRadius: "14px",
                  overflow: "hidden",
                  background: "#1a1a14",
                  marginBottom: "0.75rem",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                  if (img) img.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                  if (img) img.style.transform = "scale(1)";
                }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "0.6rem",
                    left: "0.6rem",
                    background: "rgba(10,10,8,0.8)",
                    backdropFilter: "blur(6px)",
                    borderRadius: "100px",
                    padding: "0.2rem 0.6rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    color: item.condition === "Like New" ? "var(--accent)" : "var(--fg)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.condition}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(mockListing.id);
                  }}
                  style={{
                    position: "absolute",
                    top: "0.5rem",
                    right: "0.5rem",
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(10,10,8,0.7)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isSaved ? "var(--accent)" : "var(--fg)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {isSaved ? "♥" : "♡"}
                </button>
                <div
                  style={{
                    position: "absolute",
                    bottom: "0.5rem",
                    right: "0.5rem",
                    background: "var(--accent)",
                    borderRadius: "100px",
                    padding: "0.25rem 0.75rem",
                    fontFamily: "var(--font-display)",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#0a0a08",
                  }}
                >
                  {item.price}₹
                </div>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  color: "var(--muted)",
                  letterSpacing: "0.04em",
                  marginBottom: "0.2rem",
                }}
              >
                {item.brand} · {item.size}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Impact Tracker ─── */
function ImpactTracker() {
  const { impact } = useStore();
  const navigate = useNavigate();

  return (
    <div
      className="rv card-pad"
      onClick={() => navigate("/impact")}
      style={{
        ...card,
        background: "linear-gradient(135deg,#0a1a0a,#121a08)",
        border: "1px solid rgba(138,223,122,0.15)",
        padding: "1.75rem",
        marginBottom: "1.5rem",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: "var(--accent)",
          letterSpacing: "0.1em",
          marginBottom: "0.3rem",
        }}
      >
        SUSTAINABILITY · CLICK TO VIEW REPORT →
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.4rem",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          marginBottom: "1.5rem",
        }}
      >
        Your Impact
      </h2>
      <div className="four-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {[
          { label: "CO₂ Prevented", value: impact.co2, unit: "kg", icon: "🌿", desc: "Carbon kept out of atmosphere" },
          { label: "Water Saved", value: impact.water, unit: "L", icon: "💧", desc: "Litres vs producing new clothing" },
          { label: "Items Rescued", value: impact.items, unit: "pcs", icon: "♻", desc: "Garments saved from landfill" },
          { label: "Money Earned", value: impact.money, unit: "₹", icon: "💚", desc: "Earned back from selling" },
        ].map((s, i) => (
          <div
            key={s.label}
            className="rv-s"
            data-d={i * 80}
            style={{
              background: "rgba(138,223,122,0.06)",
              border: "1px solid rgba(138,223,122,0.15)",
              borderRadius: "14px",
              padding: "1.25rem",
              transition: "background 0.3s, transform 0.3s",
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{s.icon}</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.8rem",
                fontWeight: 900,
                color: "var(--accent)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              <Counter target={Math.round(s.value)} suffix={` ${s.unit}`} />
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "var(--fg)",
                marginTop: "0.4rem",
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--muted)",
                marginTop: "0.2rem",
                lineHeight: 1.4,
              }}
            >
              {s.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Trending & Community ─── */
function TrendingAndCommunity() {
  const navigate = useNavigate();
  const { isSeller } = useAuth();
  const trending = [
    { rank: 1, label: "Y2K Denim", count: "4.2K pieces", delta: "+22%", category: "Denim" },
    { rank: 2, label: "Quiet Luxury Outerwear", count: "3.8K pieces", delta: "+18%", category: "Outerwear" },
    { rank: 3, label: "Silk Wraps", count: "2.9K pieces", delta: "+31%", category: "Dresses" },
    { rank: 4, label: "European Linen Tops", count: "2.1K pieces", delta: "+12%", category: "Tops & Tees" },
  ];
  const community = [
    { user: "Aarav Mehta", handle: "@aaravcycles", specialty: "Selvedge Denim Studio", followers: "1.6K", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format" },
    { user: "Priya Nair", handle: "@priyaonrepeat", specialty: "Silk & Blazer Archives", followers: "1.4K", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format" },
    { user: "Elena Rostova", handle: "@elenavintage", specialty: "European Wool & Knits", followers: "1.2K", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&auto=format" },
  ];
  const [follows, setFollows] = useState<Record<number, boolean>>({ 1: true });

  return (
    <div
      className="two-col-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      {/* Trending */}
      <div className="rv-l card-pad" style={{ ...card, padding: "1.75rem" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--accent)",
            letterSpacing: "0.1em",
            marginBottom: "0.3rem",
          }}
        >
          RIGHT NOW · CLICK TO BROWSE
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.3rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "1.25rem",
          }}
        >
          Trending Styles
        </h2>
        {trending.map((t, i) => (
          <div
            key={t.rank}
            onClick={() => {
              if (isSeller) {
                navigate("/listings");
              } else {
                navigate(`/shop?category=${encodeURIComponent(t.category)}`);
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.75rem 0",
              borderBottom: i < trending.length - 1 ? "1px solid var(--border)" : "none",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 900,
                color: i === 0 ? "var(--accent)" : "rgba(255,255,255,0.12)",
                width: 32,
                textAlign: "center",
                lineHeight: 1,
              }}
            >
              {t.rank < 10 ? `0${t.rank}` : t.rank}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "var(--fg)",
                }}
              >
                {t.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  color: "var(--muted)",
                  marginTop: "2px",
                }}
              >
                {t.count}
              </div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent)" }}>
              {t.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Community */}
      <div className="rv-r card-pad" style={{ ...card, padding: "1.75rem" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--accent)",
            letterSpacing: "0.1em",
            marginBottom: "0.3rem",
          }}
        >
          TOP SELLERS TO FOLLOW
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.3rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "1.25rem",
          }}
        >
          Seller Community
        </h2>
        {community.map((c, i) => (
          <div
            key={c.user}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.85rem 0",
              borderBottom: i < community.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                overflow: "hidden",
                flexShrink: 0,
                background: "#1a1a14",
              }}
            >
              <img src={c.img} alt={c.user} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "var(--fg)",
                }}
              >
                {c.user}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  color: "var(--muted)",
                  marginTop: "2px",
                }}
              >
                {c.handle} · {c.specialty} · {c.followers} followers
              </div>
            </div>
            <button
              onClick={() => setFollows((p) => ({ ...p, [i]: !p[i] }))}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "100px",
                border: "1px solid",
                borderColor: follows[i] ? "var(--border)" : "var(--accent)",
                background: follows[i] ? "transparent" : "rgba(138,223,122,0.12)",
                color: follows[i] ? "var(--muted)" : "var(--accent)",
                fontFamily: "var(--font-body)",
                fontSize: "0.78rem",
                cursor: "pointer",
                transition: "all 0.2s",
                fontWeight: 500,
              }}
            >
              {follows[i] ? "Following" : "Follow"}
            </button>
          </div>
        ))}
        <button
          onClick={() => navigate("/community")}
          style={{
            marginTop: "1rem",
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--muted)",
            padding: "0.55rem 1.25rem",
            borderRadius: "100px",
            fontSize: "0.8rem",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            width: "100%",
            transition: "color 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--fg)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--muted)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          View All Top Sellers &amp; Studios →
        </button>
      </div>
    </div>
  );
}

/* ─── Sell Prompt Banner ─── */
function SellPrompt() {
  const { openNewListingModal } = useStore();

  return (
    <div
      className="rv sell-prompt-container"
      style={{
        borderRadius: "18px",
        overflow: "hidden",
        position: "relative",
        marginBottom: "1.5rem",
        height: 200,
        display: "flex",
        alignItems: "center",
        background: "#0a0a08",
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1624192647570-1131acc12ccf?w=1400&h=400&fit=crop&auto=format"
        alt="Clothing rack"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(10,10,8,0.95) 0%, rgba(10,10,8,0.4) 100%)",
        }}
      />
      <div
        className="sell-prompt-inner"
        style={{
          position: "relative",
          padding: "0 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--accent)",
              letterSpacing: "0.1em",
              marginBottom: "0.5rem",
            }}
          >
            CLEAR YOUR CLOSET
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.8rem",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Ready to list your next piece?
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--muted)",
              marginTop: "0.4rem",
            }}
          >
            Pieces listed by Thursday get 2× visibility this weekend.
          </p>
        </div>
        <button
          className="sell-prompt-btn"
          onClick={openNewListingModal}
          style={{
            flexShrink: 0,
            background: "var(--accent)",
            color: "#0a0a08",
            border: "none",
            padding: "0.85rem 2rem",
            borderRadius: "100px",
            fontSize: "0.95rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 16px 40px rgba(138,223,122,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          + Start Listing
        </button>
      </div>
    </div>
  );
}

/* ─── Buyer Shopping Banner (Replaces Sell Prompt for Buyers) ─── */
function BuyerShoppingBanner() {
  const navigate = useNavigate();

  return (
    <div
      className="rv sell-prompt-container"
      style={{
        borderRadius: "18px",
        overflow: "hidden",
        position: "relative",
        marginBottom: "1.5rem",
        height: 200,
        display: "flex",
        alignItems: "center",
        background: "#0a0a08",
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&h=400&fit=crop&auto=format"
        alt="Circular Sustainable Fashion"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(10,10,8,0.95) 0%, rgba(10,10,8,0.4) 100%)",
        }}
      />
      <div
        className="sell-prompt-inner"
        style={{
          position: "relative",
          padding: "0 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--accent)",
              letterSpacing: "0.1em",
              marginBottom: "0.5rem",
            }}
          >
            DISCOVER ARCHIVE & PRE-LOVED FASHION
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.8rem",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Curate Your Conscious Wardrobe
          </h3>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              color: "var(--muted)",
              marginTop: "0.4rem",
              maxWidth: "520px",
            }}
          >
            Every pre-loved item you buy saves an average of 4.2 kg CO₂ and 450L of water. Verified condition & carbon-tracked delivery.
          </p>
        </div>
        <button
          className="sell-prompt-btn"
          onClick={() => navigate("/shop")}
          style={{
            flexShrink: 0,
            background: "var(--accent)",
            color: "#0a0a08",
            border: "none",
            padding: "0.85rem 2rem",
            borderRadius: "100px",
            fontSize: "0.95rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 16px 40px rgba(138,223,122,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          🛍️ Browse Shop Catalog →
        </button>
      </div>
    </div>
  );
}

/* ========================================================
   MAIN HOMEPAGE DASHBOARD
======================================================== */
export default function HomePage() {
  useReveal();
  const { isSeller } = useAuth();

  return (
    <div
      className="dashboard-container"
      style={{
        padding: "2rem 2rem 4rem",
        background: "var(--bg)",
        color: "var(--fg)",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
        }}
      >
        <WelcomeBanner />
        <StatsRow />
        {isSeller ? <MyListings /> : <BuyerCuratedDrops />}
        <OrdersAndLeaderboard />
        <ActivityFeed />
        {!isSeller && <Recommended />}
        <TrendingAndCommunity />
        <ImpactTracker />
        {isSeller ? <SellPrompt /> : <BuyerShoppingBanner />}
      </div>
    </div>
  );
}

