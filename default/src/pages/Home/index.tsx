import { useEffect, useState, useRef } from "react";
import FashionCycleLogo from "../../components/shared/FashionCycleLogo";
import { useAuth } from "../../hooks/useAuth";
/* ─── Reveal on scroll ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(
      ".rv, .rv-l, .rv-r, .rv-s"
    );
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            setTimeout(
              () => e.target.classList.add("vis"),
              Number((e.target as HTMLElement).dataset.d || 0)
            );
        }),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── Animated counter ─── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let start = 0;
      const step = target / 60;
      const t = setInterval(() => {
        start += step;
        if (start >= target) { setVal(target); clearInterval(t); }
        else setVal(Math.floor(start));
      }, 16);
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── Shared styles ─── */
const card = {
  background: "var(--card-bg)",
  border: "1px solid var(--border)",
  borderRadius: "18px",
};

/* ========================================================
   DATA
======================================================== */
const USER = {
  name: "Sophia Laurent",
  handle: "@sophiawears",
  avatar: "SL",
  city: "Paris, FR",
  memberSince: "March 2024",
  followers: 834,
  following: 291,
  verified: true,
  plan: "Pro Seller",
};

const MY_LISTINGS = [
  { id: 1, title: "Acne Studios Wool Scarf", brand: "Acne Studios", size: "OS", price: 78, views: 342, likes: 28, condition: "Like New", img: "https://images.unsplash.com/photo-1619161519929-befcb28d6384?w=500&h=660&fit=crop&auto=format", status: "active" },
  { id: 2, title: "COS Linen Blazer", brand: "COS", size: "M", price: 95, views: 511, likes: 41, condition: "Excellent", img: "https://images.unsplash.com/photo-1637228393246-c38a4b3d2011?w=500&h=660&fit=crop&auto=format", status: "active" },
  { id: 3, title: "Toteme Silk Midi Dress", brand: "Toteme", size: "S", price: 180, views: 728, likes: 63, condition: "Good", img: "https://images.unsplash.com/photo-1664076458686-3449062080ac?w=500&h=660&fit=crop&auto=format", status: "sold" },
  { id: 4, title: "Arket Trench Coat", brand: "Arket", size: "L", price: 145, views: 209, likes: 17, condition: "Good", img: "https://images.unsplash.com/photo-1584216338898-f34d78201414?w=500&h=660&fit=crop&auto=format", status: "active" },
];

const ORDERS = [
  { id: "#FC-00412", item: "Vintage Levi's 501", seller: "Marco R.", date: "Sep 8, 2026", price: 54, status: "Delivered", img: "https://images.unsplash.com/photo-1642359730306-4e80ff12ff6d?w=200&h=200&fit=crop&auto=format" },
  { id: "#FC-00398", item: "Ganni Ruffle Blouse", seller: "Ana K.", date: "Sep 2, 2026", price: 67, status: "In Transit", img: "https://images.unsplash.com/photo-1624192647570-1131acc12ccf?w=200&h=200&fit=crop&auto=format" },
  { id: "#FC-00371", item: "Bottega Mule Heels", seller: "Lea B.", date: "Aug 25, 2026", price: 210, status: "Delivered", img: "https://images.unsplash.com/photo-1680690653166-1618c3bcdf51?w=200&h=200&fit=crop&auto=format" },
];

const FEED = [
  { user: "Elena M.", handle: "@elenam", action: "listed", item: "Sandro Tweed Jacket", price: 120, time: "2m ago", avatar: "EM", img: "https://images.unsplash.com/photo-1731589802397-6a1088d63630?w=400&h=520&fit=crop&auto=format" },
  { user: "Raj Patel", handle: "@rajpstyle", action: "liked your", item: "COS Linen Blazer", price: 95, time: "14m ago", avatar: "RP", img: "https://images.unsplash.com/photo-1637228393246-c38a4b3d2011?w=400&h=520&fit=crop&auto=format" },
  { user: "Yuki T.", handle: "@yukifashion", action: "listed", item: "Marimekko Canvas Tote", price: 38, time: "1h ago", avatar: "YT", img: "https://images.unsplash.com/photo-1635866127591-9cb87bebbb91?w=400&h=520&fit=crop&auto=format" },
  { user: "Nina Wolf", handle: "@ninawolf", action: "listed", item: "Filippa K Crew Knit", price: 72, time: "3h ago", avatar: "NW", img: "https://images.unsplash.com/photo-1589351189946-b8eb5e170ba6?w=400&h=520&fit=crop&auto=format" },
];

