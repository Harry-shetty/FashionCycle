import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore, type Listing } from "../../contexts/StoreContext";
import { useAuth } from "../../hooks/useAuth";
import { apiRequest } from "../../services/api";
import BackButton from "../../components/shared/BackButton";

interface CommunityPostItem {
  _id?: string;
  name: string;
  handle: string;
  text: string;
  avatar: string;
  items: number;
  likes?: number;
}

interface SellerProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  city: string;
  badge: string;
  bio: string;
  piecesCirculated: number;
  co2Saved: number;
  initialFollowers: number;
  featuredCategory: string;
}

interface TopSeller {
  id: string;
  sellerProfileId: string;
  name: string;
  handle: string;
  avatar: string;
  rank: number;
  badge: string;
  piecesCirculated: number;
  co2Saved: number;
  specialty: string;
  city: string;
  rating: string;
  followers: number;
  featuredDrop: string;
}

const FEATURED_SELLERS: SellerProfile[] = [
  {
    id: "seller-01",
    name: "Aarav Mehta",
    handle: "@aaravcycles",
    avatar: "AM",
    city: "Bengaluru, IN",
    badge: "🌱 Eco Master",
    bio: "Dedicated to heritage selvedge denim and zero-waste tailoring. Circulating certified vintage and upcycled classics.",
    piecesCirculated: 42,
    co2Saved: 184.2,
    initialFollowers: 1620,
    featuredCategory: "Denim",
  },
  {
    id: "seller-02",
    name: "Priya Nair",
    handle: "@priyaonrepeat",
    avatar: "PN",
    city: "Bengaluru, IN",
    badge: "♻️ Zero Waste Hero",
    bio: "Repeat, restyle, recirculate. Believer in conscious capsule wardrobes and diverting pre-loved high-quality pieces from landfills.",
    piecesCirculated: 36,
    co2Saved: 142.8,
    initialFollowers: 1410,
    featuredCategory: "Dresses",
  },
  {
    id: "seller-03",
    name: "Elena Rostova",
    handle: "@elenavintage",
    avatar: "ER",
    city: "Bengaluru, IN",
    badge: "👗 Vintage Curator",
    bio: "Specializing in pre-loved European wool coats, designer wrap dresses & verified luxury knitwear. Each garment is authenticated.",
    piecesCirculated: 29,
    co2Saved: 118.5,
    initialFollowers: 1180,
    featuredCategory: "Outerwear",
  },
  {
    id: "seller-04",
    name: "Studio Noir Vintage",
    handle: "@studionoir",
    avatar: "SN",
    city: "Bengaluru, IN",
    badge: "✨ Archival Studio",
    bio: "Specializing in minimalist 90s tailoring, pure silk sets & archival outerwear. Curating timeless circular pieces.",
    piecesCirculated: 26,
    co2Saved: 104.8,
    initialFollowers: 1020,
    featuredCategory: "Dresses",
  },
  {
    id: "seller-05",
    name: "Kavya Nair",
    handle: "@kavyacircles",
    avatar: "KN",
    city: "Delhi, IN",
    badge: "✨ Trend Setter",
    bio: "Promoting organic cottons, handloom textiles & circular everyday essentials. Slow fashion advocate.",
    piecesCirculated: 22,
    co2Saved: 94.2,
    initialFollowers: 860,
    featuredCategory: "Tops & Tees",
  },
  {
    id: "seller-06",
    name: "Marcus Vance",
    handle: "@vancestudio",
    avatar: "MV",
    city: "Mumbai, IN",
    badge: "✨ Heritage Curator",
    bio: "Circulating sustainable menswear: heritage blazers, cashmere turtlenecks, relaxed pleated trousers and artisan accessories.",
    piecesCirculated: 18,
    co2Saved: 78.6,
    initialFollowers: 720,
    featuredCategory: "Outerwear",
  },
];

const TOP_SELLERS: TopSeller[] = [
  {
    id: "top-seller-01",
    sellerProfileId: "seller-01",
    name: "Aarav Mehta",
    handle: "@aaravcycles",
    avatar: "AM",
    rank: 1,
    badge: "🌱 Eco Master",
    piecesCirculated: 42,
    co2Saved: 184.2,
    specialty: "Heritage Denim & Upcycled Workwear",
    city: "Bengaluru, IN",
    rating: "5.0 ★",
    followers: 1620,
    featuredDrop: "Japanese Selvedge Denim & Utility Overalls",
  },
  {
    id: "top-seller-02",
    sellerProfileId: "seller-02",
    name: "Priya Nair",
    handle: "@priyaonrepeat",
    avatar: "PN",
    rank: 2,
    badge: "♻️ Zero Waste Hero",
    piecesCirculated: 36,
    co2Saved: 142.8,
    specialty: "Capsule Silk Sets & Designer Archives",
    city: "Bengaluru, IN",
    rating: "4.9 ★",
    followers: 1410,
    featuredDrop: "Indigo Mulberry Silk Sets & Tailored Blazers",
  },
  {
    id: "top-seller-03",
    sellerProfileId: "seller-03",
    name: "Elena Rostova",
    handle: "@elenavintage",
    avatar: "ER",
    rank: 3,
    badge: "👗 Vintage Curator",
    piecesCirculated: 29,
    co2Saved: 118.5,
    specialty: "Pre-loved European Wool & Luxury Knits",
    city: "Bengaluru, IN",
    rating: "5.0 ★",
    followers: 1180,
    featuredDrop: "Double-Breasted Wool Overcoats & Mohair Scarves",
  },
  {
    id: "top-seller-04",
    sellerProfileId: "seller-04",
    name: "Studio Noir Vintage",
    handle: "@studionoir",
    avatar: "SN",
    rank: 4,
    badge: "✨ Archival Studio",
    piecesCirculated: 26,
    co2Saved: 104.8,
    specialty: "Minimalist 90s Tailoring & Silk",
    city: "Bengaluru, IN",
    rating: "4.9 ★",
    followers: 1020,
    featuredDrop: "Relaxed Italian Wool Blazers & Silk Tops",
  },
  {
    id: "top-seller-05",
    sellerProfileId: "seller-05",
    name: "Kavya Nair",
    handle: "@kavyacircles",
    avatar: "KN",
    rank: 5,
    badge: "✨ Trend Setter",
    piecesCirculated: 22,
    co2Saved: 94.2,
    specialty: "Organic Cottons & Handloom Outerwear",
    city: "Delhi, IN",
    rating: "4.8 ★",
    followers: 860,
    featuredDrop: "Handwoven Khadi Trench Coats",
  },
  {
    id: "top-seller-06",
    sellerProfileId: "seller-06",
    name: "Marcus Vance",
    handle: "@vancestudio",
    avatar: "MV",
    rank: 6,
    badge: "✨ Heritage Curator",
    piecesCirculated: 18,
    co2Saved: 78.6,
    specialty: "Heritage Menswear & Cashmere",
    city: "Mumbai, IN",
    rating: "4.9 ★",
    followers: 720,
    featuredDrop: "Pleated Trousers & Chunky Cardigans",
  },
];

