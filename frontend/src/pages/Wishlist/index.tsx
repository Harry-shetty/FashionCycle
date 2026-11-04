import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useStore, type Listing } from "../../contexts/StoreContext";
import { useAuth } from "../../hooks/useAuth";
import { apiRequest } from "../../services/api";
import BackButton from "../../components/shared/BackButton";

const conditionColor: Record<string, string> = {
  "Like New": "#8adf7a",
  Excellent: "#c8f564",
  Good: "#f0ece3",
  Fair: "var(--muted)",
};

const CATEGORIES = [
  "All",
  "Tops & Tees",
  "Outerwear",
  "Dresses",
  "Denim",
  "Shoes",
  "Accessories",
];

interface BackendSavedItem {
  _id?: string;
  listingId: string;
  title?: string;
  brand?: string;
  price?: number;
  image?: string;
  category?: string;
  size?: string;
  condition?: string;
}

export default function WishlistPage() {
  const { isSeller, isAuthenticated, user } = useAuth();

  // Sellers do not have a buyer wishlist
  if (isSeller) {
    return <Navigate to="/listings" replace />;
  }

  const navigate = useNavigate();
  const { listings, savedIds, toggleSave, clearAllSaved, placeOrder, showToast } = useStore();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"recent" | "price-asc" | "price-desc">("recent");
  const [dbSavedDetails, setDbSavedDetails] = useState<BackendSavedItem[]>([]);
  const [isClearing, setIsClearing] = useState(false);

  // Sync with MongoDB saveditems collection for full details if not found in cache
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    apiRequest<BackendSavedItem[]>("/saved/details")
      .then((res) => {
        if (Array.isArray(res)) {
          setDbSavedDetails(res);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch saved details:", err);
      });
  }, [savedIds]);

  // Combine listings with dbSavedDetails to get complete list of favorited items
  const wishlistItems = useMemo(() => {
    const itemsMap = new Map<string, Listing>();

    // 1. Add all items matching savedIds from local store listings
    listings.forEach((item) => {
      if (savedIds.includes(item.id)) {
        itemsMap.set(item.id, item);
      }
    });

    // 2. Supplement any missing items from MongoDB saveditems records
    dbSavedDetails.forEach((saved) => {
      if (savedIds.includes(saved.listingId) && !itemsMap.has(saved.listingId)) {
        itemsMap.set(saved.listingId, {
          id: saved.listingId,
          title: saved.title || "Curated Vintage Piece",
          brand: saved.brand || "Sustainable Designer",
          price: saved.price || 45,
          images: [saved.image || "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop&auto=format"],
          category: (saved.category as any) || "Outerwear",
          size: saved.size || "M",
          condition: (saved.condition as any) || "Excellent",
          sellerId: "circular-collective",
          createdAt: new Date().toISOString(),
          sold: false,
        });
      }
    });

    const list = Array.from(itemsMap.values());

    // Filter by Category
    const filtered = selectedCategory === "All"
      ? list
      : list.filter((i) => i.category === selectedCategory);

    // Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0; // default recent
    });
  }, [listings, savedIds, dbSavedDetails, selectedCategory, sortBy]);

  // Total Wishlist Calculations
  const totalValue = wishlistItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  const totalCo2 = (wishlistItems.length * 3.8).toFixed(1);
  const totalWater = (wishlistItems.length * 2700).toLocaleString();

  const handleInstantBuy = (e: React.MouseEvent, item: Listing) => {
    e.stopPropagation();
    if (!isAuthenticated || !user) {
      showToast("Please sign in or create an account to acquire this piece 🌱", "info");
      navigate("/login", { state: { returnUrl: "/wishlist" } });
      return;
    }
    navigate("/payment", {
      state: {
        item: {
          id: item.id,
          title: item.title,
          price: item.price,
          img: item.images[0],
          brand: item.brand,
          size: item.size,
          condition: item.condition,
          seller: item.brand + " Collective",
        },
      },
    });
  };

  const handleRemove = async (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    await toggleSave(id);
    showToast(`Removed "${title}" from your wishlist.`, "info");
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear your entire circular wishlist?")) {
      setIsClearing(true);
      await clearAllSaved();
      setIsClearing(false);
      showToast("Wishlist has been cleared.", "info");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", padding: "7rem 2rem 5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Navigation Breadcrumb & Back Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <BackButton fallback="/shop" label="Back to Shop" />
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)" }}>
            <Link to="/home" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <Link to="/shop" style={{ color: "var(--muted)", textDecoration: "none" }}>Shop</Link>
            <span>/</span>
            <span style={{ color: "var(--accent)" }}>My Wishlist</span>
          </div>
        </div>

        {/* Hero Header */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(20,20,16,0.95), rgba(10,10,8,0.95))",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "2.5rem clamp(1.5rem, 4vw, 3rem)",
            marginBottom: "2.5rem",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "250px",
              height: "250px",
              background: "radial-gradient(circle, rgba(138,223,122,0.12) 0%, transparent 70%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  background: "rgba(138,223,122,0.12)",
                  border: "1px solid rgba(138,223,122,0.25)",
                  color: "var(--accent)",
                  borderRadius: "100px",
                  padding: "0.3rem 0.85rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  marginBottom: "0.85rem",
                }}
              >
                <span>♥ CIRCULAR VAULT</span>
                <span>·</span>
                <span>{savedIds.length} PIECES SAVED</span>
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 3.8vw, 3.2rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  marginBottom: "0.75rem",
                }}
              >
                Your Curated Wishlist
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1rem",
                  color: "var(--muted)",
                  maxWidth: "580px",
                  lineHeight: 1.6,
                }}
              >
                Archived favorites waiting for their conscious next chapter. Buy before these one-of-a-kind vintage pieces cycle away to another curator.
              </p>
            </div>

            {/* Eco Impact Stats Tile */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--border)",
                borderRadius: "18px",
                padding: "1.25rem 1.5rem",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.25rem",
                minWidth: "min(100%, 360px)",
              }}
            >
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)", marginBottom: "0.25rem" }}>
                  SAVED VALUE
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 800, color: "var(--fg)" }}>
                  {totalValue}₹
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--accent)", marginBottom: "0.25rem" }}>
                  CO₂ OFFSET
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 800, color: "var(--accent)" }}>
                  {totalCo2} kg
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#60a5fa", marginBottom: "0.25rem" }}>
                  WATER SAVED
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 800, color: "#60a5fa" }}>
                  {totalWater} L
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wishlist Controls Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
            padding: "1rem 1.25rem",
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
          }}
        >
          {/* Category Filter Chips */}
          <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.2rem" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? "var(--accent)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${selectedCategory === cat ? "var(--accent)" : "var(--border)"}`,
                  color: selectedCategory === cat ? "#0a0a08" : "var(--fg)",
                  borderRadius: "100px",
                  padding: "0.4rem 0.9rem",
                  fontSize: "0.78rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & Bulk Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border)",
                color: "var(--fg)",
                padding: "0.45rem 0.85rem",
                borderRadius: "100px",
                fontSize: "0.78rem",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="recent">Recently Added</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            {wishlistItems.length > 0 && (
              <button
                onClick={handleClearAll}
                disabled={isClearing}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#ef4444",
                  borderRadius: "100px",
                  padding: "0.45rem 0.85rem",
                  fontSize: "0.78rem",
                  fontFamily: "var(--font-mono)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {isClearing ? "Clearing…" : "Clear Wishlist"}
              </button>
            )}

            <button
              onClick={() => navigate("/shop")}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--accent)",
                borderRadius: "100px",
                padding: "0.45rem 1rem",
                fontSize: "0.78rem",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              + Explore Shop →
            </button>
          </div>
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 2rem",
              background: "var(--card-bg)",
              border: "1px dashed var(--border)",
              borderRadius: "24px",
              maxWidth: "600px",
              margin: "2rem auto",
            }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>♥</div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.8rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: "0.5rem",
              }}
            >
              Your Wishlist is Empty
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                color: "var(--muted)",
                lineHeight: 1.6,
                marginBottom: "2rem",
              }}
            >
              You haven't saved any circular fashion pieces yet. Click the heart icon on any drop in the shop or community to curate your conscious dream wardrobe.
            </p>
            <button
              onClick={() => navigate("/shop")}
              style={{
                background: "var(--accent)",
                color: "#0a0a08",
                border: "none",
                borderRadius: "100px",
                padding: "0.85rem 2.2rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(138,223,122,0.3)",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Start Exploring Pre-Loved Pieces →
            </button>
          </div>
        ) : (
          /* Wishlist Grid */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.75rem",
            }}
          >
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                style={{
                  background: "#141410",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, box-shadow 0.3s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = "rgba(138,223,122,0.35)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.5)";
                  const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                  if (img) img.style.transform = "scale(1.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                  const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                  if (img) img.style.transform = "scale(1)";
                }}
              >
                {/* Image & Badges */}
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "3/4",
                    overflow: "hidden",
                    background: "#1a1a16",
                  }}
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                    }}
                  />

                  {/* Condition Tag */}
                  <div
                    style={{
                      position: "absolute",
                      top: "0.85rem",
                      left: "0.85rem",
                      background: "rgba(10,10,8,0.85)",
                      backdropFilter: "blur(8px)",
                      borderRadius: "100px",
                      padding: "0.25rem 0.75rem",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.65rem",
                      color: conditionColor[item.condition] || "var(--fg)",
                      letterSpacing: "0.05em",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {item.condition}
                  </div>

                  {/* Remove Heart Button */}
                  <button
                    onClick={(e) => handleRemove(e, item.id, item.title)}
                    title="Remove from wishlist"
                    style={{
                      position: "absolute",
                      top: "0.85rem",
                      right: "0.85rem",
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      border: "none",
                      background: "rgba(10,10,8,0.75)",
                      backdropFilter: "blur(6px)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      color: "var(--accent)",
                      transition: "transform 0.2s ease, background 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.15)";
                      e.currentTarget.style.background = "rgba(239,68,68,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.background = "rgba(10,10,8,0.75)";
                    }}
                  >
                    ♥
                  </button>
                </div>

                {/* Card Content */}
                <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.68rem",
                      color: "var(--muted)",
                      letterSpacing: "0.06em",
                      marginBottom: "0.35rem",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{item.brand.toUpperCase()}</span>
                    <span>SIZE {item.size}</span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      lineHeight: 1.3,
                      marginBottom: "0.5rem",
                      color: "var(--fg)",
                    }}
                  >
                    {item.title}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.45rem",
                        fontWeight: 900,
                        color: "var(--accent)",
                      }}
                    >
                      {item.price}₹
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.68rem",
                        color: "var(--accent)",
                        opacity: 0.85,
                      }}
                    >
                      🌱 3.8kg CO₂ saved
                    </div>
                  </div>

                  {/* Actions Dock */}
                  <div style={{ marginTop: "auto", display: "grid", gridTemplateColumns: "1fr auto", gap: "0.5rem" }}>
                    <button
                      onClick={(e) => handleInstantBuy(e, item)}
                      style={{
                        background: "var(--accent)",
                        color: "#0a0a08",
                        border: "none",
                        borderRadius: "100px",
                        padding: "0.65rem 1rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem",
                        transition: "opacity 0.2s ease, transform 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      <span>⚡ Instant Buy</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${item.id}`);
                      }}
                      title="View Details"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid var(--border)",
                        color: "var(--fg)",
                        borderRadius: "100px",
                        padding: "0.65rem 0.85rem",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        transition: "border-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    >
                      Details ↗
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

