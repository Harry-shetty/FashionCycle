import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore, type OrderItem } from "../../contexts/StoreContext";
import { useAuth } from "../../hooks/useAuth";
import { useReveal } from "../../hooks/useReveal";
import BackButton from "../../components/shared/BackButton";

const statusColor: Record<string, string> = {
  Delivered: "var(--accent)",
  "In Transit": "#fbbf24",
  Processing: "#60a5fa",
};

export default function OrdersPage() {
  useReveal();
  const { orders, openOrderTrackingModal, cancelOrder } = useStore();
  const { isSeller } = useAuth();
  const [filter, setFilter] = useState<string>("all");

  // Status classifier helper (matches "In Transit", "Shipped", "Processing", etc.)
  const isOrderInTransit = (status?: string) => {
    const s = (status || "").toLowerCase().trim();
    return s.includes("transit") || s.includes("ship") || s.includes("process") || s.includes("route");
  };

  const isOrderDelivered = (status?: string) => {
    const s = (status || "").toLowerCase().trim();
    return s.includes("deliver") || s.includes("complete") || s.includes("received");
  };

  const inTransitCount = orders.filter((o) => isOrderInTransit(o.status)).length;
  const deliveredCount = orders.filter((o) => isOrderDelivered(o.status)).length;

  const filtered = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "In Transit") return isOrderInTransit(o.status);
    if (filter === "Delivered") return isOrderDelivered(o.status);
    return true;
  });

  const filterTabs = [
    { key: "all", label: `All Orders (${orders.length})` },
    { key: "In Transit", label: `In Transit (${inTransitCount})` },
    { key: "Delivered", label: `Delivered (${deliveredCount})` },
  ];

  return (
    <section className="section-pad" style={{ minHeight: "100vh", padding: "4rem 2rem 6rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Top Back Navigation */}
        <div style={{ marginBottom: "2rem" }}>
          <BackButton fallback="/home" label="Back to Home" />
        </div>

        {/* Header */}
        <div
          className="reveal"
          style={{
            marginBottom: "3rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: isSeller ? "#facc15" : "var(--accent)",
                letterSpacing: "0.1em",
                marginBottom: "0.75rem",
              }}
            >
              {isSeller ? `SELLER FULFILLMENT · ${orders.length} CUSTOMER ORDERS` : `MY PURCHASES & SHIPMENTS · ${orders.length} TOTAL`}
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 4vw, 4rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              {isSeller ? "Customer Orders" : "My Orders"}
            </h1>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {filterTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                style={{
                  padding: "0.45rem 1.1rem",
                  borderRadius: "100px",
                  border: `1px solid ${filter === t.key ? "var(--accent)" : "var(--border)"}`,
                  background: filter === t.key ? "rgba(138,223,122,0.12)" : "transparent",
                  color: filter === t.key ? "var(--accent)" : "var(--muted)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  fontWeight: filter === t.key ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div
            style={{
              padding: "4rem 2rem",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              textAlign: "center",
            }}
          >
            {orders.length === 0 ? (
              <>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📦</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  {isSeller ? "No customer orders received yet" : "No orders placed yet"}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                  {isSeller
                    ? "List more pre-loved pieces to receive customer orders and start dispatching!"
                    : "Explore pre-loved designer drops and cycle your first piece!"}
                </p>
                <Link
                  to={isSeller ? "/listings" : "/shop"}
                  style={{
                    background: "var(--accent)",
                    color: "#0a0a08",
                    border: "none",
                    borderRadius: "100px",
                    padding: "0.75rem 1.8rem",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  {isSeller ? "Manage Inventory →" : "Browse Marketplace →"}
                </Link>
              </>
            ) : (
              <>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                  {filter === "In Transit" ? "🚚" : "✨"}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  No orders currently {filter === "In Transit" ? "in transit" : "delivered"}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                  {filter === "In Transit"
                    ? `All ${orders.length} of your orders have already been delivered!`
                    : `All ${orders.length} of your active orders are currently in transit.`}
                </p>
                <button
                  onClick={() => setFilter("all")}
                  style={{
                    background: "var(--accent)",
                    color: "#0a0a08",
                    border: "none",
                    borderRadius: "100px",
                    padding: "0.75rem 1.8rem",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                  }}
                >
                  Show All Orders ({orders.length}) →
                </button>
              </>
            )}
          </div>
        ) : (
          <div
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "1.5rem 2rem",
              display: "flex",
              flexDirection: "column",
              opacity: 1,
              transform: "none",
            }}
          >
            {filtered.map((order: OrderItem, i: number) => (
              <div
                key={order.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "1.5rem 0",
                  borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                  gap: "1.5rem",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: "#1a1a14",
                    flexShrink: 0,
                  }}
                >
                  <img src={order.img} alt={order.item} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                <div style={{ flex: 1, minWidth: "220px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: "0.25rem" }}>
                    {order.item}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)" }}>
                    {order.id} · {order.date} · {isSeller ? `Buyer: ${order.customer || order.address?.split(",")[0] || "Verified Buyer"}` : `Seller: ${order.seller}`}
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.3rem" }}>
                    {order.estimatedDelivery}
                  </div>
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.3rem", color: "var(--fg)" }}>
                    {order.price}₹
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: statusColor[order.status] || "var(--muted)",
                      marginTop: "0.25rem",
                    }}
                  >
                    ● {order.status}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.5rem", width: "100%", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
                  <button
                    onClick={() => openOrderTrackingModal(order)}
                    style={{
                      background: "rgba(138,223,122,0.12)",
                      border: "1px solid rgba(138,223,122,0.3)",
                      color: "var(--accent)",
                      borderRadius: "100px",
                      padding: "0.5rem 1.25rem",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {isSeller ? "📍 Live Dispatch Tracking" : "📍 Live Tracking"}
                  </button>

                  {order.status !== "Delivered" && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--border)",
                        color: "var(--muted)",
                        borderRadius: "100px",
                        padding: "0.5rem 1rem",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        transition: "border-color 0.2s, color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#ef4444";
                        e.currentTarget.style.color = "#ef4444";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.color = "var(--muted)";
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
