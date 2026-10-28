import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../../contexts/StoreContext";
import type { Listing, Category, Condition } from "../../types/listing.types";

const conditionColor: Record<string, string> = {
  "Like New": "#8adf7a",
  Excellent: "#c8f564",
  Good: "#f0ece3",
  Fair: "var(--muted)",
};

const CATEGORIES: string[] = [
  "All",
  "Tops & Tees",
  "Outerwear",
  "Dresses",
  "Denim",
  "Shoes",
  "Accessories",
];

const CONDITIONS: string[] = ["All", "Like New", "Excellent", "Good", "Fair"];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "All";

  const { listings, openItemModal, openNewListingModal, savedIds, toggleSave } = useStore();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedCondition, setSelectedCondition] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("featured");

  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => !item.sold)
      .filter((item) => {
        // Search
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchBrand = item.brand.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchBrand && !matchDesc) return false;
        }

        // Category
        if (selectedCategory !== "All" && item.category !== selectedCategory) {
          return false;
        }

        // Condition
        if (selectedCondition !== "All" && item.condition !== selectedCondition) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0; // default featured
      });
  }, [listings, search, selectedCategory, selectedCondition, sortBy]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <section className="section-pad" style={{ minHeight: "100vh", padding: "4rem 2rem 6rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <div
          className="reveal"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2.5rem",
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
              CIRCULAR MARKETPLACE · {filteredListings.length} AVAILABLE PIECES
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
              Shop the cycle
            </h1>
          </div>

          <button
            onClick={openNewListingModal}
            style={{
              background: "var(--accent)",
              color: "#0a0a08",
              border: "none",
              borderRadius: "100px",
              padding: "0.75rem 1.75rem",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              transition: "transform 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            + List a Piece
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div
          className="reveal-up"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "18px",
            padding: "1.25rem 1.5rem",
            marginBottom: "2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {/* Top row: Search input & sort dropdown */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <div
              style={{
                flex: 1,
                minWidth: "260px",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                borderRadius: "100px",
                padding: "0.6rem 1.25rem",
              }}
            >
              <span style={{ color: "var(--muted)" }}>🔍</span>
              <input
                placeholder="Search by brand, style, item..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--fg)",
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-body)",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "0.8rem" }}
                >
                  ✕
                </button>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)" }}>SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: "#181814",
                  border: "1px solid var(--border)",
                  borderRadius: "100px",
                  padding: "0.6rem 1rem",
                  color: "var(--fg)",
                  fontSize: "0.85rem",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Bottom row: Category & condition chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)", marginRight: "0.5rem" }}>
              CATEGORY:
            </span>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  style={{
                    padding: "0.4rem 0.95rem",
                    borderRadius: "100px",
                    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                    background: active ? "rgba(138,223,122,0.18)" : "transparent",
                    color: active ? "var(--accent)" : "var(--muted)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.82rem",
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
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
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Condition row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)", marginRight: "0.5rem" }}>
              CONDITION:
            </span>
            {CONDITIONS.map((cond) => {
              const active = selectedCondition === cond;
              return (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  style={{
                    padding: "0.35rem 0.85rem",
                    borderRadius: "100px",
                    border: `1px solid ${active ? "var(--accent)" : "rgba(255,255,255,0.08)"}`,
                    background: active ? "rgba(138,223,122,0.15)" : "transparent",
                    color: active ? "var(--accent)" : "var(--muted)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.78rem",
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: active ? "0 0 10px rgba(138,223,122,0.2)" : "none",
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
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    }
                  }}
                >
                  {cond}
                </button>
              );
            })}
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "5rem 2rem",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔍</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              No pieces match your filters
            </h3>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Try adjusting your search query, or clear your filters to view all circular drops.
            </p>
            <button
              onClick={() => {
                setSearch("");
                handleCategoryChange("All");
                setSelectedCondition("All");
              }}
              style={{
                background: "transparent",
                border: "1px solid var(--accent)",
                color: "var(--accent)",
                padding: "0.6rem 1.4rem",
                borderRadius: "100px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filteredListings.map((item, index) => {
              const isSaved = savedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="reveal-scale"
                  data-delay={(index % 4) * 60}
                  onClick={() => openItemModal(item)}
                  style={{ cursor: "pointer", position: "relative" }}
                >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "3/4",
                      borderRadius: "16px",
                      overflow: "hidden",
                      marginBottom: "1rem",
                      background: "#1a1a16",
                      transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                    }}
                    onMouseEnter={(e) => {
                      const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                      if (img) img.style.transform = "scale(1.08)";
                      const overlay = e.currentTarget.querySelector(".shop-card-hover") as HTMLElement;
                      if (overlay) overlay.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                      if (img) img.style.transform = "scale(1)";
                      const overlay = e.currentTarget.querySelector(".shop-card-hover") as HTMLElement;
                      if (overlay) overlay.style.opacity = "0";
                    }}
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    />

                    {/* Condition badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "0.75rem",
                        left: "0.75rem",
                        background: "rgba(10,10,8,0.85)",
                        backdropFilter: "blur(8px)",
                        borderRadius: "100px",
                        padding: "0.25rem 0.75rem",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.65rem",
                        color: conditionColor[item.condition] || "var(--fg)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {item.condition}
                    </div>

                    {/* Wishlist toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(item.id);
                      }}
                      style={{
                        position: "absolute",
                        top: "0.75rem",
                        right: "0.75rem",
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        border: "none",
                        background: "rgba(10,10,8,0.75)",
                        backdropFilter: "blur(6px)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.95rem",
                        color: isSaved ? "var(--accent)" : "var(--fg)",
                        transition: "transform 0.2s",
                        zIndex: 3,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      {isSaved ? "♥" : "♡"}
                    </button>

                    {/* Price tag */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0.75rem",
                        right: "0.75rem",
                        background: "var(--accent)",
                        borderRadius: "100px",
                        padding: "0.35rem 0.9rem",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "#0a0a08",
                      }}
                    >
                      {item.price}₹
                    </div>

                    {/* Hover Quick Action */}
                    <div
                      className="shop-card-hover"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(10,10,8,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.25s ease",
                        pointerEvents: "none",
                      }}
                    >
                      <span
                        style={{
                          background: "var(--accent)",
                          color: "#0a0a08",
                          padding: "0.55rem 1.35rem",
                          borderRadius: "100px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.05em",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                        }}
                      >
                        VIEW & BUY →
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.65rem",
                      color: "var(--muted)",
                      letterSpacing: "0.06em",
                      marginBottom: "0.25rem",
                    }}
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
        )}
      </div>
    </section>
  );
}