const RECOMMENDED = [
  { title: "Nanushka Vegan Leather Jacket", brand: "Nanushka", size: "M", price: 195, condition: "Like New", img: "https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=500&h=680&fit=crop&auto=format", saved: false },
  { title: "By Malene Birger Trousers", brand: "BMB", size: "S", price: 88, condition: "Excellent", img: "https://images.unsplash.com/photo-1731589802956-b4693dae884b?w=500&h=680&fit=crop&auto=format", saved: true },
  { title: "Stine Goya Sequin Blouse", brand: "Stine Goya", size: "M", price: 110, condition: "Good", img: "https://images.unsplash.com/photo-1664515226058-03952a19bd76?w=500&h=680&fit=crop&auto=format", saved: false },
  { title: "Isabel Marant Belt Bag", brand: "Isabel Marant", size: "OS", price: 155, condition: "Like New", img: "https://images.unsplash.com/photo-1673710672680-944563ff9cce?w=500&h=680&fit=crop&auto=format", saved: false },
];

const MESSAGES = [
  { from: "Elena M.", handle: "@elenam", msg: "Is the blazer still available? Happy to pay asking price!", time: "5m", unread: true, avatar: "EM" },
  { from: "Tom S.", handle: "@tomstyle", msg: "Could you do ₹80 for the scarf? Love the colour!", time: "1h", unread: true, avatar: "TS" },
  { from: "Priya N.", handle: "@priyaon", msg: "Thank you for the fast shipping! 5 stars ✨", time: "3h", unread: false, avatar: "PN" },
  { from: "Jake W.", handle: "@jakew", msg: "Interested in swapping for a Filippa K item?", time: "1d", unread: false, avatar: "JW" },
];

const IMPACT = { co2: 48.4, water: 3820, items: 12, money: 836 };

/* ========================================================
   COMPONENTS
======================================================== */

