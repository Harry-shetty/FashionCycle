import { useNavigate } from "react-router-dom";
import { useStore } from "../../contexts/StoreContext";
import type { Listing } from "../../types/listing.types";

const conditionColor: Record<string, string> = {
  "Like New": "#8adf7a",
  Excellent: "#c8f564",
  Good: "#f0ece3",
};

export default function FeaturedItems() {
  const navigate = useNavigate();
  const { listings, openItemModal, savedIds, toggleSave } = useStore();

  const curatedItems = listings.slice(0, 4);

  return (
    <section id="shop" className="section-pad" style={{ padding: "8rem 4rem", background: "#0d0d0b" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "3rem",
          }}
        >
          <div>
            <div
              className="reveal"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--accent)",
                letterSpacing: "0.1em",
                marginBottom: "0.75rem",
              }}
            >
              CURATED DROPS
            </div>
            <h2
              className="reveal"
              data-delay="100"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Today&apos;s picks
            </h2>
          </div>
          <button
            onClick={() => navigate("/shop")}
            className="reveal-right"
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--fg)",
              padding: "0.75rem 1.75rem",
              borderRadius: "100px",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              transition: "border-color 0.2s, color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent)";
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--fg)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            View all →
          </button>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}
        >
          {curatedItems.map((item: Listing, i: number) => {
            const isSaved = savedIds.includes(item.id);
            const img1 = item.images && item.images.length > 0 ? item.images[0] : "/products/lst-001-front.jpg";
            const img2 = item.images && item.images.length > 1 ? item.images[1] : img1;

            return (
              <div
                key={item.id}
                className="reveal"
                data-delay={i * 100}
                onClick={() => navigate(`/product/${item.id}`)}
                style={{
                  cursor: "pointer",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "0.75rem",
                  transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s, box-shadow 0.25s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "rgba(138,223,122,0.4)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.25)";
                  const imgSwap = e.currentTarget.querySelector(".hover-swap-img") as HTMLElement;
                  if (imgSwap) imgSwap.style.opacity = "1";
                  const mainImg = e.currentTarget.querySelector(".main-product-img") as HTMLElement;
                  if (mainImg && img2 !== img1) mainImg.style.opacity = "0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                  const imgSwap = e.currentTarget.querySelector(".hover-swap-img") as HTMLElement;
                  if (imgSwap) imgSwap.style.opacity = "0";
                  const mainImg = e.currentTarget.querySelector(".main-product-img") as HTMLElement;
                  if (mainImg) mainImg.style.opacity = "1";
                }}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "4/5",
                    borderRadius: "14px",
                    overflow: "hidden",
                    marginBottom: "0.85rem",
                    background: "#f4f3ef",
                  }}
                >
                  <img
                    className="main-product-img"
                    src={img1}
                    alt={item.title}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />

                  {img2 && img2 !== img1 && (
                    <img
                      className="hover-swap-img"
                      src={img2}
                      alt={`${item.title} alternate`}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        opacity: 0,
                        transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    />
                  )}
                  
                  {/* Thrift Wallet 1 of 1 Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "0.6rem",
                      left: "0.6rem",
                      background: "rgba(18, 18, 16, 0.88)",
                      backdropFilter: "blur(6px)",
                      borderRadius: "100px",
                      padding: "3px 8px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      color: "#f5f4f0",
                      letterSpacing: "0.06em",
                      border: "1px solid rgba(255,255,255,0.14)",
                      zIndex: 2,
                    }}
                  >
                    1 OF 1 • NO RESTOCKS
                  </div>

                  {/* Wishlist Button */}
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
                      background: "rgba(18, 18, 16, 0.75)",
                      backdropFilter: "blur(6px)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.95rem",
                      color: isSaved ? "var(--accent)" : "rgba(255,255,255,0.8)",
                      transition: "transform 0.2s",
                      zIndex: 3,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {isSaved ? "♥" : "♡"}
                  </button>

                  {/* Category Pill */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0.6rem",
                      left: "0.6rem",
                      background: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(6px)",
                      borderRadius: "100px",
                      padding: "2px 8px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      fontWeight: 600,
                      color: "#161614",
                      zIndex: 2,
                    }}
                  >
                    {item.category}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.65rem",
                        color: "var(--muted)",
                        letterSpacing: "0.06em",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {item.brand} · Size {item.size} · {item.condition}
                    </div>

                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        lineHeight: 1.3,
                        minHeight: "2.5rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        color: "var(--fg)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "0.4rem" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, color: "var(--accent)" }}>
                      {item.price}₹
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.62rem",
                        color: conditionColor[item.condition] || "var(--accent)",
                        background: "rgba(255,255,255,0.06)",
                        padding: "2px 8px",
                        borderRadius: "100px",
                      }}
                    >
                      {item.condition}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
                >
                  {item.brand} · Size {item.size}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.05rem",
                    fontWeight: 700,
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
    </section>
  );
}