export default function CommunityPage() {
  const navigate = useNavigate();
  const { listings, showToast, openNewListingModal } = useStore();
  const { user, isSeller } = useAuth();

  // Seller active tab
  const [activeTab, setActiveTab] = useState<"account" | "stories">("account");

  // Buyer filter mode: "all" | "top_sellers" | "following" | "suggestions"
  const [buyerFilter, setBuyerFilter] = useState<"all" | "top_sellers" | "following" | "suggestions">("all");

  // Editable Bio state for logged in seller
  const [sellerBio, setSellerBio] = useState(() => {
    return (
      localStorage.getItem("fc_seller_bio") ||
      "Official Sustainable Studio on FashionCycle. Specializing in archival vintage, verified woolens, authenticated designer tailoring, and zero-plastic eco shipments."
    );
  });
  const [sellerCity, setSellerCity] = useState("Bengaluru, Karnataka, IN");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [draftBio, setDraftBio] = useState(sellerBio);
  const [draftCity, setDraftCity] = useState(sellerCity);

  // Follow State (stored in localStorage)
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("fc_following_sellers");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [followersCountMap, setFollowersCountMap] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    FEATURED_SELLERS.forEach((s) => {
      counts[s.id] = s.initialFollowers;
    });
    return counts;
  });

  // Community Posts from MongoDB
  const [posts, setPosts] = useState<CommunityPostItem[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  useEffect(() => {
    apiRequest<CommunityPostItem[]>("/community")
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setPosts(res);
        }
      })
      .catch((err) => {
        console.warn("MongoDB community fetch warning:", err);
      });
  }, []);

  const handleToggleFollow = (seller: SellerProfile) => {
    const isCurrentlyFollowing = !!followingMap[seller.id];
    const newFollowingState = !isCurrentlyFollowing;

    const updatedFollowing = {
      ...followingMap,
      [seller.id]: newFollowingState,
    };
    setFollowingMap(updatedFollowing);
    localStorage.setItem("fc_following_sellers", JSON.stringify(updatedFollowing));

    setFollowersCountMap((prev) => ({
      ...prev,
      [seller.id]: (prev[seller.id] || seller.initialFollowers) + (newFollowingState ? 1 : -1),
    }));

    if (newFollowingState) {
      showToast(`You are now following ${seller.name}! You'll receive instant drop updates. 🌿`, "success");
    } else {
      showToast(`Unfollowed ${seller.name}.`, "info");
    }
  };

  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    setSellerBio(draftBio);
    setSellerCity(draftCity);
    localStorage.setItem("fc_seller_bio", draftBio);
    setIsEditingBio(false);
    showToast("Seller About & Bio updated successfully! ✨", "success");
  };

  const handleShareProfile = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast("Seller profile link copied to clipboard! 📋", "info");
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    setIsSubmittingPost(true);
    try {
      const authorName = user?.name || "Admin Seller Studio";
      const authorHandle = user?.email ? `@${user.email.split("@")[0]}` : "@admin_seller";

      const created = await apiRequest<CommunityPostItem>("/community", {
        method: "POST",
        body: JSON.stringify({
          name: authorName,
          handle: authorHandle,
          text: newPostText.trim(),
          avatar: authorName.slice(0, 2).toUpperCase(),
          items: 1,
        }),
      });

      setPosts((prev) => [created, ...prev]);
      setNewPostText("");
      setIsShareModalOpen(false);
      showToast("Your community story has been published to MongoDB! 🌿");
    } catch (err: any) {
      showToast(err?.message || "Failed to publish post", "error");
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Active listings for other sellers
  const getSellerListings = (seller: SellerProfile): Listing[] => {
    const matches = listings.filter((l) => !l.sold);
    const categoryMatches = matches.filter((l) => l.category === seller.featuredCategory);
    return (categoryMatches.length > 0 ? categoryMatches : matches).slice(0, 3);
  };

  // My listings (for the logged in seller)
  const myListings = useMemo(() => listings.filter((l) => !l.sold), [listings]);

  // Derived arrays for buyer view
  const followedSellers = useMemo(() => {
    return FEATURED_SELLERS.filter((s) => !!followingMap[s.id]);
  }, [followingMap]);

  const suggestedSellers = useMemo(() => {
    return FEATURED_SELLERS;
  }, []);

  return (
    <section className="section-pad" style={{ minHeight: "100vh", padding: "4rem 2rem 6rem", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        
        {/* Navigation Breadcrumb & Back Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <BackButton fallback="/home" label="Back to Home" />
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)" }}>
            <Link to="/home" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <span style={{ color: "var(--accent)" }}>
              {isSeller ? "Seller Community & Profile" : "Buyer Community Network"}
            </span>
          </div>
        </div>

        {/* ========================================================
            IF SELLER ACCOUNT: SHOW SELLER'S INSTAGRAM PROFILE FIRST,
            THEN SHOW SUGGESTIONS
        ======================================================== */}
        {isSeller ? (
          <>
            {/* PART 1: THE SELLER'S ABOUT (INSTAGRAM "MY ACCOUNT" STYLE) */}
            <div
              style={{
                background: "linear-gradient(180deg, rgba(20,20,16,0.98) 0%, rgba(12,12,10,0.98) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "28px",
                padding: "2.5rem clamp(1.5rem, 4vw, 3rem)",
                marginBottom: "3.5rem",
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Subtle Top Accent Ribbon */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #facc15, var(--accent), #38bdf8)",
                }}
              />

              {/* Instagram Account Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "clamp(1.5rem, 4vw, 3rem)",
                  flexWrap: "wrap",
                  paddingBottom: "2rem",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  marginBottom: "2rem",
                }}
              >
                {/* Instagram Story-Ring Avatar */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div
                    style={{
                      width: "104px",
                      height: "104px",
                      borderRadius: "50%",
                      padding: "3px",
                      background: "linear-gradient(45deg, #facc15, #8adf7a, #38bdf8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 24px rgba(138,223,122,0.3)",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        background: "#0a0a08",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-display)",
                        fontWeight: 900,
                        fontSize: "2.2rem",
                        color: "var(--accent)",
                      }}
                    >
                      {user?.name ? user.name.slice(0, 2).toUpperCase() : "AS"}
                    </div>
                  </div>

                  {/* Verified Badge */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "2px",
                      right: "2px",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "#10b981",
                      border: "3px solid #0a0a08",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.85rem",
                      color: "#0a0a08",
                      fontWeight: 900,
                    }}
                    title="Verified Circular Merchant"
                  >
                    ✓
                  </div>
                </div>

                {/* Profile Info & Action Controls */}
                <div style={{ flex: 1, minWidth: "280px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      flexWrap: "wrap",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <h1
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)",
                        fontWeight: 800,
                        margin: 0,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {user?.email ? `@${user.email.split("@")[0]}` : "@admin_seller"}
                    </h1>

                    <span
                      style={{
                        background: "rgba(234, 179, 8, 0.14)",
                        border: "1px solid rgba(234, 179, 8, 0.35)",
                        color: "#facc15",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: "100px",
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      🌿 VERIFIED SELLER ACCOUNT
                    </span>

                    {/* Instagram Action Buttons */}
                    <div style={{ display: "flex", gap: "0.5rem", marginLeft: "auto", flexWrap: "wrap" }}>
                      <button
                        onClick={openNewListingModal}
                        style={{
                          background: "var(--accent)",
                          color: "#0a0a08",
                          border: "none",
                          borderRadius: "100px",
                          padding: "0.5rem 1.25rem",
                          fontFamily: "var(--font-body)",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "transform 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      >
                        + List a Piece
                      </button>

                      <button
                        onClick={() => navigate("/listings")}
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          color: "var(--fg)",
                          border: "1px solid var(--border)",
                          borderRadius: "100px",
                          padding: "0.5rem 1.1rem",
                          fontFamily: "var(--font-body)",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "border-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                      >
                        Manage Inventory
                      </button>

                      <button
                        onClick={() => setIsEditingBio(!isEditingBio)}
                        style={{
                          background: isEditingBio ? "rgba(138,223,122,0.15)" : "rgba(255,255,255,0.06)",
                          color: isEditingBio ? "var(--accent)" : "var(--fg)",
                          border: `1px solid ${isEditingBio ? "var(--accent)" : "var(--border)"}`,
                          borderRadius: "100px",
                          padding: "0.5rem 1rem",
                          fontFamily: "var(--font-body)",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {isEditingBio ? "Cancel Edit" : "✏️ Edit About"}
                      </button>

                      <button
                        onClick={handleShareProfile}
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          color: "var(--fg)",
                          border: "1px solid var(--border)",
                          borderRadius: "100px",
                          padding: "0.5rem 0.9rem",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.82rem",
                          cursor: "pointer",
                        }}
                        title="Share Seller Profile"
                      >
                        🔗
                      </button>
                    </div>
                  </div>

                  {/* Instagram Stats Row */}
                  <div
                    style={{
                      display: "flex",
                      gap: "clamp(1.5rem, 3.5vw, 3rem)",
                      marginBottom: "1.25rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.95rem",
                    }}
                  >
                    <div>
                      <strong style={{ color: "var(--fg)", fontSize: "1.1rem" }}>{myListings.length}</strong>{" "}
                      <span style={{ color: "var(--muted)" }}>pieces listed</span>
                    </div>
                    <div>
                      <strong style={{ color: "var(--fg)", fontSize: "1.1rem" }}>1,480</strong>{" "}
                      <span style={{ color: "var(--muted)" }}>followers</span>
                    </div>
                    <div>
                      <strong style={{ color: "var(--fg)", fontSize: "1.1rem" }}>192</strong>{" "}
                      <span style={{ color: "var(--muted)" }}>following</span>
                    </div>
                    <div>
                      <strong style={{ color: "var(--accent)", fontSize: "1.1rem" }}>74.2 kg</strong>{" "}
                      <span style={{ color: "var(--muted)" }}>CO₂ diverted</span>
                    </div>
                  </div>

                  {/* Instagram "About" Bio Block */}
                  {isEditingBio ? (
                    <form onSubmit={handleSaveBio} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", background: "rgba(255,255,255,0.03)", padding: "1.25rem", borderRadius: "16px", border: "1px solid var(--border)" }}>
                      <div>
                        <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.25rem" }}>
                          ABOUT BIO DESCRIPTION
                        </label>
                        <textarea
                          rows={3}
                          value={draftBio}
                          onChange={(e) => setDraftBio(e.target.value)}
                          style={{
                            width: "100%",
                            background: "rgba(0,0,0,0.5)",
                            border: "1px solid var(--border)",
                            borderRadius: "10px",
                            padding: "0.6rem 0.85rem",
                            color: "var(--fg)",
                            fontSize: "0.88rem",
                            fontFamily: "var(--font-body)",
                            resize: "vertical",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.25rem" }}>
                          CITY & LOCATION
                        </label>
                        <input
                          type="text"
                          value={draftCity}
                          onChange={(e) => setDraftCity(e.target.value)}
                          style={{
                            width: "100%",
                            background: "rgba(0,0,0,0.5)",
                            border: "1px solid var(--border)",
                            borderRadius: "10px",
                            padding: "0.6rem 0.85rem",
                            color: "var(--fg)",
                            fontSize: "0.88rem",
                            fontFamily: "var(--font-body)",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                        <button
                          type="submit"
                          style={{
                            background: "var(--accent)",
                            color: "#0a0a08",
                            border: "none",
                            borderRadius: "100px",
                            padding: "0.5rem 1.25rem",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingBio(false)}
                          style={{
                            background: "transparent",
                            color: "var(--muted)",
                            border: "1px solid var(--border)",
                            borderRadius: "100px",
                            padding: "0.5rem 1rem",
                            fontSize: "0.82rem",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "var(--fg)", marginBottom: "0.2rem" }}>
                        {user?.name || "Admin Seller Studio"}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent)", marginBottom: "0.5rem" }}>
                        🌿 Sustainable Fashion Archive & Curated Studio
                      </div>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.92rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.5, margin: "0 0 0.5rem", maxWidth: "620px" }}>
                        {sellerBio}
                      </p>
                      <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)" }}>
                        <span>📍 {sellerCity}</span>
                        <span style={{ color: "var(--accent)" }}>🔗 fashioncycle.eco/seller/admin</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Seller Profile Tab Bar */}
              <div
                style={{
                  display: "flex",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  justifyContent: "center",
                  gap: "2.5rem",
                  paddingTop: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <button
                  onClick={() => setActiveTab("account")}
                  style={{
                    background: "transparent",
                    border: "none",
                    borderTop: activeTab === "account" ? "2px solid var(--accent)" : "2px solid transparent",
                    color: activeTab === "account" ? "var(--accent)" : "var(--muted)",
                    padding: "0.75rem 0.5rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    letterSpacing: "0.06em",
                  }}
                >
                  <span>田</span>
                  <span>MY LISTINGS ({myListings.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab("stories")}
                  style={{
                    background: "transparent",
                    border: "none",
                    borderTop: activeTab === "stories" ? "2px solid var(--accent)" : "2px solid transparent",
                    color: activeTab === "stories" ? "var(--accent)" : "var(--muted)",
                    padding: "0.75rem 0.5rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    letterSpacing: "0.06em",
                  }}
                >
                  <span>💬</span>
                  <span>COMMUNITY STORIES ({posts.length})</span>
                </button>
              </div>

              {/* Seller's Own Listed Pieces Grid (Instagram Post Grid Style) */}
              {activeTab === "account" && (
                <div>
                  {myListings.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--muted)" }}>
                      <p>You haven't listed any circular pieces yet.</p>
                      <button
                        onClick={openNewListingModal}
                        style={{
                          background: "var(--accent)",
                          color: "#0a0a08",
                          border: "none",
                          borderRadius: "100px",
                          padding: "0.6rem 1.4rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          marginTop: "0.5rem",
                        }}
                      >
                        + List Your First Piece
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                        gap: "1.25rem",
                      }}
                    >
                      {myListings.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => navigate(`/product/${item.id}`)}
                          style={{
                            position: "relative",
                            aspectRatio: "3/4",
                            borderRadius: "16px",
                            overflow: "hidden",
                            background: "#181814",
                            border: "1px solid var(--border)",
                            cursor: "pointer",
                            transition: "transform 0.3s ease, border-color 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.borderColor = "var(--accent)";
                            const overlay = e.currentTarget.querySelector(".insta-overlay") as HTMLElement;
                            if (overlay) overlay.style.opacity = "1";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.borderColor = "var(--border)";
                            const overlay = e.currentTarget.querySelector(".insta-overlay") as HTMLElement;
                            if (overlay) overlay.style.opacity = "0";
                          }}
                        >
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />

                          {/* Top Tag */}
                          <div
                            style={{
                              position: "absolute",
                              top: "0.75rem",
                              left: "0.75rem",
                              background: "rgba(10,10,8,0.8)",
                              backdropFilter: "blur(6px)",
                              borderRadius: "100px",
                              padding: "0.2rem 0.65rem",
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.65rem",
                              color: "var(--accent)",
                            }}
                          >
                            {item.condition}
                          </div>

                          {/* Hover Info Overlay */}
                          <div
                            className="insta-overlay"
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: "linear-gradient(to top, rgba(10,10,8,0.95) 0%, rgba(10,10,8,0.4) 60%, transparent 100%)",
                              opacity: 0,
                              transition: "opacity 0.25s ease",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "flex-end",
                              padding: "1.25rem",
                            }}
                          >
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)" }}>
                              {item.brand.toUpperCase()} · SIZE {item.size}
                            </div>
                            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.4rem" }}>
                              {item.title}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 900, color: "var(--accent)" }}>
                                {item.price}₹
                              </span>
                              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#facc15" }}>
                                View Specifications ↗
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Stories Tab */}
              {activeTab === "stories" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                  {posts.map((post, idx) => (
                    <div
                      key={post._id || idx}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--border)",
                        borderRadius: "16px",
                        padding: "1.25rem",
                      }}
                    >
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.75rem" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent)", color: "#0a0a08", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem" }}>
                          {post.avatar}
                        </div>
                        <div>
                          <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9rem" }}>{post.name}</div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>{post.handle}</div>
                        </div>
                      </div>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.5, margin: 0 }}>
                        &ldquo;{post.text}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PART 2: SUGGESTED SELLERS FOR SELLER VIEW */}
            <div style={{ marginTop: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginBottom: "1.75rem",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
                      color: "var(--accent)",
                      letterSpacing: "0.1em",
                      marginBottom: "0.35rem",
                      fontWeight: 700,
                    }}
                  >
                    <span>✨ DISCOVER PEER CURATORS</span>
                    <span>·</span>
                    <span>SUGGESTED FOR YOU</span>
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.8rem, 3.2vw, 2.4rem)",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                      margin: 0,
                    }}
                  >
                    Suggested Sellers & Lookbooks
                  </h2>
                </div>

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  style={{
                    background: "transparent",
                    color: "var(--accent)",
                    border: "1px solid var(--accent)",
                    borderRadius: "100px",
                    padding: "0.5rem 1.25rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(138,223,122,0.15)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  + Share Story in Community
                </button>
              </div>

              {/* Suggested Sellers Grid */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {suggestedSellers.map((seller) => {
                  const isFollowing = !!followingMap[seller.id];
                  const followersCount = followersCountMap[seller.id] || seller.initialFollowers;
                  const sellerPieces = getSellerListings(seller);

                  return (
                    <div
                      key={seller.id}
                      style={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "24px",
                        padding: "2rem",
                        transition: "border-color 0.2s ease, transform 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(138,223,122,0.3)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                          gap: "1.25rem",
                          marginBottom: "1.5rem",
                        }}
                      >
                        <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
                          <div
                            style={{
                              width: "64px",
                              height: "64px",
                              borderRadius: "50%",
                              padding: "2px",
                              background: "linear-gradient(45deg, var(--accent), var(--accent2))",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                background: "#0a0a08",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily: "var(--font-display)",
                                fontWeight: 800,
                                fontSize: "1.3rem",
                                color: "var(--accent)",
                              }}
                            >
                              {seller.avatar}
                            </div>
                          </div>

                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                              <h3
                                style={{
                                  fontFamily: "var(--font-display)",
                                  fontSize: "1.35rem",
                                  fontWeight: 800,
                                  margin: 0,
                                  color: "var(--fg)",
                                }}
                              >
                                {seller.name}
                              </h3>
                              <span
                                style={{
                                  background: "rgba(234, 179, 8, 0.14)",
                                  border: "1px solid rgba(234, 179, 8, 0.3)",
                                  color: "#facc15",
                                  fontSize: "0.68rem",
                                  fontWeight: 700,
                                  padding: "2px 8px",
                                  borderRadius: "100px",
                                  fontFamily: "var(--font-mono)",
                                }}
                              >
                                {seller.badge}
                              </span>
                            </div>

                            <div
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.75rem",
                                color: "var(--muted)",
                                marginTop: "0.25rem",
                              }}
                            >
                              {seller.handle} · {seller.city} · {followersCount.toLocaleString()} Followers
                            </div>

                            <div
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "0.75rem",
                                color: "var(--accent)",
                                marginTop: "0.2rem",
                              }}
                            >
                              Suggested · Followed by @admin_seller + 14 other sustainable curators
                            </div>
                          </div>
                        </div>

                        <div>
                          <button
                            onClick={() => handleToggleFollow(seller)}
                            style={{
                              background: isFollowing ? "rgba(138,223,122,0.14)" : "var(--accent)",
                              border: isFollowing ? "1px solid var(--accent)" : "none",
                              color: isFollowing ? "var(--accent)" : "#0a0a08",
                              borderRadius: "100px",
                              padding: "0.55rem 1.6rem",
                              fontFamily: "var(--font-body)",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.45rem",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <span>{isFollowing ? "✓ Following" : "+ Follow Seller"}</span>
                          </button>
                        </div>
                      </div>

                      <div
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: "14px",
                          padding: "1rem 1.25rem",
                          marginBottom: "1.5rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "1rem",
                        }}
                      >
                        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.5, maxWidth: "720px" }}>
                          &ldquo;{seller.bio}&rdquo;
                        </p>
                        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)" }}>
                            CIRCULATED: <strong style={{ color: "var(--fg)" }}>{seller.piecesCirculated} pcs</strong>
                          </div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)" }}>
                            CO₂ SAVED: <strong style={{ color: "var(--accent)" }}>{seller.co2Saved} kg</strong>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.7rem",
                            color: "var(--accent)",
                            letterSpacing: "0.08em",
                            fontWeight: 700,
                            marginBottom: "1rem",
                          }}
                        >
                          RECENT ARCHIVE PIECES FROM {seller.name.toUpperCase()} ({sellerPieces.length} AVAILABLE)
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                            gap: "1.25rem",
                          }}
                        >
                          {sellerPieces.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => navigate(`/product/${item.id}`)}
                              style={{
                                background: "#141410",
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
                              <div
                                style={{
                                  position: "relative",
                                  aspectRatio: "3/4",
                                  background: "#1a1a16",
                                  overflow: "hidden",
                                }}
                              >
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
                                    background: "rgba(10,10,8,0.85)",
                                    backdropFilter: "blur(6px)",
                                    borderRadius: "100px",
                                    padding: "0.2rem 0.6rem",
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.62rem",
                                    color: "var(--accent)",
                                  }}
                                >
                                  {item.condition}
                                </div>
                              </div>

                              <div style={{ padding: "1rem", display: "flex", flexDirection: "column", flex: 1 }}>
                                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem" }}>
                                  {item.title}
                                </div>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)", marginBottom: "0.75rem" }}>
                                  {item.brand} · Size {item.size}
                                </div>
                                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: "var(--accent)" }}>
                                    {item.price}₹
                                  </span>
                                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)" }}>
                                    View Details ↗
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* ========================================================
             BUYER ACCOUNT VIEW:
             "just list top buyers and following and sugesstions"
          ======================================================== */
          <div>
            {/* Header Area */}
            <div
              style={{
                marginBottom: "2.5rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  color: "var(--accent)",
                  letterSpacing: "0.12em",
                  marginBottom: "0.5rem",
                  fontWeight: 700,
                }}
              >
                <span>🌿 SUSTAINABLE SELLER STUDIOS</span>
                <span>·</span>
                <span>COMMUNITY</span>
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 3.8vw, 3rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  margin: "0 0 0.6rem",
                  color: "var(--fg)",
                  textAlign: "center",
                }}
              >
                Seller Community
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1.05rem",
                  color: "var(--muted)",
                  margin: "0 auto",
                  maxWidth: "700px",
                  textAlign: "center",
                }}
              >
                Explore verified sustainable sellers and vintage studios, follow curators you love, and shop pre-loved drops.
              </p>

              {/* Section Quick Filters */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "1.75rem",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { key: "all", label: "✦ All Sellers" },
                  { key: "top_sellers", label: "🏆 Top Sellers" },
                  { key: "following", label: `👥 Following (${followedSellers.length})` },
                  { key: "suggestions", label: "✨ Suggested Studios" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setBuyerFilter(tab.key as any)}
                    style={{
                      background: buyerFilter === tab.key ? "var(--accent)" : "rgba(255,255,255,0.04)",
                      color: buyerFilter === tab.key ? "#0a0a08" : "var(--fg)",
                      border: `1px solid ${buyerFilter === tab.key ? "var(--accent)" : "var(--border)"}`,
                      borderRadius: "100px",
                      padding: "0.55rem 1.25rem",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 1. TOP SELLERS SECTION */}
            {(buyerFilter === "all" || buyerFilter === "top_sellers") && (
              <div style={{ marginBottom: "4rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#facc15", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "0.35rem" }}>
                      VERIFIED MERCHANTS LEADERBOARD
                    </div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3vw, 2.3rem)", fontWeight: 900, margin: 0, lineHeight: 1.25, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span>🏆</span>
                      <span>Top Sellers</span>
                    </h2>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", paddingBottom: "0.25rem" }}>
                    Ranked by circular pieces circulated &amp; CO₂ diverted
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {TOP_SELLERS.map((seller) => {
                    const isRank1 = seller.rank === 1;
                    const isRank2 = seller.rank === 2;
                    const isRank3 = seller.rank === 3;

                    const medalColor = isRank1 ? "#facc15" : isRank2 ? "#e2e8f0" : isRank3 ? "#f97316" : "var(--muted)";
                    const medalGlow = isRank1 ? "rgba(250, 204, 21, 0.15)" : "transparent";

                    const matchedProfile = FEATURED_SELLERS.find((s) => s.id === seller.sellerProfileId);
                    const isFollowing = !!followingMap[seller.sellerProfileId];

                    return (
                      <div
                        key={seller.id}
                        style={{
                          background: "var(--card-bg)",
                          border: isRank1 ? "1px solid rgba(250, 204, 21, 0.45)" : "1px solid var(--border)",
                          borderRadius: "22px",
                          padding: "1.4rem",
                          boxShadow: isRank1 ? "0 10px 30px rgba(250, 204, 21, 0.08)" : "none",
                          display: "flex",
                          flexDirection: "column",
                          position: "relative",
                          transition: "transform 0.2s ease, border-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.borderColor = "var(--accent)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.borderColor = isRank1 ? "rgba(250, 204, 21, 0.45)" : "var(--border)";
                        }}
                      >
                        {/* Top Rank & Rating Header Bar */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              background: medalGlow,
                              border: `1px solid ${medalColor}`,
                              color: medalColor,
                              fontSize: "0.72rem",
                              fontWeight: 800,
                              fontFamily: "var(--font-mono)",
                              padding: "4px 10px",
                              borderRadius: "100px",
                              whiteSpace: "nowrap",
                              letterSpacing: "0.04em",
                              flexShrink: 0,
                            }}
                          >
                            <span>{isRank1 ? "🥇" : isRank2 ? "🥈" : isRank3 ? "🥉" : "✨"}</span>
                            <span>RANK #{seller.rank}</span>
                          </div>

                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              background: "rgba(250, 204, 21, 0.08)",
                              border: "1px solid rgba(250, 204, 21, 0.25)",
                              color: "#facc15",
                              fontSize: "0.74rem",
                              fontWeight: 700,
                              fontFamily: "var(--font-mono)",
                              padding: "3px 9px",
                              borderRadius: "100px",
                              whiteSpace: "nowrap",
                              flexShrink: 0,
                            }}
                          >
                            <span>★</span>
                            <span>{seller.rating.replace(" ★", "")}</span>
                          </div>
                        </div>

                        {/* Curator Avatar, Name & Handle */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "0.85rem" }}>
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, rgba(138,223,122,0.2), rgba(255,255,255,0.04))",
                              border: isRank1 ? "2px solid #facc15" : "2px solid rgba(138,223,122,0.35)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "var(--font-display)",
                              fontWeight: 900,
                              fontSize: "1.15rem",
                              color: isRank1 ? "#facc15" : "var(--accent)",
                              flexShrink: 0,
                              boxShadow: isRank1 ? "0 0 12px rgba(250, 204, 21, 0.25)" : "none",
                            }}
                          >
                            {seller.avatar}
                          </div>

                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 800,
                                fontSize: "1.1rem",
                                color: "var(--fg)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                lineHeight: 1.25,
                              }}
                              title={seller.name}
                            >
                              {seller.name}
                            </div>
                            <div
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.7rem",
                                color: "var(--muted)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                marginTop: "0.2rem",
                              }}
                            >
                              {seller.handle} · {seller.followers.toLocaleString()} followers
                            </div>
                          </div>
                        </div>

                        {/* Badge & City Bar */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "0.5rem",
                            marginBottom: "1rem",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.68rem",
                          }}
                        >
                          <span
                            style={{
                              background: "rgba(138, 223, 122, 0.08)",
                              border: "1px solid rgba(138, 223, 122, 0.2)",
                              color: "var(--accent)",
                              padding: "2px 8px",
                              borderRadius: "6px",
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {seller.badge}
                          </span>
                          <span style={{ color: "var(--muted)", whiteSpace: "nowrap", flexShrink: 0 }}>
                            📍 {seller.city.split(",")[0].trim()}
                          </span>
                        </div>

                        {/* Metrics Bar */}
                        <div
                          style={{
                            background: "rgba(255,255,255,0.025)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "14px",
                            padding: "0.85rem 1rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "1.1rem",
                          }}
                        >
                          <div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)", letterSpacing: "0.06em", marginBottom: "0.2rem" }}>
                              CIRCULATED
                            </div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: "var(--fg)", lineHeight: 1 }}>
                              {seller.piecesCirculated} <span style={{ fontSize: "0.72rem", fontWeight: 500, color: "var(--muted)" }}>pcs</span>
                            </div>
                          </div>

                          <div style={{ width: "1px", height: "26px", background: "rgba(255,255,255,0.1)" }} />

                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)", letterSpacing: "0.06em", marginBottom: "0.2rem" }}>
                              CO₂ DIVERTED
                            </div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>
                              {seller.co2Saved} <span style={{ fontSize: "0.72rem", fontWeight: 500, color: "var(--accent)" }}>kg</span>
                            </div>
                          </div>
                        </div>

                        {/* Specialty & Follow Button (Symmetrically Aligned) */}
                        <div style={{ marginTop: "auto", borderTop: "1px dashed rgba(255,255,255,0.08)", paddingTop: "0.9rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                          <div style={{ minHeight: "60px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <div
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.62rem",
                                color: "var(--muted)",
                                marginBottom: "0.25rem",
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              title={`SPECIALTY: ${seller.specialty}`}
                            >
                              SPECIALTY: {seller.specialty}
                            </div>
                            <div
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "0.82rem",
                                color: "rgba(255,255,255,0.9)",
                                fontStyle: "italic",
                                lineHeight: 1.35,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                              title={seller.featuredDrop}
                            >
                              &ldquo;{seller.featuredDrop}&rdquo;
                            </div>
                          </div>

                          {matchedProfile && (
                            <button
                              type="button"
                              onClick={() => handleToggleFollow(matchedProfile)}
                              style={{
                                width: "100%",
                                height: "40px",
                                background: isFollowing ? "rgba(138,223,122,0.12)" : "var(--accent)",
                                border: isFollowing ? "1px solid var(--accent)" : "none",
                                color: isFollowing ? "var(--accent)" : "#0a0a08",
                                borderRadius: "100px",
                                fontFamily: "var(--font-body)",
                                fontSize: "0.82rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.4rem",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                if (!isFollowing) e.currentTarget.style.transform = "scale(1.02)";
                              }}
                              onMouseLeave={(e) => {
                                if (!isFollowing) e.currentTarget.style.transform = "scale(1)";
                              }}
                            >
                              <span>{isFollowing ? "✓ Following" : "+ Follow Curator"}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. FOLLOWING SECTION */}
            {(buyerFilter === "all" || buyerFilter === "following") && (
              <div style={{ marginBottom: "4rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "0.25rem" }}>
                      YOUR CURATED SELLER FEED
                    </div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", fontWeight: 900, margin: 0 }}>
                      👥 Following ({followedSellers.length})
                    </h2>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)" }}>
                    Direct access to new pieces from your favorite curators
                  </span>
                </div>

                {followedSellers.length === 0 ? (
                  <div
                    style={{
                      background: "var(--card-bg)",
                      border: "1px dashed var(--border)",
                      borderRadius: "24px",
                      padding: "3.5rem 2rem",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🕊️</div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                      You're not following any sellers yet
                    </h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.92rem", color: "var(--muted)", maxWidth: "520px", margin: "0 auto 1.5rem" }}>
                      Follow verified sellers from the Suggestions section below to track their latest archival drops, designer tailoring, and conscious wardrobe releases.
                    </p>
                    <button
                      onClick={() => setBuyerFilter("suggestions")}
                      style={{
                        background: "var(--accent)",
                        color: "#0a0a08",
                        border: "none",
                        borderRadius: "100px",
                        padding: "0.65rem 1.6rem",
                        fontFamily: "var(--font-body)",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                      }}
                    >
                      Browse Suggested Curators ↓
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {followedSellers.map((seller) => {
                      const followersCount = followersCountMap[seller.id] || seller.initialFollowers;
                      const sellerPieces = getSellerListings(seller);

                      return (
                        <div
                          key={seller.id}
                          style={{
                            background: "var(--card-bg)",
                            border: "1px solid var(--border)",
                            borderRadius: "24px",
                            padding: "2rem",
                          }}
                        >
                          {/* Seller Header */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: "1.25rem",
                              marginBottom: "1.5rem",
                            }}
                          >
                            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                              <div
                                style={{
                                  width: "58px",
                                  height: "58px",
                                  borderRadius: "50%",
                                  background: "linear-gradient(45deg, var(--accent), #38bdf8)",
                                  padding: "2px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <div
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                    background: "#0a0a08",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 900,
                                    fontSize: "1.2rem",
                                    color: "var(--accent)",
                                  }}
                                >
                                  {seller.avatar}
                                </div>
                              </div>

                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 800, margin: 0 }}>
                                    {seller.name}
                                  </h3>
                                  <span
                                    style={{
                                      background: "rgba(138,223,122,0.14)",
                                      border: "1px solid rgba(138,223,122,0.3)",
                                      color: "var(--accent)",
                                      fontSize: "0.68rem",
                                      fontWeight: 700,
                                      padding: "2px 8px",
                                      borderRadius: "100px",
                                      fontFamily: "var(--font-mono)",
                                    }}
                                  >
                                    {seller.badge}
                                  </span>
                                </div>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.2rem" }}>
                                  {seller.handle} · {seller.city} · {followersCount.toLocaleString()} Followers
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleToggleFollow(seller)}
                              style={{
                                background: "rgba(138,223,122,0.14)",
                                border: "1px solid var(--accent)",
                                color: "var(--accent)",
                                borderRadius: "100px",
                                padding: "0.5rem 1.4rem",
                                fontFamily: "var(--font-body)",
                                fontSize: "0.82rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              ✓ Following
                            </button>
                          </div>

                          {/* Latest Pieces by this followed seller */}
                          <div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.75rem" }}>
                              RECENT PIECES IN THEIR WARDROBE ({sellerPieces.length} AVAILABLE):
                            </div>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                                gap: "1rem",
                              }}
                            >
                              {sellerPieces.map((item) => (
                                <div
                                  key={item.id}
                                  onClick={() => navigate(`/product/${item.id}`)}
                                  style={{
                                    background: "#12120e",
                                    border: "1px solid var(--border)",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    cursor: "pointer",
                                    transition: "transform 0.2s, border-color 0.2s",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-4px)";
                                    e.currentTarget.style.borderColor = "var(--accent)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.borderColor = "var(--border)";
                                  }}
                                >
                                  <div style={{ position: "relative", aspectRatio: "3/4", background: "#1a1a16" }}>
                                    <img src={item.images[0]} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    <span
                                      style={{
                                        position: "absolute",
                                        top: "0.5rem",
                                        left: "0.5rem",
                                        background: "rgba(0,0,0,0.8)",
                                        borderRadius: "100px",
                                        padding: "0.2rem 0.55rem",
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.62rem",
                                        color: "var(--accent)",
                                      }}
                                    >
                                      {item.condition}
                                    </span>
                                  </div>
                                  <div style={{ padding: "0.85rem" }}>
                                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", marginBottom: "0.2rem" }}>
                                      {item.title}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "var(--accent)" }}>
                                        {item.price}₹
                                      </span>
                                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }}>
                                        View ↗
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. SUGGESTIONS SECTION */}
            {(buyerFilter === "all" || buyerFilter === "suggestions") && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--accent)", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "0.25rem" }}>
                      DISCOVER TOP ARCHIVAL CURATORS
                    </div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", fontWeight: 900, margin: 0 }}>
                      ✨ Suggestions for You
                    </h2>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)" }}>
                    Curators recommended for your conscious wardrobe
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {suggestedSellers.map((seller) => {
                    const isFollowing = !!followingMap[seller.id];
                    const followersCount = followersCountMap[seller.id] || seller.initialFollowers;
                    const sellerPieces = getSellerListings(seller);

                    return (
                      <div
                        key={seller.id}
                        style={{
                          background: "var(--card-bg)",
                          border: "1px solid var(--border)",
                          borderRadius: "24px",
                          padding: "2rem",
                          transition: "border-color 0.2s ease, transform 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(138,223,122,0.3)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                      >
                        {/* Header Row */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            flexWrap: "wrap",
                            gap: "1.25rem",
                            marginBottom: "1.5rem",
                          }}
                        >
                          <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
                            <div
                              style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "50%",
                                padding: "2px",
                                background: "linear-gradient(45deg, var(--accent), var(--accent2))",
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: "50%",
                                  background: "#0a0a08",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontFamily: "var(--font-display)",
                                  fontWeight: 800,
                                  fontSize: "1.3rem",
                                  color: "var(--accent)",
                                }}
                              >
                                {seller.avatar}
                              </div>
                            </div>

                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "var(--fg)" }}>
                                  {seller.name}
                                </h3>
                                <span
                                  style={{
                                    background: "rgba(234, 179, 8, 0.14)",
                                    border: "1px solid rgba(234, 179, 8, 0.3)",
                                    color: "#facc15",
                                    fontSize: "0.68rem",
                                    fontWeight: 700,
                                    padding: "2px 8px",
                                    borderRadius: "100px",
                                    fontFamily: "var(--font-mono)",
                                  }}
                                >
                                  {seller.badge}
                                </span>
                              </div>

                              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                                {seller.handle} · {seller.city} · {followersCount.toLocaleString()} Followers
                              </div>

                              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--accent)", marginTop: "0.2rem" }}>
                                Suggested · Followed by conscious collectors in your area
                              </div>
                            </div>
                          </div>

                          <div>
                            <button
                              onClick={() => handleToggleFollow(seller)}
                              style={{
                                background: isFollowing ? "rgba(138,223,122,0.14)" : "var(--accent)",
                                border: isFollowing ? "1px solid var(--accent)" : "none",
                                color: isFollowing ? "var(--accent)" : "#0a0a08",
                                borderRadius: "100px",
                                padding: "0.55rem 1.6rem",
                                fontFamily: "var(--font-body)",
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.45rem",
                                transition: "all 0.2s ease",
                              }}
                            >
                              <span>{isFollowing ? "✓ Following" : "+ Follow Seller"}</span>
                            </button>
                          </div>
                        </div>

                        {/* About quote & impact */}
                        <div
                          style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "14px",
                            padding: "1rem 1.25rem",
                            marginBottom: "1.5rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "1rem",
                          }}
                        >
                          <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.5, maxWidth: "720px" }}>
                            &ldquo;{seller.bio}&rdquo;
                          </p>
                          <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)" }}>
                              CIRCULATED: <strong style={{ color: "var(--fg)" }}>{seller.piecesCirculated} pcs</strong>
                            </div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)" }}>
                              CO₂ SAVED: <strong style={{ color: "var(--accent)" }}>{seller.co2Saved} kg</strong>
                            </div>
                          </div>
                        </div>

                        {/* Lookbook gallery */}
                        <div>
                          <div
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.7rem",
                              color: "var(--accent)",
                              letterSpacing: "0.08em",
                              fontWeight: 700,
                              marginBottom: "1rem",
                            }}
                          >
                            RECENT ARCHIVE PIECES FROM {seller.name.toUpperCase()} ({sellerPieces.length} AVAILABLE)
                          </div>

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                              gap: "1.25rem",
                            }}
                          >
                            {sellerPieces.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => navigate(`/product/${item.id}`)}
                                style={{
                                  background: "#141410",
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
                                <div style={{ position: "relative", aspectRatio: "3/4", background: "#1a1a16", overflow: "hidden" }}>
                                  <img src={item.images[0]} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "0.6rem",
                                      left: "0.6rem",
                                      background: "rgba(10,10,8,0.85)",
                                      backdropFilter: "blur(6px)",
                                      borderRadius: "100px",
                                      padding: "0.2rem 0.6rem",
                                      fontFamily: "var(--font-mono)",
                                      fontSize: "0.62rem",
                                      color: "var(--accent)",
                                    }}
                                  >
                                    {item.condition}
                                  </div>
                                </div>

                                <div style={{ padding: "1rem", display: "flex", flexDirection: "column", flex: 1 }}>
                                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem" }}>
                                    {item.title}
                                  </div>
                                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)", marginBottom: "0.75rem" }}>
                                    {item.brand} · Size {item.size}
                                  </div>
                                  <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: "var(--accent)" }}>
                                      {item.price}₹
                                    </span>
                                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)" }}>
                                      View Details ↗
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Share Story Modal (available for sellers) */}
        {isShareModalOpen && (
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
                maxWidth: "500px",
                background: "#141410",
                border: "1px solid var(--border)",
                borderRadius: "24px",
                padding: "2.5rem 2rem",
                position: "relative",
                boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
              }}
            >
              <button
                onClick={() => setIsShareModalOpen(false)}
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
                  COMMUNITY LOOKBOOK
                </div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800 }}>
                  Share Your Styling Story
                </h2>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                  Inspire other cyclers with how you style conscious garments or reduce landfill waste.
                </p>
              </div>

              <form onSubmit={handleCreatePost} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Styled this archive Japanese denim jacket with a vintage cashmere knit today. Conscious, timeless, zero fast-fashion waste!"
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "0.85rem 1rem",
                    color: "var(--fg)",
                    fontSize: "0.9rem",
                    fontFamily: "var(--font-body)",
                    resize: "vertical",
                    outline: "none",
                  }}
                />

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <button
                    type="submit"
                    disabled={isSubmittingPost}
                    style={{
                      flex: 1,
                      background: "var(--accent)",
                      color: "#0a0a08",
                      border: "none",
                      borderRadius: "100px",
                      padding: "0.85rem",
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      cursor: isSubmittingPost ? "not-allowed" : "pointer",
                    }}
                  >
                    {isSubmittingPost ? "Publishing…" : "Publish Story"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsShareModalOpen(false)}
                    style={{
                      background: "transparent",
                      border: "1px solid var(--border)",
                      color: "var(--muted)",
                      borderRadius: "100px",
                      padding: "0.85rem 1.5rem",
                      fontFamily: "var(--font-body)",
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