/* ─── Sidebar ─── */
function Sidebar({ active, setActive }: { active: string; setActive: (s: string) => void }) {
  const nav = [
    { id: "home", label: "Home", icon: "⌂" },
    { id: "shop", label: "Shop", icon: "◈" },
    { id: "listings", label: "My Listings", icon: "◧" },
    { id: "orders", label: "Orders", icon: "◫" },
    { id: "messages", label: "Messages", icon: "◻", badge: 2 },
    { id: "impact", label: "My Impact", icon: "♻" },
    { id: "community", label: "Community", icon: "◉" },
    { id: "saved", label: "Saved Items", icon: "♡" },
  ];
  return (
    <aside
      style={{
        width: 240,
        minHeight: "100vh",
        background: "#080806",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "1.75rem 1.5rem 1.25rem", borderBottom: "1px solid var(--border)" }}>
        <FashionCycleLogo size={14} />
      </div>

      {/* User */}
      <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem", color: "#0a0a08", flexShrink: 0 }}>
            {USER.avatar}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", color: "var(--fg)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{USER.name}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>{USER.handle}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "1rem 0.75rem", flex: 1 }}>
        {nav.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.85rem",
                borderRadius: "10px",
                border: "none",
                background: isActive ? "rgba(138,223,122,0.12)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--muted)",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: isActive ? 600 : 400,
                textAlign: "left",
                marginBottom: "2px",
                transition: "background 0.2s, color 0.2s",
                position: "relative",
              }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--fg)"; } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; } }}
            >
              <span style={{ fontSize: "1rem", width: 20, textAlign: "center" }}>{item.icon}</span>
              {item.label}
              {item.badge && (
                <span style={{ marginLeft: "auto", background: "var(--accent)", color: "#0a0a08", borderRadius: "100px", fontSize: "0.6rem", fontWeight: 700, fontFamily: "var(--font-mono)", padding: "2px 7px" }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* List item CTA */}
      <div style={{ padding: "1rem 0.75rem 1.5rem" }}>
        <button
          style={{
            width: "100%",
            background: "var(--accent)",
            color: "#0a0a08",
            border: "none",
            borderRadius: "10px",
            padding: "0.75rem",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "transform 0.2s ease, background 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.background = "var(--accent2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "var(--accent)"; }}
        >
          + List a Piece
        </button>
      </div>
    </aside>
  );
}

/* ─── Top Bar ─── */
function TopBar() {
  const [notifOpen, setNotifOpen] = useState(false);
  return (
    <header style={{ height: 68, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", background: "rgba(10,10,8,0.95)", backdropFilter: "blur(16px)", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: "10px", padding: "0.5rem 1rem" }}>
          <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>🔍</span>
          <input
            placeholder="Search 840K+ pieces…"
            style={{ background: "none", border: "none", outline: "none", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--fg)", width: 220 }}
          />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* Notification bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            style={{ width: 38, height: 38, borderRadius: "10px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", color: "var(--muted)", transition: "color 0.2s, border-color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--fg)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            🔔
          </button>
          <span style={{ position: "absolute", top: 5, right: 5, width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bg)" }} />
          {notifOpen && (
            <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "14px", width: 300, padding: "1rem", zIndex: 99, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", animation: "fadeUp 0.25s ease both" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>NOTIFICATIONS</div>
              {[
                { icon: "💬", text: "Tom offered ₹80 for your Acne scarf", time: "5m" },
                { icon: "❤️", text: "Elena liked your COS Blazer listing", time: "18m" },
                { icon: "📦", text: "Your order #FC-00398 has shipped!", time: "2h" },
                { icon: "✨", text: "You reached Pro Seller status!", time: "1d" },
              ].map((n, i) => (
                <div key={i} style={{ display: "flex", gap: "0.75rem", padding: "0.6rem 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ fontSize: "1rem" }}>{n.icon}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--fg)", lineHeight: 1.4 }}>{n.text}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)", marginTop: "2px" }}>{n.time} ago</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Avatar */}
        <div style={{ width: 38, height: 38, borderRadius: "10px", background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.8rem", color: "#0a0a08", cursor: "pointer" }}>
          {USER.avatar}
        </div>
      </div>
    </header>
  );
}

/* ─── Welcome Banner ─── */
function WelcomeBanner() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0].toUpperCase() || "FRIEND";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <div
      className="rv"
      style={{
        ...card,
        background: "linear-gradient(135deg, #0d1f0d 0%, #131f0a 50%, #0d1a13 100%)",
        border: "1px solid rgba(138,223,122,0.2)",
        padding: "2rem 2.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "2rem",
        overflow: "hidden",
        position: "relative",
        marginBottom: "1.5rem",
      }}
    >
      {/* Background glow */}
      <div style={{ position: "absolute", right: -80, top: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(138,223,122,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
          {greeting.toUpperCase()}, {firstName} ✦
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "0.5rem" }}>
          Your wardrobe,<br />
          <em style={{ color: "var(--accent)" }}>working for you</em>
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.6, maxWidth: 400 }}>
          You have 3 active listings, 2 new messages, and an order arriving tomorrow.
        </p>
      </div>
      <div style={{ display: "flex", gap: "1rem", flexShrink: 0, flexWrap: "wrap" }}>
        {[
          { icon: "◧", label: "3 Active listings" },
          { icon: "◻", label: "2 New messages" },
          { icon: "📦", label: "1 Order in transit" },
        ].map((s) => (
          <div key={s.label} style={{ background: "rgba(138,223,122,0.1)", border: "1px solid rgba(138,223,122,0.2)", borderRadius: "12px", padding: "0.75rem 1.1rem", textAlign: "center", minWidth: 120 }}>
            <div style={{ fontSize: "1.3rem", marginBottom: "0.3rem" }}>{s.icon}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--fg)", fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Stats Row ─── */
function StatsRow() {
  const stats = [
    { label: "Total Earnings", value: 836, prefix: "₹", suffix: "", trend: "+₹124 this month", up: true },
    { label: "Items Sold", value: 12, prefix: "", suffix: "", trend: "+3 this month", up: true },
    { label: "Profile Views", value: 4280, prefix: "", suffix: "", trend: "+18% vs last month", up: true },
    { label: "Average Rating", value: 4.9, prefix: "", suffix: " ★", trend: "48 reviews", up: true },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="rv"
          data-d={i * 80}
          style={{ ...card, padding: "1.5rem", transition: "transform 0.3s ease, border-color 0.3s ease" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(138,223,122,0.3)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>{s.label.toUpperCase()}</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1 }}>
            {s.prefix}<Counter target={s.value} suffix={s.suffix} />
          </div>
          <div style={{ marginTop: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.7rem", color: s.up ? "var(--accent)" : "#f87171", fontFamily: "var(--font-mono)" }}>
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
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? MY_LISTINGS : MY_LISTINGS.filter((l) => l.status === filter);
  return (
    <div className="rv" style={{ ...card, padding: "1.75rem", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>MY CLOSET</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Active Listings</h2>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["all", "active", "sold"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "100px",
                border: "1px solid",
                borderColor: filter === f ? "var(--accent)" : "var(--border)",
                background: filter === f ? "rgba(138,223,122,0.12)" : "transparent",
                color: filter === f ? "var(--accent)" : "var(--muted)",
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all 0.2s",
                textTransform: "capitalize",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {filtered.map((item, i) => (
          <div
            key={item.id}
            className="rv-s"
            data-d={i * 80}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <div
              style={{ aspectRatio: "3/4", borderRadius: "14px", overflow: "hidden", background: "#1a1a14", marginBottom: "0.75rem", position: "relative" }}
              onMouseEnter={(e) => { const img = e.currentTarget.querySelector("img") as HTMLImageElement; if (img) img.style.transform = "scale(1.08)"; }}
              onMouseLeave={(e) => { const img = e.currentTarget.querySelector("img") as HTMLImageElement; if (img) img.style.transform = "scale(1)"; }}
            >
              <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
              {item.status === "sold" && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,8,0.65)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.12em", border: "1px solid var(--accent)", padding: "0.3rem 0.8rem", borderRadius: "100px" }}>SOLD</span>
                </div>
              )}
              <div style={{ position: "absolute", bottom: "0.5rem", right: "0.5rem", background: "rgba(10,10,8,0.85)", borderRadius: "100px", padding: "0.25rem 0.65rem", fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 700, color: "var(--accent)" }}>₹{item.price}</div>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "0.2rem" }}>{item.title}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)", letterSpacing: "0.04em" }}>{item.brand} · {item.size}</div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.4rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)" }}>👁 {item.views}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)" }}>♡ {item.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Two-column: Orders + Messages ─── */
function OrdersAndMessages() {
  const statusColor: Record<string, string> = { Delivered: "var(--accent)", "In Transit": "#fbbf24" };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
      {/* Orders */}
      <div className="rv-l" style={{ ...card, padding: "1.75rem" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>PURCHASES</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>Recent Orders</h2>
        {ORDERS.map((o, i) => (
          <div
            key={o.id}
            style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.85rem 0", borderBottom: i < ORDERS.length - 1 ? "1px solid var(--border)" : "none", transition: "opacity 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <div style={{ width: 48, height: 48, borderRadius: "10px", overflow: "hidden", flexShrink: 0, background: "#1a1a14" }}>
              <img src={o.img} alt={o.item} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", color: "var(--fg)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.item}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)", marginTop: "2px" }}>{o.id} · {o.date}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", color: "var(--fg)" }}>₹{o.price}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: statusColor[o.status] || "var(--muted)", marginTop: "2px" }}>{o.status}</div>
            </div>
          </div>
        ))}
        <button style={{ marginTop: "1rem", background: "transparent", border: "1px solid var(--border)", color: "var(--muted)", padding: "0.55rem 1.25rem", borderRadius: "100px", fontSize: "0.8rem", cursor: "pointer", fontFamily: "var(--font-body)", width: "100%", transition: "color 0.2s, border-color 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--fg)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
          View all orders →
        </button>
      </div>

      {/* Messages */}
      <div className="rv-r" style={{ ...card, padding: "1.75rem" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>INBOX</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>Messages</h2>
        {MESSAGES.map((m, i) => (
          <div
            key={m.from + i}
            style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.85rem 0", borderBottom: i < MESSAGES.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer", opacity: m.unread ? 1 : 0.65, transition: "opacity 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = m.unread ? "1" : "0.65")}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.7rem", color: "#0a0a08" }}>
                {m.avatar}
              </div>
              {m.unread && <span style={{ position: "absolute", top: 0, right: 0, width: 9, height: 9, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--card-bg)" }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", color: "var(--fg)" }}>{m.from}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)" }}>{m.time} ago</span>
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--muted)", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.msg}</div>
            </div>
          </div>
        ))}
        <button style={{ marginTop: "1rem", background: "transparent", border: "1px solid var(--border)", color: "var(--muted)", padding: "0.55rem 1.25rem", borderRadius: "100px", fontSize: "0.8rem", cursor: "pointer", fontFamily: "var(--font-body)", width: "100%", transition: "color 0.2s, border-color 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--fg)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
          Open inbox →
        </button>
      </div>
    </div>
  );
}

/* ─── Activity Feed ─── */
function ActivityFeed() {
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  return (
    <div className="rv" style={{ ...card, padding: "1.75rem", marginBottom: "1.5rem" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>FOLLOWING</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>Activity Feed</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {FEED.map((f, i) => (
          <div
            key={i}
            className="rv-s"
            data-d={i * 80}
            style={{ cursor: "pointer" }}
          >
            <div
              style={{ aspectRatio: "3/4", borderRadius: "14px", overflow: "hidden", position: "relative", background: "#1a1a14", marginBottom: "0.75rem" }}
              onMouseEnter={(e) => { const img = e.currentTarget.querySelector("img") as HTMLImageElement; if (img) img.style.transform = "scale(1.08)"; }}
              onMouseLeave={(e) => { const img = e.currentTarget.querySelector("img") as HTMLImageElement; if (img) img.style.transform = "scale(1)"; }}
            >
              <img src={f.img} alt={f.item} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
              <button
                onClick={(e) => { e.stopPropagation(); setSaved((prev) => ({ ...prev, [i]: !prev[i] })); }}
                style={{ position: "absolute", top: "0.6rem", right: "0.6rem", width: 32, height: 32, borderRadius: "50%", border: "none", background: "rgba(10,10,8,0.7)", backdropFilter: "blur(8px)", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", color: saved[i] ? "var(--accent)" : "var(--fg)", transition: "transform 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {saved[i] ? "♥" : "♡"}
              </button>
              <div style={{ position: "absolute", bottom: "0.6rem", left: "0.6rem", right: "0.6rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.6rem", color: "#0a0a08", flexShrink: 0 }}>{f.avatar}</div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "rgba(255,255,255,0.85)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.user}</span>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", letterSpacing: "0.04em", marginBottom: "0.25rem" }}>
                {f.action} · {f.time}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "0.15rem" }}>{f.item}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600 }}>₹{f.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Recommended ─── */
function Recommended() {
  const [saves, setSaves] = useState<Record<number, boolean>>({ 1: true });
  return (
    <div className="rv" style={{ ...card, padding: "1.75rem", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>CURATED FOR YOU</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Recommended</h2>
        </div>
        <button style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--muted)", padding: "0.45rem 1.1rem", borderRadius: "100px", fontSize: "0.8rem", cursor: "pointer", fontFamily: "var(--font-body)", transition: "color 0.2s, border-color 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--fg)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
          See all →
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {RECOMMENDED.map((item, i) => (
          <div key={i} className="rv-s" data-d={i * 80} style={{ cursor: "pointer" }}>
            <div
              style={{ aspectRatio: "3/4", borderRadius: "14px", overflow: "hidden", background: "#1a1a14", marginBottom: "0.75rem", position: "relative" }}
              onMouseEnter={(e) => { const img = e.currentTarget.querySelector("img") as HTMLImageElement; if (img) img.style.transform = "scale(1.08)"; }}
              onMouseLeave={(e) => { const img = e.currentTarget.querySelector("img") as HTMLImageElement; if (img) img.style.transform = "scale(1)"; }}
            >
              <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
              <div style={{ position: "absolute", top: "0.6rem", left: "0.6rem", background: "rgba(10,10,8,0.8)", backdropFilter: "blur(6px)", borderRadius: "100px", padding: "0.2rem 0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: item.condition === "Like New" ? "var(--accent)" : "var(--fg)", letterSpacing: "0.05em" }}>{item.condition}</div>
              <button
                onClick={(e) => { e.stopPropagation(); setSaves((p) => ({ ...p, [i]: !p[i] })); }}
                style={{ position: "absolute", top: "0.5rem", right: "0.5rem", width: 30, height: 30, borderRadius: "50%", border: "none", background: "rgba(10,10,8,0.7)", cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", color: saves[i] ? "#f87171" : "var(--fg)", transition: "transform 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >{saves[i] ? "♥" : "♡"}</button>
              <div style={{ position: "absolute", bottom: "0.5rem", right: "0.5rem", background: "var(--accent)", borderRadius: "100px", padding: "0.25rem 0.75rem", fontFamily: "var(--font-display)", fontSize: "0.85rem", fontWeight: 700, color: "#0a0a08" }}>₹{item.price}</div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", letterSpacing: "0.04em", marginBottom: "0.2rem" }}>{item.brand} · {item.size}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 600, letterSpacing: "-0.01em" }}>{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Impact Tracker ─── */
function ImpactTracker() {
  return (
    <div className="rv" style={{ ...card, background: "linear-gradient(135deg,#0a1a0a,#121a08)", border: "1px solid rgba(138,223,122,0.15)", padding: "1.75rem", marginBottom: "1.5rem" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>SUSTAINABILITY</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>Your Impact</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {[
          { label: "CO₂ Prevented", value: IMPACT.co2, unit: "kg", icon: "🌿", desc: "Carbon kept out of the atmosphere" },
          { label: "Water Saved", value: IMPACT.water, unit: "L", icon: "💧", desc: "Litres vs. producing new clothing" },
          { label: "Items Rescued", value: IMPACT.items, unit: "pieces", icon: "♻", desc: "Garments saved from landfill" },
          { label: "Money Earned", value: IMPACT.money, unit: "₹", icon: "💚", desc: "Back in your pocket from selling" },
        ].map((s, i) => (
          <div
            key={s.label}
            className="rv-s"
            data-d={i * 80}
            style={{ background: "rgba(138,223,122,0.06)", border: "1px solid rgba(138,223,122,0.15)", borderRadius: "14px", padding: "1.25rem", transition: "background 0.3s, transform 0.3s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(138,223,122,0.1)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(138,223,122,0.06)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{s.icon}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, color: "var(--accent)", letterSpacing: "-0.02em", lineHeight: 1 }}>
              <Counter target={s.value} suffix={` ${s.unit}`} />
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", color: "var(--fg)", marginTop: "0.4rem" }}>{s.label}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.2rem", lineHeight: 1.4 }}>{s.desc}</div>
          </div>
        ))}
      </div>
      {/* Progress bar */}
      <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(138,223,122,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--fg)" }}>Eco Badge Progress — <em style={{ color: "var(--accent)" }}>Gold Level</em></span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent)" }}>12 / 20 items</span>
        </div>
        <div style={{ height: 6, background: "rgba(138,223,122,0.12)", borderRadius: "100px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: "60%", background: "linear-gradient(to right,var(--accent),var(--accent2))", borderRadius: "100px", animation: "slideRight 1.2s cubic-bezier(0.16,1,0.3,1) 0.5s both" }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Trending & Community ─── */
function TrendingAndCommunity() {
  const trending = [
    { rank: 1, label: "Y2K Denim", count: "4.2K listings", delta: "+22%" },
    { rank: 2, label: "Quiet Luxury", count: "3.8K listings", delta: "+18%" },
    { rank: 3, label: "Vintage Sportswear", count: "2.9K listings", delta: "+31%" },
    { rank: 4, label: "Cottagecore", count: "2.1K listings", delta: "+12%" },
    { rank: 5, label: "Dark Academia", count: "1.7K listings", delta: "+9%" },
  ];
  const community = [
    { user: "Mei Lin", handle: "@meilin", followers: "2.3K", img: "https://images.unsplash.com/photo-1501870190084-cdf29f15ef87?w=200&h=200&fit=crop&auto=format", following: false },
    { user: "Hugo Blanc", handle: "@hugoblanc", followers: "1.8K", img: "https://images.unsplash.com/photo-1616847220575-31b062a4cd05?w=200&h=200&fit=crop&auto=format", following: true },
    { user: "Aisha Kone", handle: "@aishakone", followers: "4.1K", img: "https://images.unsplash.com/photo-1729116283277-668f2ff2a0d8?w=200&h=200&fit=crop&auto=format", following: false },
  ];
  const [follows, setFollows] = useState<Record<number, boolean>>({ 1: true });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
      {/* Trending */}
      <div className="rv-l" style={{ ...card, padding: "1.75rem" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>RIGHT NOW</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>Trending Styles</h2>
        {trending.map((t, i) => (
          <div key={t.rank} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 0", borderBottom: i < trending.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 900, color: i === 0 ? "var(--accent)" : "rgba(255,255,255,0.12)", width: 32, textAlign: "center", lineHeight: 1 }}>
              {t.rank < 10 ? `0${t.rank}` : t.rank}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem", color: "var(--fg)" }}>{t.label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)", marginTop: "2px" }}>{t.count}</div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent)" }}>{t.delta}</div>
          </div>
        ))}
      </div>
      {/* Community */}
      <div className="rv-r" style={{ ...card, padding: "1.75rem" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>PEOPLE TO FOLLOW</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>Community</h2>
        {community.map((c, i) => (
          <div key={c.user} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.85rem 0", borderBottom: i < community.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ width: 48, height: 48, borderRadius: "12px", overflow: "hidden", flexShrink: 0, background: "#1a1a14" }}>
              <img src={c.img} alt={c.user} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem", color: "var(--fg)" }}>{c.user}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)", marginTop: "2px" }}>{c.handle} · {c.followers} followers</div>
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
        <button style={{ marginTop: "1rem", background: "transparent", border: "1px solid var(--border)", color: "var(--muted)", padding: "0.55rem 1.25rem", borderRadius: "100px", fontSize: "0.8rem", cursor: "pointer", fontFamily: "var(--font-body)", width: "100%", transition: "color 0.2s, border-color 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--fg)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
          Explore community →
        </button>
      </div>
    </div>
  );
}

/* ─── Sell Prompt Banner ─── */
function SellPrompt() {
  return (
    <div
      className="rv"
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
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,8,0.95) 0%, rgba(10,10,8,0.4) 100%)" }} />
      <div style={{ position: "relative", padding: "0 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>CLEAR YOUR CLOSET</div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Ready to list your next piece?
          </h3>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--muted)", marginTop: "0.4rem" }}>
            Items listed by Thursday get 2× visibility this weekend.
          </p>
        </div>
        <button
          style={{ flexShrink: 0, background: "var(--accent)", color: "#0a0a08", border: "none", padding: "0.85rem 2rem", borderRadius: "100px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(138,223,122,0.3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          + Start Listing
        </button>
      </div>
    </div>
  );
}

/* ─── Profile Card ─── */
function ProfileCard() {
  const { user } = useAuth();
  if (!user) return null;

  const handle = `@${user.name.toLowerCase().replace(/\s+/g, "")}`;
  const avatar = user.name.slice(0, 2).toUpperCase();
  const followers = 124;
  const following = 42;
  const verified = true;
  const plan = "Pro Seller";
  const city = "Bengaluru";
  const memberSince = new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div style={{ ...card, padding: "1.5rem", marginBottom: "1rem", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.25rem", color: "#0a0a08", margin: "0 auto 0.75rem" }}>
        {avatar}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.95rem", color: "var(--fg)" }}>{user.name}</span>
        {verified && <span style={{ fontSize: "0.8rem", color: "var(--accent)" }}>✓</span>}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)", marginBottom: "0.5rem" }}>{handle}</div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", background: "rgba(138,223,122,0.1)", border: "1px solid rgba(138,223,122,0.25)", borderRadius: "100px", padding: "0.25rem 0.75rem", marginBottom: "1rem" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--accent)", letterSpacing: "0.06em" }}>⭐ {plan}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem" }}>
        {[{ label: "Followers", val: followers }, { label: "Following", val: following }].map((s) => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "0.6rem" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--fg)" }}>{s.val.toLocaleString()}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)" }}>{city} · Member since {memberSince}</div>
    </div>
  );
}

/* ─── Quick Actions ─── */
function QuickActions() {
  const actions = [
    { icon: "◧", label: "New Listing" },
    { icon: "◫", label: "Track Order" },
    { icon: "◻", label: "Inbox" },
    { icon: "♻", label: "Impact" },
  ];
  return (
    <div style={{ ...card, padding: "1.25rem", marginBottom: "1rem" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>QUICK ACTIONS</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        {actions.map((a) => (
          <button
            key={a.label}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: "10px", padding: "0.65rem 0.5rem", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", transition: "all 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(138,223,122,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(138,223,122,0.25)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
          >
            <span style={{ fontSize: "1rem" }}>{a.icon}</span>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Mini Impact ─── */
function MiniImpact() {
  return (
    <div style={{ ...card, background: "linear-gradient(135deg,#0a1a0a,#121a08)", border: "1px solid rgba(138,223,122,0.15)", padding: "1.25rem" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--accent)", letterSpacing: "0.08em", marginBottom: "0.6rem" }}>THIS MONTH</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, color: "var(--accent)", letterSpacing: "-0.03em" }}>
        <Counter target={IMPACT.co2} suffix="kg" />
      </div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.75rem" }}>CO₂ prevented from your listings</div>
      <div style={{ height: 4, background: "rgba(138,223,122,0.12)", borderRadius: "100px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: "72%", background: "linear-gradient(to right,var(--accent),var(--accent2))", borderRadius: "100px" }} />
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", marginTop: "0.4rem" }}>72% of monthly goal</div>
    </div>
  );
}

/* ========================================================
   APP
======================================================== */
export default function HomePage() {
  const [active, setActive] = useState("home");
  useReveal();

  return (
    <div style={{ padding: "2rem 2rem 3rem", background: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: "1.5rem", maxWidth: 1280, margin: "0 auto" }}>
            {/* ── Main column ── */}
            <div>
              <WelcomeBanner />
              <StatsRow />
              <MyListings />
              <OrdersAndMessages />
              <ActivityFeed />
              <Recommended />
              <ImpactTracker />
              <TrendingAndCommunity />
              <SellPrompt />
            </div>
            {/* ── Right rail ── */}
            <div style={{ position: "sticky", top: 88, height: "fit-content", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <ProfileCard />
              <QuickActions />
              <MiniImpact />
            </div>
          </div>
    </div>
  );
}
