import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../contexts/StoreContext";
import type { Category, Condition } from "../../types/listing.types";

const CATEGORIES: Category[] = [
  "Tops & Tees",
  "Outerwear",
  "Dresses",
  "Denim",
  "Shoes",
  "Accessories",
];

const CONDITIONS: Condition[] = ["Like New", "Excellent", "Good", "Fair"];

export default function GlobalModals() {
  const navigate = useNavigate();
  const {
    isNewListingModalOpen,
    closeNewListingModal,
    addListing,
    selectedItemForModal,
    closeItemModal,
    placeOrder,
    savedIds,
    toggleSave,
    selectedOrderForTracking,
    closeOrderTrackingModal,
    cancelOrder,
    showToast,
  } = useStore();

  // New Listing Form State
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("M");
  const [condition, setCondition] = useState<Condition>("Excellent");
  const [category, setCategory] = useState<Category>("Outerwear");
  const [price, setPrice] = useState("75");
  const [imgUrl, setImgUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const listingFileInputRef = useRef<HTMLInputElement>(null);

  const handleListingImageUpload = (file: File) => {
    // Strictly accept images only
    if (!file.type.startsWith("image/") && !/\.(jpe?g|png|webp|gif|svg|avif|heic)$/i.test(file.name)) {
      showToast("Only image files are accepted (PNG, JPG, WEBP, etc.)", "error");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast("Image size must be less than 15MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImgUrl(dataUrl);
      setUploadedFileName(file.name);
      showToast("Garment photo uploaded! 📸");
    };
    reader.onerror = () => {
      showToast("Failed to read image file", "error");
    };
    reader.readAsDataURL(file);
  };

  // Offer State inside Item Modal
  const [showOfferInput, setShowOfferInput] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !brand.trim() || !price) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (!imgUrl) {
      showToast("Please upload a garment photo or paste an image URL", "error");
      return;
    }

    addListing({
      title: title.trim(),
      brand: brand.trim(),
      size,
      condition,
      category,
      price: Number(price) || 50,
      images: [imgUrl],
      description: description || "Pre-loved fashion item listed for sustainable reuse.",
      sellerId: "user-current",
    });

    // Reset & close
    setTitle("");
    setBrand("");
    setSize("M");
    setPrice("75");
    setDescription("");
    setUploadedFileName(null);
    setImgUrl("");
    closeNewListingModal();
  };

  const handleBuyNow = () => {
    if (!selectedItemForModal) return;
    placeOrder({
      title: selectedItemForModal.title,
      price: selectedItemForModal.price,
      img: selectedItemForModal.images[0],
      seller: selectedItemForModal.brand + " Collective",
    });
    closeItemModal();
  };

  const handleSendOffer = () => {
    if (!selectedItemForModal) return;
    const amount = Number(offerAmount);
    if (!amount || amount <= 0) {
      showToast("Please enter a valid offer amount", "error");
      return;
    }
    showToast(`Offer of ${amount}₹ submitted to seller! You will receive updates via notifications.`);
    setShowOfferInput(false);
    setOfferAmount("");
    closeItemModal();
  };

  const handleInquirePiece = () => {
    if (!selectedItemForModal) return;
    showToast(`Inquiry sent for ${selectedItemForModal.title}! Seller has been notified.`);
    closeItemModal();
  };

  return (
    <>
      {/* ─── 1. NEW LISTING MODAL ─── */}
      {isNewListingModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(10,10,8,0.85)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={closeNewListingModal}
        >
          <div
            className="modal-box"
            style={{
              background: "#11110e",
              border: "1px solid var(--border)",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2.5rem",
              position: "relative",
              boxShadow: "0 25px 70px rgba(0,0,0,0.8)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeNewListingModal}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--border)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted)",
                cursor: "pointer",
                fontSize: "1.1rem",
              }}
            >
              ✕
            </button>

            <div style={{ marginBottom: "1.75rem" }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "var(--accent)",
                  letterSpacing: "0.1em",
                  marginBottom: "0.5rem",
                }}
              >
                GIVE FASHION A SECOND LIFE
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.8rem",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                }}
              >
                List a Piece
              </h2>
            </div>

            <form onSubmit={handleCreateListing} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Title */}
              <div>
                <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
                  ITEM TITLE *
                </label>
                <input
                  required
                  placeholder="e.g. Vintage Ralph Lauren Blazer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "0.75rem 1rem",
                    color: "var(--fg)",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>

              {/* Brand & Size */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
                    BRAND *
                  </label>
                  <input
                    required
                    placeholder="e.g. Toteme, Acne, Levi's"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      padding: "0.75rem 1rem",
                      color: "var(--fg)",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
                    SIZE *
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    style={{
                      width: "100%",
                      background: "#181814",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      padding: "0.75rem 1rem",
                      color: "var(--fg)",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  >
                    {["XS", "S", "M", "L", "XL", "OS", "28", "30", "32", "34"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category & Condition */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
                    CATEGORY *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    style={{
                      width: "100%",
                      background: "#181814",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      padding: "0.75rem 1rem",
                      color: "var(--fg)",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
                    CONDITION *
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as Condition)}
                    style={{
                      width: "100%",
                      background: "#181814",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      padding: "0.75rem 1rem",
                      color: "var(--fg)",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price */}
              <div>
                <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
                  PRICE (₹) *
                </label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 75"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "0.75rem 1rem",
                    color: "var(--fg)",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>

              {/* Garment Photo: Upload Image Option */}
              <div>
                <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.6rem" }}>
                  GARMENT PHOTO * (UPLOAD IMAGE)
                </label>

                {/* Hidden File Input strictly accepting images only */}
                <input
                  ref={listingFileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/avif, image/heic, image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleListingImageUpload(e.target.files[0]);
                      e.target.value = "";
                    }
                  }}
                />

                {/* Drag & Drop / Click to Upload Box */}
                <div
                  onClick={() => listingFileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleListingImageUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  style={{
                    border: isDragOver ? "2px dashed var(--accent)" : "1.5px dashed rgba(255,255,255,0.22)",
                    borderRadius: "16px",
                    padding: "1.2rem",
                    background: isDragOver ? "rgba(138,223,122,0.08)" : "rgba(255,255,255,0.02)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                    transition: "all 0.2s ease",
                    marginBottom: "1rem",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onMouseLeave={(e) => {
                    if (!isDragOver) e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                  }}
                >
                  {/* Photo Preview Thumbnail */}
                  <div
                    style={{
                      width: "68px",
                      height: "68px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      background: "#181814",
                      border: "1px solid var(--border)",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {imgUrl ? (
                      <img src={imgUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "1.6rem" }}>📷</span>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--fg)", fontFamily: "var(--font-body)" }}>
                        {uploadedFileName ? uploadedFileName : "Upload Garment Photo"}
                      </span>
                      {uploadedFileName && (
                        <span style={{ background: "var(--accent)", color: "#0a0a08", fontSize: "0.55rem", fontWeight: 800, padding: "1px 6px", borderRadius: "100px", fontFamily: "var(--font-mono)" }}>
                          READY
                        </span>
                      )}
                    </div>
                    <p style={{ margin: "3px 0 0", fontSize: "0.75rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                      Click to browse or drop an image file (PNG, JPG, WEBP, GIF, AVIF).
                    </p>
                    <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.7rem",
                          color: "var(--accent)",
                          textDecoration: "underline",
                        }}
                      >
                        {uploadedFileName ? "Replace Image ↻" : "Choose File 📤"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct image URL fallback */}
                <div style={{ marginBottom: "0.75rem" }}>
                  <input
                    placeholder="Or paste an image URL directly..."
                    value={imgUrl}
                    onChange={(e) => {
                      setImgUrl(e.target.value);
                      setUploadedFileName(null);
                    }}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      padding: "0.6rem 0.85rem",
                      color: "var(--fg)",
                      fontSize: "0.8rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
                  DESCRIPTION
                </label>
                <textarea
                  placeholder="Describe material, fit, story, and condition..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "0.75rem 1rem",
                    color: "var(--fg)",
                    fontSize: "0.9rem",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  background: "var(--accent)",
                  color: "#0a0a08",
                  border: "none",
                  borderRadius: "100px",
                  padding: "0.9rem",
                  fontSize: "1rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  marginTop: "0.5rem",
                  transition: "transform 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Publish Listing →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── 2. ITEM DETAIL & PURCHASE MODAL ─── */}
      {selectedItemForModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(10,10,8,0.85)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={closeItemModal}
        >
          <div
            className="modal-box modal-two-col"
            style={{
              background: "#11110e",
              border: "1px solid var(--border)",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2rem",
              position: "relative",
              boxShadow: "0 25px 70px rgba(0,0,0,0.8)",
              display: "grid",
              gridTemplateColumns: "1fr 1.1fr",
              gap: "2rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeItemModal}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--border)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted)",
                cursor: "pointer",
                fontSize: "1.1rem",
                zIndex: 10,
              }}
            >
              ✕
            </button>

            {/* Left Image */}
            <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", aspectRatio: "3/4", background: "#1a1a14" }}>
              <img
                src={selectedItemForModal.images[0]}
                alt={selectedItemForModal.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "1rem",
                  left: "1rem",
                  background: "rgba(10,10,8,0.85)",
                  backdropFilter: "blur(6px)",
                  borderRadius: "100px",
                  padding: "0.3rem 0.8rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "var(--accent)",
                  border: "1px solid rgba(138,223,122,0.3)",
                }}
              >
                {selectedItemForModal.condition}
              </div>
            </div>

            {/* Right Details */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.08em", marginBottom: "0.3rem" }}>
                {selectedItemForModal.brand.toUpperCase()} · SIZE {selectedItemForModal.size}
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "0.75rem", lineHeight: 1.2 }}>
                {selectedItemForModal.title}
              </h2>
              
              <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, color: "var(--accent)", marginBottom: "1.25rem" }}>
                {selectedItemForModal.price}₹
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "1rem", marginBottom: "1.25rem" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent)", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>
                  ECO IMPACT ESTIMATE
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--fg)" }}>
                  🌱 <strong>3.8 kg CO₂</strong> saved vs buying new · 💧 <strong>2,700 L</strong> water preserved
                </div>
              </div>

              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                {selectedItemForModal.description || "Authentic pre-loved designer piece. Carefully authenticated, washed, and packaged with zero-plastic materials."}
              </p>

              {/* Offer Prompt */}
              {showOfferInput ? (
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                  <input
                    type="number"
                    placeholder="Enter offer in ₹ (e.g. 60)"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--accent)",
                      borderRadius: "100px",
                      padding: "0.7rem 1.2rem",
                      color: "var(--fg)",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={handleSendOffer}
                    style={{
                      background: "var(--accent)",
                      color: "#0a0a08",
                      border: "none",
                      padding: "0.7rem 1.25rem",
                      borderRadius: "100px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Submit Offer
                  </button>
                  <button
                    onClick={() => setShowOfferInput(false)}
                    style={{
                      background: "transparent",
                      color: "var(--muted)",
                      border: "1px solid var(--border)",
                      padding: "0.7rem 1rem",
                      borderRadius: "100px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : null}

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "auto" }}>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={handleBuyNow}
                    style={{
                      flex: 1,
                      background: "var(--accent)",
                      color: "#0a0a08",
                      border: "none",
                      padding: "0.9rem",
                      borderRadius: "100px",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      transition: "transform 0.2s, background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    ⚡ Buy Now — {selectedItemForModal.price}₹
                  </button>
                  
                  <button
                    onClick={() => toggleSave(selectedItemForModal.id)}
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      color: savedIds.includes(selectedItemForModal.id) ? "var(--accent)" : "var(--fg)",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {savedIds.includes(selectedItemForModal.id) ? "♥" : "♡"}
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <button
                    onClick={() => setShowOfferInput(true)}
                    style={{
                      background: "transparent",
                      border: "1px solid var(--border)",
                      color: "var(--fg)",
                      padding: "0.75rem",
                      borderRadius: "100px",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  >
                    💬 Make an Offer
                  </button>
                  <button
                    onClick={handleInquirePiece}
                    style={{
                      background: "transparent",
                      border: "1px solid var(--border)",
                      color: "var(--fg)",
                      padding: "0.75rem",
                      borderRadius: "100px",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  >
                    🌱 Inquire About Piece
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. ORDER TRACKING & DETAILS MODAL ─── */}
      {selectedOrderForTracking && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(10,10,8,0.85)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={closeOrderTrackingModal}
        >
          <div
            className="modal-box"
            style={{
              background: "#11110e",
              border: "1px solid var(--border)",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "560px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2.5rem",
              position: "relative",
              boxShadow: "0 25px 70px rgba(0,0,0,0.8)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={closeOrderTrackingModal}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--border)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted)",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
                LIVE PACKAGE TRACKING
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.02em" }}>
                Order {selectedOrderForTracking.id}
              </h2>
            </div>

            {/* Item Card */}
            <div style={{ display: "flex", gap: "1rem", background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "14px", marginBottom: "1.75rem", alignItems: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "10px", overflow: "hidden", background: "#1a1a14", flexShrink: 0 }}>
                <img src={selectedOrderForTracking.img} alt={selectedOrderForTracking.item} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.95rem", color: "var(--fg)" }}>{selectedOrderForTracking.item}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginTop: "2px" }}>Seller: {selectedOrderForTracking.seller}</div>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--accent)" }}>{selectedOrderForTracking.price}</div>
            </div>

            {/* Tracking Stages Timeline */}
            <div style={{ marginBottom: "2rem" }}>
              {[
                { title: "Order Confirmed & Verified", time: selectedOrderForTracking.date, done: true },
                { title: "Dispatched from Circular Hub", time: "Carbon Neutral Packing", done: true },
                { title: "In Transit via Electric Van", time: selectedOrderForTracking.estimatedDelivery, done: selectedOrderForTracking.status !== "Processing" },
                { title: "Delivered to Doorstep", time: selectedOrderForTracking.status === "Delivered" ? "Delivered" : "Pending", done: selectedOrderForTracking.status === "Delivered" },
              ].map((step, idx) => (
                <div key={idx} style={{ display: "flex", gap: "1rem", position: "relative", paddingBottom: idx < 3 ? "1.5rem" : 0 }}>
                  {idx < 3 && (
                    <div style={{ position: "absolute", left: "11px", top: "24px", bottom: 0, width: "2px", background: step.done ? "var(--accent)" : "rgba(255,255,255,0.1)" }} />
                  )}
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: step.done ? "var(--accent)" : "rgba(255,255,255,0.1)",
                      color: step.done ? "#0a0a08" : "var(--muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      flexShrink: 0,
                      zIndex: 2,
                    }}
                  >
                    {step.done ? "✓" : idx + 1}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem", color: step.done ? "var(--fg)" : "var(--muted)" }}>{step.title}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", marginTop: "2px" }}>{step.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Details */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "14px", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)" }}>CARRIER</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--fg)", fontWeight: 600 }}>{selectedOrderForTracking.carrier}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)" }}>TRACKING #</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--accent)" }}>{selectedOrderForTracking.trackingNumber}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)" }}>DESTINATION</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--fg)", textAlign: "right" }}>{selectedOrderForTracking.address}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {selectedOrderForTracking.status !== "Delivered" && (
                <button
                  onClick={() => {
                    cancelOrder(selectedOrderForTracking.id);
                    closeOrderTrackingModal();
                  }}
                  style={{
                    flex: 1,
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#ef4444",
                    borderRadius: "100px",
                    padding: "0.75rem",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel Order
                </button>
              )}
              <button
                onClick={closeOrderTrackingModal}
                style={{
                  flex: 1,
                  background: "var(--accent)",
                  color: "#0a0a08",
                  border: "none",
                  borderRadius: "100px",
                  padding: "0.75rem",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
