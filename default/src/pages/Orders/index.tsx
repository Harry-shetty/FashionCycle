import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore, type OrderItem } from "../../contexts/StoreContext";

const statusColor: Record<string, string> = {
  Delivered: "var(--accent)",
  "In Transit": "#fbbf24",
  Processing: "#60a5fa",
};

export default function OrdersPage() {
  const { orders, openOrderTrackingModal, cancelOrder } = useStore();
  const [filter, setFilter] = useState<string>("all");

  const filtered = orders.filter((o) => {
    if (filter === "all") return true;
    return o.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <section className="section-pad" style={{ minHeight: "100vh", padding: "4rem 2rem 6rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
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
                color: "var(--accent)",
                letterSpacing: "0.1em",
                marginBottom: "0.75rem",
              }}
            >
              PURCHASES & SHIPMENTS · {orders.length} TOTAL
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
              Orders
            </h1>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["all", "In Transit", "Delivered"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "0.45rem 1.1rem",
                  borderRadius: "100px",
                  border: `1px solid ${filter === f ? "var(--accent)" : "var(--border)"}`,
                  background: filter === f ? "rgba(138,223,122,0.12)" : "transparent",
                  color: filter === f ? "var(--accent)" : "var(--muted)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {f === "all" ? "All Orders" : f}
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
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📦</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              No orders found
            </h3>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Explore pre-loved designer drops and cycle your first piece!
            </p>
            <Link
              to="/shop"
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
              Browse Marketplace →
            </Link>
          </div>
        ) : (
          <div
            className="reveal-up"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "1.5rem 2rem",
              display: "flex",
              flexDirection: "column",
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
                    {order.id} · {order.date} · Seller: {order.seller}
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
                    📍 Live Tracking
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
