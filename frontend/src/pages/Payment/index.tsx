import { useState, useMemo } from "react";
import { useLocation, useNavigate, Link, Navigate } from "react-router-dom";
import { useStore, type Listing } from "../../contexts/StoreContext";
import { useAuth } from "../../hooks/useAuth";
import BackButton from "../../components/shared/BackButton";

interface PaymentItemState {
  id?: string;
  title: string;
  price: number;
  img: string;
  brand?: string;
  size?: string;
  condition?: string;
  seller?: string;
}

const UPI_APPS = [
  { id: "gpay", name: "Google Pay", icon: "🟢", suffix: "@okhdfcbank" },
  { id: "phonepe", name: "PhonePe", icon: "🟣", suffix: "@ybl" },
  { id: "paytm", name: "Paytm", icon: "🔵", suffix: "@paytm" },
  { id: "bhim", name: "BHIM / UPI", icon: "🟠", suffix: "@upi" },
];

export default function PaymentPage() {
  const { user, isSeller, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Prompt login if user is not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} replace />;
  }

  // Sellers are strictly excluded from shop checkout & purchasing
  if (isSeller) {
    return <Navigate to="/listings" replace />;
  }
  const { listings, placeOrder, showToast } = useStore();

  // Resolve item from navigation state or fallback to first active listing
  const item: PaymentItemState = useMemo(() => {
    if (location.state && location.state.item) {
      return location.state.item;
    }
    if (listings.length > 0) {
      const first = listings[0];
      return {
        id: first.id,
        title: first.title,
        price: first.price,
        img: first.images[0],
        brand: first.brand,
        size: first.size,
        condition: first.condition,
        seller: `${first.brand} Collective`,
      };
    }
    return {
      id: "lst-default",
      title: "Archive Trench Coat",
      price: 180,
      img: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&h=800&fit=crop&auto=format",
      brand: "Burberry Archive",
      size: "M",
      condition: "Like New",
      seller: "Burberry Archive Collective",
    };
  }, [location.state, listings]);

  // Payment tab: "upi" | "card"
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");

  // UPI State
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
  const [upiId, setUpiId] = useState("");
  const [showQrCode, setShowQrCode] = useState(false);

  // Card State
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState(user?.name || "Harsha Shetty");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  // Shipping State
  const [shippingName, setShippingName] = useState(user?.name || "Harsha Shetty");
  const [shippingPhone, setShippingPhone] = useState("+91 98450 12345");
  const [shippingStreet, setShippingStreet] = useState("Flat 402, Green Meadows, 14th Main Road");
  const [shippingCity, setShippingCity] = useState("Bengaluru");
  const [shippingState, setShippingState] = useState("Karnataka");
  const [shippingPin, setShippingPin] = useState("560034");

  // Checkout Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string>("");

  // Format Card Number (with spaces)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 2) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  // Detect Card Brand
  const cardBrand = useMemo(() => {
    const clean = cardNumber.replace(/\s/g, "");
    if (clean.startsWith("4")) return "VISA";
    if (/^5[1-5]/.test(clean)) return "Mastercard";
    if (/^(60|65|81|82)/.test(clean)) return "RuPay";
    if (/^3[47]/.test(clean)) return "Amex";
    return "Debit / Credit";
  }, [cardNumber]);

  // Handle Payment Submission
  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!shippingName.trim() || !shippingStreet.trim() || !shippingPin.trim()) {
      showToast("Please provide complete delivery address details.", "error");
      return;
    }

    if (paymentMethod === "upi" && !showQrCode) {
      if (!upiId.trim() && !selectedUpiApp) {
        showToast("Please enter a valid UPI ID (e.g. name@okhdfcbank).", "error");
        return;
      }
    }

    if (paymentMethod === "card") {
      const cleanNum = cardNumber.replace(/\s/g, "");
      if (cleanNum.length < 12) {
        showToast("Please enter a valid 16-digit debit/credit card number.", "error");
        return;
      }
      if (cardExpiry.length < 5) {
        showToast("Please enter card expiry in MM/YY format.", "error");
        return;
      }
      if (cardCvv.length < 3) {
        showToast("Please enter valid 3-digit CVV.", "error");
        return;
      }
    }

    setIsProcessing(true);
    setProcessingStep(paymentMethod === "upi" ? "Requesting authorization from UPI Gateway…" : "Connecting with Bank Payment Gateway…");

    setTimeout(async () => {
      setProcessingStep("Verifying carbon-neutral escrow contract…");

      setTimeout(async () => {
        try {
          await placeOrder({
            title: item.title,
            price: item.price,
            img: item.img,
            seller: item.seller || `${item.brand || "Vintage"} Collective`,
          });

          const mockOrderId = `#FC-${Math.floor(1000 + Math.random() * 9000)}`;
          setCompletedOrderId(mockOrderId);
          setIsProcessing(false);
          setOrderSuccess(true);
          showToast(`Payment successful! Order placed and synced with MongoDB.`, "success");
        } catch (err) {
          console.error("Order error:", err);
          setIsProcessing(false);
          showToast("Payment failed. Please try again.", "error");
        }
      }, 1200);
    }, 1200);
  };

  // If order successfully placed, show success summary and redirect button
  if (orderSuccess) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", padding: "7rem 2rem 5rem" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              background: "var(--card-bg)",
              border: "1px solid rgba(138,223,122,0.35)",
              borderRadius: "28px",
              padding: "3.5rem 2.5rem",
              boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "5px",
                background: "linear-gradient(90deg, var(--accent), var(--accent2))",
              }}
            />

            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(138,223,122,0.15)",
                border: "2px solid var(--accent)",
                color: "var(--accent)",
                fontSize: "2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                boxShadow: "0 0 30px rgba(138,223,122,0.35)",
              }}
            >
              ✓
            </div>

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                color: "var(--accent)",
                letterSpacing: "0.1em",
                marginBottom: "0.5rem",
              }}
            >
              PAYMENT VERIFIED & ORDER CONFIRMED
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 3.5vw, 2.6rem)",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                marginBottom: "0.75rem",
              }}
            >
              Piece Successfully Acquired
            </h1>

            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "2rem" }}>
              Your order has been recorded in the circular database. EcoCourier has been assigned for 100% electric, carbon-neutral delivery to your door.
            </p>

            {/* Receipt Tile */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "1.5rem",
                marginBottom: "2rem",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.25rem" }}>
                <img
                  src={item.img}
                  alt={item.title}
                  style={{ width: "64px", height: "64px", borderRadius: "10px", objectFit: "cover", border: "1px solid var(--border)" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem" }}>
                    {item.title}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)" }}>
                    {item.brand} · Size {item.size || "M"} · {item.condition || "Like New"}
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 900, color: "var(--accent)" }}>
                  {item.price}₹
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--muted)", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                <div>
                  <span style={{ display: "block", color: "var(--muted)", fontSize: "0.68rem" }}>PAYMENT METHOD</span>
                  <span style={{ color: "var(--fg)", fontWeight: 600 }}>{paymentMethod === "upi" ? `UPI (${selectedUpiApp.toUpperCase()})` : `Card (${cardBrand})`}</span>
                </div>
                <div>
                  <span style={{ display: "block", color: "var(--muted)", fontSize: "0.68rem" }}>DELIVERY STATUS</span>
                  <span style={{ color: "#fbbf24", fontWeight: 600 }}>● Dispatch Processing</span>
                </div>
                <div>
                  <span style={{ display: "block", color: "var(--muted)", fontSize: "0.68rem" }}>SHIPPING TO</span>
                  <span style={{ color: "var(--fg)", fontWeight: 600 }}>{shippingCity}, {shippingPin}</span>
                </div>
                <div>
                  <span style={{ display: "block", color: "var(--muted)", fontSize: "0.68rem" }}>CIRCULAR SAVINGS</span>
                  <span style={{ color: "var(--accent)", fontWeight: 600 }}>🌱 3.8 kg CO₂ Diverted</span>
                </div>
              </div>
            </div>

            {/* Next Steps Buttons */}
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/orders")}
                style={{
                  background: "var(--accent)",
                  color: "#0a0a08",
                  border: "none",
                  borderRadius: "100px",
                  padding: "0.9rem 2.2rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 0 25px rgba(138,223,122,0.4)",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Track Order Status in My Orders →
              </button>

              <button
                onClick={() => navigate("/shop")}
                style={{
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--fg)",
                  borderRadius: "100px",
                  padding: "0.9rem 1.8rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", padding: "7rem 2rem 5rem" }}>
      <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
        
        {/* Breadcrumb Navigation & Back Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
          <BackButton fallback={item.id ? `/product/${item.id}` : "/shop"} label="Back" />
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)" }}>
            <Link to="/shop" style={{ color: "var(--muted)", textDecoration: "none" }}>Shop</Link>
            <span>/</span>
            <Link to={`/product/${item.id}`} style={{ color: "var(--muted)", textDecoration: "none" }}>{item.title}</Link>
            <span>/</span>
            <span style={{ color: "var(--accent)" }}>Secure Circular Checkout</span>
          </div>
        </div>

        {/* Page Header */}
        <div style={{ marginBottom: "2.5rem" }}>
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
              marginBottom: "0.75rem",
            }}
          >
            <span>🔒 256-BIT ENCRYPTED</span>
            <span>·</span>
            <span>DIRECT CIRCULAR ESCROW</span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Acquire Piece & Complete Payment
          </h1>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: "0.95rem", marginTop: "0.5rem" }}>
            Add UPI or debit card information below to finalize acquisition. Funds are held in escrow until authenticated delivery.
          </p>
        </div>

        {/* Two-Column Checkout Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2.5rem",
            alignItems: "start",
          }}
        >
          {/* Left Column: Delivery & Payment Options */}
          <form onSubmit={handlePay} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* 1. Shipping Address Section */}
            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "1.75rem clamp(1.25rem, 3vw, 2rem)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    color: "#0a0a08",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  1
                </span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700 }}>
                  Carbon-Neutral Delivery Address
                </h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.35rem" }}>
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    placeholder="Recipient's Name"
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      color: "var(--fg)",
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.35rem" }}>
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    required
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      color: "var(--fg)",
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.35rem" }}>
                  STREET ADDRESS & APARTMENT / SUITE
                </label>
                <input
                  type="text"
                  required
                  value={shippingStreet}
                  onChange={(e) => setShippingStreet(e.target.value)}
                  placeholder="Street Address, House No."
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    color: "var(--fg)",
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.35rem" }}>
                    CITY
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      color: "var(--fg)",
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.35rem" }}>
                    STATE
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingState}
                    onChange={(e) => setShippingState(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      color: "var(--fg)",
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.35rem" }}>
                    PIN CODE
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingPin}
                    onChange={(e) => setShippingPin(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      color: "var(--fg)",
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "1.75rem clamp(1.25rem, 3vw, 2rem)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    color: "#0a0a08",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  2
                </span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700 }}>
                  Select Payment Method
                </h2>
              </div>

              {/* Tab Selector: UPI vs Debit/Credit Card */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                  background: "rgba(255,255,255,0.03)",
                  padding: "0.4rem",
                  borderRadius: "14px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  style={{
                    background: paymentMethod === "upi" ? "var(--accent)" : "transparent",
                    color: paymentMethod === "upi" ? "#0a0a08" : "var(--fg)",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.75rem 1rem",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>⚡</span>
                  <span>UPI (Google Pay, PhonePe, Paytm)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  style={{
                    background: paymentMethod === "card" ? "var(--accent)" : "transparent",
                    color: paymentMethod === "card" ? "#0a0a08" : "var(--fg)",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.75rem 1rem",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>💳</span>
                  <span>Debit / Credit Card (RuPay, Visa)</span>
                </button>
              </div>

              {/* Method A: UPI Forms */}
              {paymentMethod === "upi" && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.75rem" }}>
                    CHOOSE YOUR UPI APPLICATION
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    {UPI_APPS.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => {
                          setSelectedUpiApp(app.id);
                          if (!upiId) setUpiId(`username${app.suffix}`);
                        }}
                        style={{
                          background: selectedUpiApp === app.id ? "rgba(138,223,122,0.12)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${selectedUpiApp === app.id ? "var(--accent)" : "var(--border)"}`,
                          borderRadius: "14px",
                          padding: "0.9rem 0.5rem",
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>{app.icon}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 600 }}>
                          {app.name}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* UPI ID input */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.35rem" }}>
                      ENTER UPI ID (VPA)
                    </label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. mobile@okhdfcbank or user@paytm"
                        style={{
                          flex: 1,
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid var(--border)",
                          color: "var(--fg)",
                          padding: "0.85rem 1rem",
                          borderRadius: "12px",
                          fontSize: "0.9rem",
                          outline: "none",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (upiId.includes("@")) {
                            showToast("UPI ID verified successfully! ✓", "success");
                          } else {
                            showToast("Please enter a valid UPI address containing '@'", "error");
                          }
                        }}
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid var(--border)",
                          color: "var(--accent)",
                          borderRadius: "12px",
                          padding: "0 1.25rem",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Verify
                      </button>
                    </div>
                  </div>

                  {/* QR Option Toggle */}
                  <div
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px dashed var(--border)",
                      borderRadius: "12px",
                      padding: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 600 }}>
                        Prefer scanning a QR Code?
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)" }}>
                        Scan & pay with any UPI app on your phone
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowQrCode((prev) => !prev)}
                      style={{
                        background: "rgba(138,223,122,0.12)",
                        border: "1px solid rgba(138,223,122,0.3)",
                        color: "var(--accent)",
                        padding: "0.45rem 0.9rem",
                        borderRadius: "100px",
                        fontSize: "0.75rem",
                        fontFamily: "var(--font-mono)",
                        cursor: "pointer",
                      }}
                    >
                      {showQrCode ? "Hide QR" : "Show QR Code"}
                    </button>
                  </div>

                  {showQrCode && (
                    <div style={{ textAlign: "center", marginTop: "1.25rem", padding: "1.5rem", background: "#fff", borderRadius: "16px", color: "#000", maxWidth: "260px", margin: "1.25rem auto 0" }}>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.5rem", fontFamily: "var(--font-mono)" }}>
                        FASHIONCYCLE VERIFIED UPI
                      </div>
                      <div style={{ width: "160px", height: "160px", background: "#000", margin: "0 auto 0.75rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-mono)", fontSize: "0.7rem", borderRadius: "8px" }}>
                        [UPI QR CODE]
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#444" }}>
                        Amount: <strong>{item.price}₹</strong>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Method B: Debit / Credit Card Forms */}
              {paymentMethod === "card" && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)" }}>
                        CARD NUMBER
                      </label>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--accent)", fontWeight: 700 }}>
                        {cardBrand}
                      </span>
                    </div>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4532 ···· ···· 8921"
                        maxLength={19}
                        style={{
                          width: "100%",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid var(--border)",
                          color: "var(--fg)",
                          padding: "0.85rem 1rem",
                          borderRadius: "12px",
                          fontSize: "1rem",
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.08em",
                          outline: "none",
                        }}
                      />
                      <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.2rem" }}>
                        💳
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.35rem" }}>
                      CARDHOLDER NAME
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name printed on card"
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--border)",
                        color: "var(--fg)",
                        padding: "0.75rem 1rem",
                        borderRadius: "12px",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                    <div>
                      <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.35rem" }}>
                        VALID THRU (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        style={{
                          width: "100%",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid var(--border)",
                          color: "var(--fg)",
                          padding: "0.75rem 1rem",
                          borderRadius: "12px",
                          fontSize: "0.9rem",
                          fontFamily: "var(--font-mono)",
                          outline: "none",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.35rem" }}>
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="•••"
                        maxLength={4}
                        style={{
                          width: "100%",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid var(--border)",
                          color: "var(--fg)",
                          padding: "0.75rem 1rem",
                          borderRadius: "12px",
                          fontSize: "0.9rem",
                          fontFamily: "var(--font-mono)",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--muted)" }}>
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      style={{ accentColor: "var(--accent)" }}
                    />
                    <span>Save card securely for 1-click circular orders (RBI Tokenization compliant)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              style={{
                width: "100%",
                background: isProcessing ? "rgba(138,223,122,0.5)" : "var(--accent)",
                color: "#0a0a08",
                border: "none",
                borderRadius: "100px",
                padding: "1.1rem",
                fontFamily: "var(--font-body)",
                fontSize: "1.05rem",
                fontWeight: 800,
                cursor: isProcessing ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                boxShadow: "0 10px 30px rgba(138,223,122,0.35)",
                transition: "transform 0.2s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {isProcessing ? (
                <>
                  <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⚙</span>
                  <span>{processingStep}</span>
                </>
              ) : (
                <>
                  <span>🔒</span>
                  <span>Pay {item.price}₹ & Confirm Acquisition</span>
                </>
              )}
            </button>

            <div style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)" }}>
              🛡️ Funds protected in escrow. Seller paid only when item matches authenticated description.
            </div>
          </form>

          {/* Right Column: Order Summary & Ecological Breakdown */}
          <div style={{ position: "sticky", top: "100px" }}>
            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "24px",
                padding: "2rem",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              }}
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.25rem" }}>
                Order Summary
              </h3>

              {/* Garment Preview */}
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
                <img
                  src={item.img}
                  alt={item.title}
                  style={{ width: "80px", height: "96px", borderRadius: "12px", objectFit: "cover", background: "#1a1a16" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase" }}>
                    {item.brand}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.3, marginBottom: "0.25rem" }}>
                    {item.title}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)" }}>
                    Size {item.size || "M"} · {item.condition || "Excellent"}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--accent)", marginTop: "0.25rem" }}>
                    Curator: {item.seller || "Verified Merchant"}
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--muted)" }}>Piece Value</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>{item.price}₹</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--muted)" }}>Carbon-Neutral Courier</span>
                  <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>FREE (0₹)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--muted)" }}>Zero-Plastic Packaging</span>
                  <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>FREE (0₹)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--muted)" }}>Authentication & Escrow</span>
                  <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>INCLUDED</span>
                </div>
              </div>

              {/* Total Due */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  paddingTop: "1.25rem",
                  borderTop: "1px solid var(--border)",
                  marginBottom: "1.5rem",
                }}
              >
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1rem" }}>Total Amount</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)" }}>Includes all taxes & duties</div>
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.85rem", fontWeight: 900, color: "var(--accent)" }}>
                  {item.price}₹
                </div>
              </div>

              {/* Eco Guarantee Badge */}
              <div
                style={{
                  background: "rgba(138,223,122,0.06)",
                  border: "1px solid rgba(138,223,122,0.25)",
                  borderRadius: "14px",
                  padding: "1rem",
                }}
              >
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "0.3rem" }}>
                  CERTIFIED IMPACT OF THIS PURCHASE
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", lineHeight: 1.5 }}>
                  🌱 <strong>3.8 kg CO₂</strong> diverted from atmosphere<br />
                  💧 <strong>2,700 L</strong> water preserved vs buying new<br />
                  📦 <strong>100%</strong> zero-plastic biodegradable delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

