import { useState } from "react";
import { useStore, type Listing } from "../../contexts/StoreContext";
import { useAuth } from "../../hooks/useAuth";
import type { Category, Condition } from "../../types/listing.types";
import BackButton from "../../components/shared/BackButton";

const CATEGORIES: Category[] = [
  "Jackets",
  "Denim",
  "Long Coats",
  "Tees & Tops",
  "Sweaters",
];

const CONDITIONS: Condition[] = ["Like New", "Excellent", "Good", "Fair"];

export default function ListingsPage() {
  const { listings, updateListingStatus, editListing, deleteListing, openNewListingModal } = useStore();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "active" | "sold">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Edit State
  const [editingItem, setEditingItem] = useState<Listing | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editSize, setEditSize] = useState("M");
  const [editCategory, setEditCategory] = useState<Category>("Outerwear");
  const [editCondition, setEditCondition] = useState<Condition>("Excellent");
  const [editDescription, setEditDescription] = useState("");

  const activeCount = listings.filter((l) => !l.sold).length;
  const soldCount = listings.filter((l) => l.sold).length;
  const totalValue = listings.reduce((acc, l) => acc + (Number(l.price) || 0), 0);
  const soldEarnings = listings.filter((l) => l.sold).reduce((acc, l) => acc + (Number(l.price) || 0), 0);

  const filtered = listings
    .filter((l) => {
      if (filter === "active") return !l.sold;
      if (filter === "sold") return l.sold;
      return true;
    })
    .filter((l) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        l.title.toLowerCase().includes(q) ||
        l.brand.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
      );
    });

  const handleStartEdit = (item: Listing) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditBrand(item.brand);
    setEditPrice(String(item.price));
    setEditSize(item.size || "M");
    setEditCategory(item.category as Category);
    setEditCondition(item.condition as Condition);
    setEditDescription(item.description || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    await editListing(editingItem.id, {
      title: editTitle.trim(),
      brand: editBrand.trim(),
      price: Number(editPrice) || editingItem.price,
      size: editSize,
      category: editCategory,
      condition: editCondition,
      description: editDescription.trim(),
    });

    setEditingItem(null);
  };

  return (
    <section className="section-pad" style={{ minHeight: "100vh", padding: "3.5rem 2rem 6rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Top Back Navigation */}
        <div style={{ marginBottom: "1.75rem" }}>
          <BackButton fallback="/home" label="Back to Home" />
        </div>

        {/* Header & Seller Badge */}
        <div
          className="reveal"
          style={{
            marginBottom: "2.5rem",
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
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(234, 179, 8, 0.12)",
                border: "1px solid rgba(234, 179, 8, 0.3)",
                padding: "0.3rem 0.85rem",
                borderRadius: "100px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "#facc15",
                letterSpacing: "0.08em",
                marginBottom: "0.85rem",
                fontWeight: 700,
              }}
            >
              <span>🏷️ VERIFIED SELLER PORTAL</span>
              <span>·</span>
              <span>{user?.name || "EcoStudio"}</span>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 4vw, 3.8rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Inventory & Sales
            </h1>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            {/* Filter buttons */}
            <div style={{ display: "flex", gap: "0.4rem", background: "rgba(255,255,255,0.03)", padding: "4px", borderRadius: "100px", border: "1px solid var(--border)" }}>
              {(["all", "active", "sold"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "0.4rem 1.1rem",
                    borderRadius: "100px",
                    border: "none",
                    background: filter === f ? "var(--accent)" : "transparent",
                    color: filter === f ? "#0a0a08" : "var(--muted)",
                    fontWeight: filter === f ? 700 : 500,
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textTransform: "capitalize",
                  }}
                >
                  {f === "all" ? `All (${listings.length})` : f === "active" ? `Active (${activeCount})` : `Sold (${soldCount})`}
                </button>
              ))}
            </div>

            {/* Create new listing */}
            <button
              onClick={openNewListingModal}
              style={{
                background: "var(--accent)",
                color: "#0a0a08",
                border: "none",
                borderRadius: "100px",
                padding: "0.6rem 1.4rem",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "transform 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span>+</span>
              <span>List a Piece</span>
            </button>
          </div>
        </div>

        {/* Seller KPI Performance Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "18px",
              padding: "1.35rem 1.5rem",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
              ACTIVE INVENTORY
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "var(--accent)" }}>
              {activeCount} <span style={{ fontSize: "0.9rem", color: "var(--muted)", fontWeight: 500 }}>pieces</span>
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.25rem" }}>
              Ready for sustainable purchase
            </div>
          </div>

          <div
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "18px",
              padding: "1.35rem 1.5rem",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
              PIECES CIRCULATED (SOLD)
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "#60a5fa" }}>
              {soldCount} <span style={{ fontSize: "0.9rem", color: "var(--muted)", fontWeight: 500 }}>completed</span>
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.25rem" }}>
              Extended garment lifecycles
            </div>
          </div>

          <div
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "18px",
              padding: "1.35rem 1.5rem",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
              TOTAL INVENTORY VALUE
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "#facc15" }}>
              {totalValue}₹
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.25rem" }}>
              Earnings from sold: {soldEarnings}₹
            </div>
          </div>

          <div
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "18px",
              padding: "1.35rem 1.5rem",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
              ECO EMISSIONS SAVED
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "var(--accent2)" }}>
              {(listings.length * 3.4).toFixed(1)} <span style={{ fontSize: "0.9rem", color: "var(--muted)", fontWeight: 500 }}>kg CO₂</span>
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.25rem" }}>
              Verified circular carbon offset
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "2rem" }}>
          <input
            type="text"
            placeholder="Search your inventory by piece title, brand, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "0.85rem 1.25rem",
              color: "var(--fg)",
              fontSize: "0.9rem",
              fontFamily: "var(--font-body)",
              outline: "none",
            }}
          />
        </div>

        {/* Listings Grid */}
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
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>👗</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              No {filter !== "all" ? filter : ""} pieces found
            </h3>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              {searchQuery ? "Try clearing your search query." : "Ready to list a pre-loved garment and earn with purpose?"}
            </p>
            <button
              onClick={openNewListingModal}
              style={{
                background: "var(--accent)",
                color: "#0a0a08",
                border: "none",
                borderRadius: "100px",
                padding: "0.75rem 1.8rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Create Your First Listing
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filtered.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "18px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, border-color 0.2s",
                }}
              >
                {/* Image */}
                <div style={{ aspectRatio: "4/5", background: "#1a1a14", position: "relative", overflow: "hidden" }}>
                  <img src={item.images[0]} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {item.sold && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,8,0.72)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--accent)", letterSpacing: "0.12em", border: "1px solid var(--accent)", padding: "0.35rem 0.9rem", borderRadius: "100px", fontWeight: 700 }}>
                        SOLD OUT
                      </span>
                    </div>
                  )}
                  <div style={{ position: "absolute", bottom: "0.75rem", right: "0.75rem", background: "rgba(10,10,8,0.85)", backdropFilter: "blur(8px)", borderRadius: "100px", padding: "0.3rem 0.75rem", fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 800, color: "var(--accent)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {item.price}₹
                  </div>
                  <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: "rgba(10,10,8,0.8)", backdropFilter: "blur(6px)", borderRadius: "100px", padding: "0.2rem 0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700, letterSpacing: "-0.01em", marginBottom: "0.35rem", color: "var(--fg)" }}>
                    {item.title}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.04em", marginBottom: "0.6rem" }}>
                    {item.brand} · Size {item.size} · {item.condition}
                  </div>

                  {item.description && (
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.45, marginBottom: "0.75rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {item.description}
                    </p>
                  )}

                  {/* Actions & Inventory Controls */}
                  <div style={{ marginTop: "auto", display: "flex", gap: "0.5rem", paddingTop: "0.85rem", borderTop: "1px solid var(--border)" }}>
                    {/* Edit Details */}
                    <button
                      onClick={() => handleStartEdit(item)}
                      style={{
                        flex: 1,
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid var(--border)",
                        color: "var(--fg)",
                        padding: "0.55rem 0.6rem",
                        borderRadius: "100px",
                        fontSize: "0.76rem",
                        cursor: "pointer",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.3rem",
                        transition: "all 0.2s",
                      }}
                      title="Update piece title, price, size, or description"
                    >
                      <span>✏️</span>
                      <span>Edit</span>
                    </button>

                    {/* Mark Sold / Relist */}
                    <button
                      onClick={() => updateListingStatus(item.id, !item.sold)}
                      style={{
                        flex: 1.2,
                        background: item.sold ? "rgba(138,223,122,0.12)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${item.sold ? "var(--accent)" : "var(--border)"}`,
                        color: item.sold ? "var(--accent)" : "var(--fg)",
                        padding: "0.55rem 0.6rem",
                        borderRadius: "100px",
                        fontSize: "0.76rem",
                        cursor: "pointer",
                        fontWeight: 600,
                        transition: "all 0.2s",
                      }}
                    >
                      {item.sold ? "↺ Relist" : "✓ Sold"}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove "${item.title}" from your inventory?`)) {
                          deleteListing(item.id);
                        }
                      }}
                      style={{
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        color: "#ef4444",
                        padding: "0.55rem 0.8rem",
                        borderRadius: "100px",
                        fontSize: "0.76rem",
                        cursor: "pointer",
                        fontWeight: 600,
                        transition: "all 0.2s",
                      }}
                      title="Delete piece permanently from database"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Listing Modal */}
        {editingItem && (
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
                maxWidth: "540px",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "#141410",
                border: "1px solid var(--border)",
                borderRadius: "24px",
                padding: "2.5rem 2rem",
                position: "relative",
                boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
              }}
            >
              <button
                onClick={() => setEditingItem(null)}
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
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#facc15", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                  SELLER INVENTORY UPDATE
                </div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800 }}>
                  Edit Piece Details
                </h2>
              </div>

              <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.35rem" }}>
                    ITEM TITLE *
                  </label>
                  <input
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      padding: "0.75rem 1rem",
                      color: "var(--fg)",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.35rem" }}>
                      BRAND *
                    </label>
                    <input
                      required
                      value={editBrand}
                      onChange={(e) => setEditBrand(e.target.value)}
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        padding: "0.75rem 1rem",
                        color: "var(--fg)",
                        fontSize: "0.9rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.35rem" }}>
                      PRICE (₹) *
                    </label>
                    <input
                      required
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        padding: "0.75rem 1rem",
                        color: "var(--fg)",
                        fontSize: "0.9rem",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.35rem" }}>
                      CATEGORY
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as Category)}
                      style={{
                        width: "100%",
                        background: "#181814",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        padding: "0.75rem 0.5rem",
                        color: "var(--fg)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.35rem" }}>
                      SIZE
                    </label>
                    <select
                      value={editSize}
                      onChange={(e) => setEditSize(e.target.value)}
                      style={{
                        width: "100%",
                        background: "#181814",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        padding: "0.75rem 0.5rem",
                        color: "var(--fg)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {["XS", "S", "M", "L", "XL", "OS", "28", "30", "32", "34"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.35rem" }}>
                      CONDITION
                    </label>
                    <select
                      value={editCondition}
                      onChange={(e) => setEditCondition(e.target.value as Condition)}
                      style={{
                        width: "100%",
                        background: "#181814",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        padding: "0.75rem 0.5rem",
                        color: "var(--fg)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {CONDITIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.35rem" }}>
                    DESCRIPTION
                  </label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      padding: "0.75rem 1rem",
                      color: "var(--fg)",
                      fontSize: "0.85rem",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                  <button
                    type="submit"
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
                    Save Changes to MongoDB
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
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
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
