import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore, type Listing } from "../../contexts/StoreContext";
import { useAuth } from "../../hooks/useAuth";
import { apiRequest } from "../../services/api";
import { FEED, RECOMMENDED } from "../../data/mock";
import BackButton from "../../components/shared/BackButton";
import CircularLoader from "../../components/shared/CircularLoader";

const CURATORS = [
  {
    name: "Harsha Shetty",
    handle: "@ariawears",
    city: "Bengaluru, IN",
    avatar: "HS",
    rating: "4.9 ★",
    sales: "34 pieces sold",
    badge: "🌿 Top 1% Cycler",
  },
  {
    name: "Elena Rostova",
    handle: "@elena_archive",
    city: "Mumbai, IN",
    avatar: "ER",
    rating: "5.0 ★",
    sales: "28 pieces sold",
    badge: "⭐ Master Merchant",
  },
  {
    name: "Marcus Vance",
    handle: "@vancestudio",
    city: "Delhi, IN",
    avatar: "MV",
    rating: "4.9 ★",
    sales: "19 pieces sold",
    badge: "✨ Heritage Curator",
  },
];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, placeOrder, savedIds, toggleSave, showToast } = useStore();
  const { isSeller, isAuthenticated, user } = useAuth();

  const [item, setItem] = useState<Listing | null>(() => {
    return listings.find((l) => l.id === id) || null;
  });
  const [loading, setLoading] = useState(!item);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerValue, setOfferValue] = useState("");
  const [isFollowingCurator, setIsFollowingCurator] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener for Apple-style sticky sub-nav
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch listing details if not found in cache or on direct page visit
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const localMatch = listings.find((l) => l.id === id);
    if (localMatch) {
      setItem(localMatch);
      setLoading(false);
    } else if (id && (id.startsWith("rec-") || id.startsWith("feed-"))) {
      const idx = parseInt(id.split("-")[1]) || 0;
      if (id.startsWith("rec-") && RECOMMENDED[idx]) {
        const r = RECOMMENDED[idx];
        setItem({
          id,
          title: r.title,
          brand: r.brand,
          size: r.size,
          condition: (r.condition as any) || "Excellent",
          category: "Outerwear",
          price: r.price,
          images: [r.img],
          sellerId: "curated-drop",
          createdAt: new Date().toISOString(),
          sold: false,
        });
      } else if (id.startsWith("feed-") && FEED[idx]) {
        const f = FEED[idx];
        setItem({
          id,
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
        });
      } else if (listings.length > 0) {
        setItem(listings[idx % listings.length]);
      }
      setLoading(false);
    } else if (id) {
      setLoading(true);
      apiRequest<Listing>(`/listings/${id}`)
        .then((res) => {
          if (res && res.id) {
            setItem(res);
          }
        })
        .catch((err) => {
          console.warn("Product fetch warning:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, listings]);

  if (loading) {
    return (
      <CircularLoader
        fullScreen
        size={84}
        message="Authenticating Circular Piece…"
        subtext="Verifying archival garment condition and specifications"
      />
    );
  }

  if (!item) {
    return (
      <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: "480px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👗</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Piece Not Found
          </h1>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", marginBottom: "1.5rem" }}>
            This circular garment may have already found a new home or been recirculated.
          </p>
          <button
            onClick={() => navigate("/shop")}
            style={{
              background: "var(--accent)",
              color: "#0a0a08",
              border: "none",
              borderRadius: "100px",
              padding: "0.8rem 1.8rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ← Explore Available Pieces
          </button>
        </div>
      </section>
    );
  }

  const isSaved = savedIds.includes(item.id);
  const gallery = item.images && item.images.length > 0 ? item.images : ["https://images.unsplash.com/photo-1544441893-675973e31985"];
  const curator = CURATORS[Math.abs(item.id.split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0)) % CURATORS.length];

  const handleBuy = () => {
    if (!isAuthenticated || !user) {
      showToast("Please sign in or create an account to acquire this piece 🌱", "info");
      navigate("/login", { state: { returnUrl: `/product/${item.id}` } });
      return;
    }

    navigate("/payment", {
      state: {
        item: {
          id: item.id,
          title: item.title,
          price: item.price,
          img: gallery[0],
          brand: item.brand,
          size: item.size,
          condition: item.condition,
          seller: `${item.brand} Collective`,
        },
      },
    });
  };

  const handleSendOffer = () => {
    if (!isAuthenticated || !user) {
      showToast("Please sign in to send an offer to the seller 🌱", "info");
      navigate("/login", { state: { returnUrl: `/product/${item.id}` } });
      return;
    }

    if (!offerValue.trim() || Number(offerValue) <= 0) {
      showToast("Please enter a valid offer amount in ₹", "error");
      return;
    }
    showToast(`Offer of ${offerValue}₹ sent to ${curator.name}! They'll respond shortly. 💬`);
    setShowOfferModal(false);
    setOfferValue("");
  };

  const relatedPieces = listings
    .filter((l) => l.id !== item.id && !l.sold && (l.category === item.category || l.brand === item.brand))
    .slice(0, 3);

  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>
      {/* ─── Apple-Style Sticky Sub-Nav Ribbon ─── */}
      <div
        style={{
          position: "sticky",
          top: "60px",
          zIndex: 90,
          background: isScrolled ? "rgba(10,10,8,0.95)" : "transparent",
          backdropFilter: isScrolled ? "blur(20px)" : "none",
          borderBottom: isScrolled ? "1px solid var(--border)" : "1px solid transparent",
          padding: "0.75rem clamp(1rem, 4vw, 3rem)",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: isScrolled ? 1 : 0.85,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <img
            src={gallery[0]}
            alt={item.title}
            style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover", border: "1px solid var(--border)" }}
          />
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.2 }}>
              {item.title}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>
              {item.brand} · Size {item.size} · {item.condition}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: "var(--accent)" }}>
            {item.price}₹
          </span>

          <button
            onClick={() => toggleSave(item.id)}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: isSaved ? "rgba(138,223,122,0.18)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${isSaved ? "var(--accent)" : "var(--border)"}`,
              color: isSaved ? "var(--accent)" : "var(--fg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "transform 0.2s",
            }}
            title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          >
            {isSaved ? "♥" : "♡"}
          </button>

          {!item.sold && !isSeller && (
            <button
              onClick={handleBuy}
              style={{
                background: "var(--accent)",
                color: "#0a0a08",
                border: "none",
                borderRadius: "100px",
                padding: "0.55rem 1.4rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "transform 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              ⚡ Buy Now
            </button>
          )}
        </div>
      </div>

      {/* ─── Breadcrumb & Back Navigation ─── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.5rem 2rem 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <BackButton fallback="/shop" label="Back" />
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)" }}>
            <Link to="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <Link to="/shop" style={{ color: "var(--muted)", textDecoration: "none" }}>Shop</Link>
            <span>/</span>
            <span style={{ color: "var(--accent)" }}>{item.category}</span>
            <span>/</span>
            <span style={{ color: "var(--fg)" }}>{item.brand}</span>
          </div>
        </div>
      </div>

      {/* ─── Apple-Style Hero Presentation Section ─── */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 2rem 5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "3.5rem",
            alignItems: "flex-start",
          }}
        >
          {/* Left Column: Visual Showcase Gallery */}
          <div>
            <div
              style={{
                borderRadius: "28px",
                overflow: "hidden",
                background: "#141410",
                border: "1px solid var(--border)",
                boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
                position: "relative",
                aspectRatio: "3/4",
                marginBottom: "1rem",
              }}
            >
              <img
                src={gallery[selectedImageIndex] || gallery[0]}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                }}
              />

              {item.sold && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(10,10,8,0.75)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "1rem",
                      color: "var(--accent)",
                      letterSpacing: "0.15em",
                      border: "2px solid var(--accent)",
                      padding: "0.6rem 1.6rem",
                      borderRadius: "100px",
                      fontWeight: 800,
                    }}
                  >
                    ACQUIRED · SOLD OUT
                  </span>
                </div>
              )}

              <div
                style={{
                  position: "absolute",
                  top: "1.25rem",
                  left: "1.25rem",
                  background: "rgba(10,10,8,0.85)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "100px",
                  padding: "0.35rem 0.9rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: "var(--accent)",
                  border: "1px solid rgba(138,223,122,0.3)",
                }}
              >
                100% AUTHENTICATED ARCHIVE
              </div>
            </div>

            {/* Thumbnail Selectors */}
            {gallery.length > 1 && (
              <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
                {gallery.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "14px",
                      overflow: "hidden",
                      border: selectedImageIndex === idx ? "2px solid var(--accent)" : "1px solid var(--border)",
                      background: "#141410",
                      padding: 0,
                      cursor: "pointer",
                      opacity: selectedImageIndex === idx ? 1 : 0.6,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Apple-Style Specifications & Purchase Engine */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--accent)",
                letterSpacing: "0.12em",
                marginBottom: "0.6rem",
                textTransform: "uppercase",
              }}
            >
              {item.category} · {item.condition} GRADE
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 3.8vw, 3.2rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "0.75rem",
                color: "var(--fg)",
              }}
            >
              {item.title}
            </h1>

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.95rem",
                color: "var(--muted)",
                letterSpacing: "0.04em",
                marginBottom: "1.75rem",
              }}
            >
              Curated by <strong style={{ color: "var(--fg)" }}>{item.brand}</strong> · Dispatched from <strong style={{ color: "var(--fg)" }}>{curator.city}</strong>
            </div>

            {/* Price Presentation */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "1.5rem 1.75rem",
                marginBottom: "2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.2rem" }}>
                  CIRCULAR ACQUISITION PRICE
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "2.8rem",
                      fontWeight: 900,
                      color: "var(--accent)",
                      lineHeight: 1,
                    }}
                  >
                    {item.price}₹
                  </span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--muted)" }}>
                    inclusive of carbon-neutral shipping
                  </span>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(138,223,122,0.12)",
                  border: "1px solid rgba(138,223,122,0.3)",
                  padding: "0.45rem 0.95rem",
                  borderRadius: "100px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--accent)",
                  fontWeight: 700,
                }}
              >
                SAVE ~{Math.round(item.price * 2.4)}₹ VS RETAIL
              </div>
            </div>

            {/* Description */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.7,
                marginBottom: "2rem",
              }}
            >
              {item.description || "Authentic pre-loved designer piece. Carefully inspected, washed, sanitized, and packaged with 100% biodegradable materials for circular reuse."}
            </p>

            {/* Size & Spec Badges */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
              <div style={{ background: "#181814", border: "1px solid var(--border)", padding: "0.6rem 1.2rem", borderRadius: "12px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)", display: "block" }}>SIZE</span>
                <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--fg)" }}>{item.size}</strong>
              </div>
              <div style={{ background: "#181814", border: "1px solid var(--border)", padding: "0.6rem 1.2rem", borderRadius: "12px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)", display: "block" }}>CONDITION</span>
                <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--accent)" }}>{item.condition}</strong>
              </div>
              <div style={{ background: "#181814", border: "1px solid var(--border)", padding: "0.6rem 1.2rem", borderRadius: "12px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)", display: "block" }}>CIRCULAR IMPACT</span>
                <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--accent2)" }}>3.8 kg CO₂</strong>
              </div>
            </div>

            {/* Action CTA Stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "2.5rem" }}>
              {isSeller ? (
                <div
                  style={{
                    background: "rgba(250, 204, 21, 0.08)",
                    border: "1px solid rgba(250, 204, 21, 0.3)",
                    borderRadius: "14px",
                    padding: "1.1rem",
                    textAlign: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.82rem",
                    color: "#facc15",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>🏷️</span>
                  <span>Logged in as Verified Seller · Shopping & purchasing is reserved for Buyer accounts</span>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button
                      onClick={handleBuy}
                      disabled={item.sold}
                      style={{
                        flex: 1,
                        background: item.sold ? "var(--muted)" : "var(--accent)",
                        color: "#0a0a08",
                        border: "none",
                        borderRadius: "100px",
                        padding: "1rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "1rem",
                        fontWeight: 700,
                        cursor: item.sold ? "not-allowed" : "pointer",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        boxShadow: item.sold ? "none" : "0 8px 24px rgba(138,223,122,0.35)",
                      }}
                      onMouseEnter={(e) => {
                        if (!item.sold) e.currentTarget.style.transform = "scale(1.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <span>⚡</span>
                      <span>{item.sold ? "Sold Out" : `Acquire Piece — ${item.price}₹`}</span>
                    </button>

                    <button
                      onClick={() => toggleSave(item.id)}
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        background: isSaved ? "rgba(138,223,122,0.18)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${isSaved ? "var(--accent)" : "var(--border)"}`,
                        color: isSaved ? "var(--accent)" : "var(--fg)",
                        fontSize: "1.3rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "transform 0.2s",
                      }}
                      title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
                    >
                      {isSaved ? "♥" : "♡"}
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: isSeller ? "1fr 1fr" : "1fr", gap: "0.75rem" }}>
                    <button
                      onClick={() => setShowOfferModal(true)}
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--border)",
                        color: "var(--fg)",
                        borderRadius: "100px",
                        padding: "0.85rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "border-color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    >
                      💬 Make an Offer
                    </button>

                    {isSeller && (
                      <button
                        onClick={() => {
                          showToast("Opening CycleBot AI Wardrobe Stylist for this garment… ✨");
                          const chatBtn = document.querySelector<HTMLButtonElement>('[aria-label="Open FashionCycle Stylist AI"]');
                          if (chatBtn) chatBtn.click();
                        }}
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid var(--border)",
                          color: "var(--fg)",
                          borderRadius: "100px",
                          padding: "0.85rem",
                          fontFamily: "var(--font-body)",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "border-color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent2)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                      >
                        🌱 Ask AI Stylist
                      </button>
                    )}
                  </div>

                  {isSaved && (
                    <div style={{ marginTop: "0.85rem", textAlign: "center" }}>
                      <Link
                        to="/wishlist"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.75rem",
                          color: "var(--accent)",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          background: "rgba(138,223,122,0.08)",
                          border: "1px solid rgba(138,223,122,0.25)",
                          padding: "0.4rem 0.85rem",
                          borderRadius: "100px",
                        }}
                      >
                        <span>♥ Saved in your archive · View Wishlist</span>
                        <span style={{ fontSize: "0.8rem" }}>→</span>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Security, Courier & Return Guarantees */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                borderTop: "1px solid var(--border)",
                paddingTop: "1.5rem",
              }}
            >
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.3rem" }}>🚚</span>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.85rem" }}>
                    Carbon-Neutral Dispatch
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.15rem" }}>
                    Tracked delivery in 2–3 business days with live GPS status.
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.3rem" }}>🛡️</span>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.85rem" }}>
                    3-Day Circular Guarantee
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.15rem" }}>
                    Inspect piece at home. Recirculate or return if sizing differs.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Apple-Style "Bento Grid" Deep Feature Tiles ─── */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem 5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>
            ENGINEERED TO OUTLIVE TRENDS
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 900 }}>
            Every Stitch. Fully Documented.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {/* Tile 1: Sustainability Matrix */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(138,223,122,0.08) 0%, rgba(20,20,16,0.6) 100%)",
              border: "1px solid rgba(138,223,122,0.25)",
              borderRadius: "24px",
              padding: "2.5rem 2rem",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🌱</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
              ENVIRONMENTAL IMPACT
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.75rem" }}>
              3.8 kg CO₂ Diverted
            </h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              By extending this piece&apos;s lifecycle, you prevent 2,700 Liters of water consumption and 3.8 kg of toxic greenhouse gases required to manufacture a new alternative.
            </p>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <div>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, color: "var(--accent)" }}>2,700 L</span>
                <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>WATER CONSERVED</span>
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, color: "#facc15" }}>100%</span>
                <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>LANDFILL DIVERTED</span>
              </div>
            </div>
          </div>

          {/* Tile 2: Verification Quality */}
          <div
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "24px",
              padding: "2.5rem 2rem",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
              QUALITY VERIFICATION
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.75rem" }}>
              Hand-Inspected Grade: {item.condition}
            </h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.6 }}>
              Every garment undergoes a 5-point inspection: hardware integrity, stitch density, authentic branding tags, fabric elasticity, and aroma hygiene sanitize.
            </p>
          </div>

          {/* Tile 3: Tailoring Architecture */}
          <div
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "24px",
              padding: "2.5rem 2rem",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📐</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
              FIT ARCHITECTURE
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.75rem" }}>
              Tailored for Size {item.size}
            </h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1rem" }}>
              Classic drape with natural movement. Recommended for standard {item.size} sizing or styled slightly oversized for contemporary silhouette.
            </p>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--accent)" }}>
              ✓ Machine cold cycle or eco dry-clean compatible
            </div>
          </div>
        </div>
      </section>

      {/* ─── Curator Profile Card ─── */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem 5rem" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "2.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "1.5rem",
                color: "#0a0a08",
              }}
            >
              {curator.avatar}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, margin: 0 }}>
                  Curated by {curator.name}
                </h3>
                <span
                  style={{
                    background: "rgba(234, 179, 8, 0.15)",
                    border: "1px solid rgba(234, 179, 8, 0.35)",
                    color: "#facc15",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "100px",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {curator.badge}
                </span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.3rem" }}>
                {curator.handle} · {curator.city} · {curator.rating} ({curator.sales})
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button
              onClick={() => {
                if (!isAuthenticated || !user) {
                  showToast("Please sign in or create an account to follow curators 🌱", "info");
                  navigate("/login", { state: { returnUrl: `/product/${item.id}` } });
                  return;
                }
                const nextState = !isFollowingCurator;
                setIsFollowingCurator(nextState);
                showToast(nextState ? `Now following ${curator.name}! 🎉` : `Unfollowed ${curator.name}`, "info");
              }}
              style={{
                background: isFollowingCurator ? "rgba(138,223,122,0.15)" : "var(--accent)",
                border: isFollowingCurator ? "1px solid var(--accent)" : "none",
                color: isFollowingCurator ? "var(--accent)" : "#0a0a08",
                borderRadius: "100px",
                padding: "0.75rem 1.8rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {isFollowingCurator ? "✓ Following Curator" : "+ Follow Curator"}
            </button>
            <Link
              to="/community"
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--fg)",
                borderRadius: "100px",
                padding: "0.75rem 1.4rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              View Community Profile →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Related Pieces in the Cycle ─── */}
      {relatedPieces.length > 0 && (
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem 6rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
                EXPLORE SIMILAR STYLES
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800 }}>
                More in this Collection
              </h2>
            </div>
            <Link to="/shop" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--accent)", textDecoration: "none" }}>
              Browse all pieces →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {relatedPieces.map((piece) => (
              <div
                key={piece.id}
                onClick={() => navigate(`/product/${piece.id}`)}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "18px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.2s, border-color 0.2s",
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
                  <img src={piece.images[0]} alt={piece.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0.6rem",
                      right: "0.6rem",
                      background: "rgba(10,10,8,0.85)",
                      borderRadius: "100px",
                      padding: "0.25rem 0.65rem",
                      fontFamily: "var(--font-display)",
                      fontSize: "0.9rem",
                      fontWeight: 800,
                      color: "var(--accent)",
                    }}
                  >
                    {piece.price}₹
                  </div>
                </div>

                <div style={{ padding: "1.2rem" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                    {piece.title}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)" }}>
                    {piece.brand} · {piece.size} · {piece.condition}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Make an Offer Modal ─── */}
      {showOfferModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              background: "#141410",
              border: "1px solid var(--border)",
              borderRadius: "24px",
              padding: "2.5rem 2rem",
              position: "relative",
              boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
            }}
          >
            <button
              onClick={() => setShowOfferModal(false)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "transparent",
                border: "none",
                color: "var(--muted)",
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                MAKE AN OFFER TO {curator.name.toUpperCase()}
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800 }}>
                {item.title}
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                Listed at <strong>{item.price}₹</strong>. Propose your circular purchase price.
              </p>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
                YOUR OFFER AMOUNT (₹) *
              </label>
              <input
                type="number"
                placeholder={`e.g. ${Math.round(item.price * 0.85)}`}
                value={offerValue}
                onChange={(e) => setOfferValue(e.target.value)}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--accent)",
                  borderRadius: "12px",
                  padding: "0.85rem 1rem",
                  color: "var(--fg)",
                  fontSize: "1.1rem",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={handleSendOffer}
                style={{
                  flex: 1,
                  background: "var(--accent)",
                  color: "#0a0a08",
                  border: "none",
                  borderRadius: "100px",
                  padding: "0.85rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Submit Offer to Seller
              </button>
              <button
                onClick={() => setShowOfferModal(false)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--muted)",
                  borderRadius: "100px",
                  padding: "0.85rem 1.25rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
