import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Listing } from "../types/listing.types";
export type { Listing } from "../types/listing.types";
import { apiRequest } from "../services/api";
import { socket } from "../services/socket";
import { useAuth } from "../hooks/useAuth";

export interface OrderItem {
  id: string;
  item: string;
  seller: string;
  customer?: string;
  date: string;
  price: number;
  status: "Delivered" | "In Transit" | "Processing" | "Cancelled";
  img: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  address: string;
}

export interface NotificationItem {
  id: string;
  icon: string;
  text: string;
  time: string;
  read: boolean;
}

export interface ImpactStats {
  co2: number;
  water: number;
  items: number;
  money: number;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

interface StoreContextType {
  // Listings
  listings: Listing[];
  addListing: (newListing: Omit<Listing, "id" | "createdAt" | "sold">) => Promise<void>;
  updateListingStatus: (id: string, sold: boolean) => Promise<void>;
  editListing: (id: string, updates: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  clearAllListings: () => Promise<void>;
  
  // Orders
  orders: OrderItem[];
  placeOrder: (item: { title: string; price: number; img: string; seller?: string }) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  clearAllOrders: () => Promise<void>;

  // Saved / Wishlist
  savedIds: string[];
  toggleSave: (id: string) => Promise<void>;
  clearAllSaved: () => Promise<void>;

  // Impact
  impact: ImpactStats;
  addImpact: (co2Kg: number, waterL: number, price: number) => Promise<void>;
  resetImpact: () => Promise<void>;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;

  // MongoDB Collection Management
  collectionsStatus: { name: string; count: number; status: string }[];
  fetchCollectionsStatus: () => Promise<void>;
  deleteCollection: (name: string) => Promise<void>;
  createOrSeedCollection: (name: string) => Promise<void>;
  wipeAllCollections: () => Promise<void>;
  seedAllCollections: () => Promise<void>;

  // Global Modals
  isNewListingModalOpen: boolean;
  openNewListingModal: () => void;
  closeNewListingModal: () => void;

  selectedItemForModal: Listing | null;
  openItemModal: (item: Listing) => void;
  closeItemModal: () => void;

  selectedOrderForTracking: OrderItem | null;
  openOrderTrackingModal: (order: OrderItem) => void;
  closeOrderTrackingModal: () => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: "success" | "info" | "error") => void;
  removeToast: (id: string) => void;

  // Sync state
  isMongoConnected: boolean;
  isSocketConnected: boolean;
  onlineUsersCount: number;
}

const INITIAL_FALLBACK_LISTINGS: Listing[] = [
  {
    id: "lst-001",
    title: "Vintage Ralph Lauren Wool Blazer",
    brand: "Ralph Lauren",
    size: "L",
    condition: "Excellent",
    category: "Outerwear",
    price: 85,
    images: ["https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=600&h=800&fit=crop&auto=format"],
    description: "Classic 90s tailoring with horn buttons. 100% pure virgin wool. Mint vintage condition.",
    sellerId: "seller-1",
    sold: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "lst-002",
    title: "Zara Mulberry Silk Wrap Dress",
    brand: "Zara",
    size: "M",
    condition: "Good",
    category: "Dresses",
    price: 42,
    images: ["https://images.unsplash.com/photo-1664076458686-3449062080ac?w=600&h=800&fit=crop&auto=format"],
    description: "Fluid emerald silk wrap dress with ties. Beautiful drape, worn twice for gallery events.",
    sellerId: "seller-2",
    sold: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "lst-003",
    title: "Linen Minimalist Co-ord Set",
    brand: "& Other Stories",
    size: "S",
    condition: "Like New",
    category: "Tops & Tees",
    price: 68,
    images: ["https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?w=600&h=800&fit=crop&auto=format"],
    description: "Breathable European flax linen. Top and matching tailored trousers.",
    sellerId: "seller-3",
    sold: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "lst-004",
    title: "Massimo Dutti Heavy Wool Overcoat",
    brand: "Massimo Dutti",
    size: "M",
    condition: "Good",
    category: "Outerwear",
    price: 130,
    images: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=800&fit=crop&auto=format"],
    description: "Camel colored double-breasted coat. Warm Italian wool blend.",
    sellerId: "seller-4",
    sold: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "lst-005",
    title: "Acne Studios Canada Wool Scarf",
    brand: "Acne Studios",
    size: "OS",
    condition: "Like New",
    category: "Accessories",
    price: 78,
    images: ["https://images.unsplash.com/photo-1619161519929-befcb28d6384?w=500&h=660&fit=crop&auto=format"],
    description: "Oversized virgin wool scarf in classic oat melange with fringe hem.",
    sellerId: "seller-1",
    sold: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "lst-006",
    title: "Toteme Silk Midi Dress",
    brand: "Toteme",
    size: "S",
    condition: "Good",
    category: "Dresses",
    price: 180,
    images: ["https://images.unsplash.com/photo-1664076458686-3449062080ac?w=500&h=660&fit=crop&auto=format"],
    description: "Minimalist black silk dress with high neckline.",
    sellerId: "seller-2",
    sold: true,
    createdAt: new Date().toISOString(),
  },
];

export const HARSHA_DEFAULT_ORDERS: OrderItem[] = [
  {
    id: "#FC-00412",
    item: "Vintage Levi's 501 Original Fit",
    seller: "Marco R.",
    date: "Sep 8, 2026",
    price: 54,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1642359730306-4e80ff12ff6d?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-8829104",
    carrier: "EcoCourier Express (100% Electric)",
    estimatedDelivery: "Delivered on Sep 11, 2026",
    address: "Flat 402, Green Meadows, Bengaluru, 560034",
  },
  {
    id: "#FC-00398",
    item: "Ganni Pastel Check Ruffle Blouse",
    seller: "Ana K.",
    date: "Sep 2, 2026",
    price: 67,
    status: "In Transit",
    img: "https://images.unsplash.com/photo-1624192647570-1131acc12ccf?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-9912034",
    carrier: "BlueDart CarbonNeutral",
    estimatedDelivery: "Arriving Tomorrow by 5:00 PM",
    address: "Flat 402, Green Meadows, Bengaluru, 560034",
  },
  {
    id: "#FC-00371",
    item: "Bottega Veneta Mule Heels",
    seller: "Lea B.",
    date: "Aug 25, 2026",
    price: 210,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1680690653166-1618c3bcdf51?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-7734190",
    carrier: "EcoCourier Express",
    estimatedDelivery: "Delivered on Aug 28, 2026",
    address: "Flat 402, Green Meadows, Bengaluru, 560034",
  },
  {
    id: "#FC-00289",
    item: "Organic Linen Oversized Shirt",
    seller: "Priya Archives",
    date: "Aug 12, 2026",
    price: 75,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-6619021",
    carrier: "EcoCourier Express",
    estimatedDelivery: "Delivered on Aug 15, 2026",
    address: "Flat 402, Green Meadows, Bengaluru, 560034",
  },
];

export const SELLER_DEFAULT_ORDERS: OrderItem[] = [
  {
    id: "#FC-00520",
    item: "Vintage Ralph Lauren Wool Blazer",
    seller: "Admin Seller Studio",
    customer: "Sophia Laurent (Bengaluru)",
    date: "Nov 3, 2026",
    price: 85,
    status: "In Transit",
    img: "https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-9941088",
    carrier: "EcoCourier Express (100% Electric)",
    estimatedDelivery: "Out for delivery to buyer today",
    address: "Flat 204, Indiranagar 12th Main, Bengaluru, 560038",
  },
  {
    id: "#FC-00488",
    item: "Toteme Silk Midi Dress",
    seller: "Admin Seller Studio",
    customer: "Priya Sen (Mumbai)",
    date: "Oct 28, 2026",
    price: 180,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1664076458686-3449062080ac?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-7782194",
    carrier: "EcoCourier Express",
    estimatedDelivery: "Delivered & verified on Oct 30, 2026",
    address: "Tower 3, Bandra West, Mumbai, 400050",
  },
  {
    id: "#FC-00432",
    item: "Yves Saint Laurent Rive Gauche Trench",
    seller: "Admin Seller Studio",
    customer: "Ananya Verma (Delhi)",
    date: "Oct 15, 2026",
    price: 480,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-6549012",
    carrier: "BlueDart CarbonNeutral",
    estimatedDelivery: "Delivered & verified on Oct 18, 2026",
    address: "Sector 14, Greater Kailash 1, New Delhi, 110048",
  },
  {
    id: "#FC-00395",
    item: "Celine Triomphe Wool Flannel Trousers",
    seller: "Admin Seller Studio",
    customer: "Kavya Nambiar (Kochi)",
    date: "Oct 02, 2026",
    price: 320,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-5412980",
    carrier: "EcoCourier Express",
    estimatedDelivery: "Delivered & verified on Oct 05, 2026",
    address: "Marine Drive Enclave, Kochi, 682011",
  },
  {
    id: "#FC-00340",
    item: "Issey Miyake Pleats Please Top",
    seller: "Admin Seller Studio",
    customer: "Rohan Kapoor (Pune)",
    date: "Sep 18, 2026",
    price: 260,
    status: "Delivered",
    img: "https://images.unsplash.com/photo-1624192647570-1131acc12ccf?w=200&h=200&fit=crop&auto=format",
    trackingNumber: "FC-IND-4321908",
    carrier: "EcoCourier Express",
    estimatedDelivery: "Delivered & verified on Sep 21, 2026",
    address: "Koregaon Park Lane 7, Pune, 411001",
  },
];

export const SELLER_DEFAULT_IMPACT: ImpactStats = {
  co2: 74.2,
  water: 3600,
  items: 4,
  money: 1240,
};

export const SELLER_DEFAULT_NOTIFS: NotificationItem[] = [
  {
    id: "notif-s1",
    icon: "🚚",
    text: "Order #FC-00520 (Ralph Lauren Wool Blazer) is currently In Transit to Sophia Laurent.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "notif-s2",
    icon: "💰",
    text: "Payout of 180₹ for Order #FC-00488 (Toteme Silk Dress) has been credited to your studio balance.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "notif-s3",
    icon: "⭐",
    text: "Buyer rated Order #FC-00432 5 stars: 'Exceptional vintage quality and zero-waste packaging!'",
    time: "3 days ago",
    read: true,
  },
];

export const HARSHA_DEFAULT_IMPACT: ImpactStats = {
  co2: 48.4,
  water: 2400,
  items: 12,
  money: 480,
};

export const HARSHA_DEFAULT_SAVED = ["lst-001", "lst-002", "lst-003", "lst-005"];

export const HARSHA_DEFAULT_NOTIFS: NotificationItem[] = [
  {
    id: "notif-h1",
    icon: "📦",
    text: "Your order #FC-00398 (Ganni Pastel Check Blouse) is In Transit with EcoCourier Express!",
    time: "15m ago",
    read: false,
  },
  {
    id: "notif-h2",
    icon: "🌿",
    text: "You reached #4 on the Bengaluru Top Buyers Leaderboard with 48.4 kg CO₂ prevented!",
    time: "2h ago",
    read: false,
  },
  {
    id: "notif-h3",
    icon: "🏷️",
    text: "Price Drop Alert: Vintage Ralph Lauren Wool Blazer on your wishlist dropped to 85₹",
    time: "1d ago",
    read: true,
  },
  {
    id: "notif-h4",
    icon: "✨",
    text: "Welcome back Harsha! You have 1,420 circular points and Gold Contributor tier.",
    time: "3d ago",
    read: true,
  },
];

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const cached = localStorage.getItem("fc_cached_listings");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_FALLBACK_LISTINGS;
  });

  // Synchronous local hydration on initialization to eliminate 0-orders delay / flash
  const [orders, setOrders] = useState<OrderItem[]>(() => {
    try {
      const savedUserStr = localStorage.getItem("fc_user");
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      const uid = savedUser?.id;
      const isHarsha = savedUser?.email === "harsha@gmail.com" || uid === "usr-buyer-harsha";
      const isSeller = savedUser?.email === "admin@gmail.com" || uid === "usr-seller-admin" || savedUser?.role === "seller";
      if (uid) {
        const local = localStorage.getItem(`fc_orders_${uid}`);
        if (local) return JSON.parse(local);
      }
      if (isSeller) {
        return SELLER_DEFAULT_ORDERS;
      }
      if (isHarsha) {
        return HARSHA_DEFAULT_ORDERS;
      }
    } catch {}
    return [];
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const savedUserStr = localStorage.getItem("fc_user");
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      const uid = savedUser?.id;
      const isHarsha = savedUser?.email === "harsha@gmail.com" || uid === "usr-buyer-harsha";
      if (uid) {
        const local = localStorage.getItem(`fc_saved_${uid}`);
        if (local) return JSON.parse(local);
      }
      if (isHarsha) {
        return HARSHA_DEFAULT_SAVED;
      }
    } catch {}
    return [];
  });

  const [impact, setImpact] = useState<ImpactStats>(() => {
    try {
      const savedUserStr = localStorage.getItem("fc_user");
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      const uid = savedUser?.id;
      const isHarsha = savedUser?.email === "harsha@gmail.com" || uid === "usr-buyer-harsha";
      const isSeller = savedUser?.email === "admin@gmail.com" || uid === "usr-seller-admin" || savedUser?.role === "seller";
      if (uid) {
        const local = localStorage.getItem(`fc_impact_${uid}`);
        if (local) return JSON.parse(local);
      }
      if (isSeller) {
        return SELLER_DEFAULT_IMPACT;
      }
      if (isHarsha) {
        return HARSHA_DEFAULT_IMPACT;
      }
    } catch {}
    return { co2: 0, water: 0, items: 0, money: 0 };
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isMongoConnected, setIsMongoConnected] = useState(false);

  // Modals
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<Listing | null>(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<OrderItem | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Fetch Marketplace Listings (Global catalog)
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRes = await apiRequest<Listing[]>("/listings").catch(() => []);
        if (listingsRes && listingsRes.length > 0) {
          setListings(listingsRes);
          try {
            localStorage.setItem("fc_cached_listings", JSON.stringify(listingsRes));
          } catch (e) {}
          setIsMongoConnected(true);
        }
      } catch (err) {
        console.warn("MongoDB listings fetch warning:", err);
      }
    }
    fetchListings();
  }, []);

  // 2. Fetch User-Specific Data (Isolated per account)
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setSavedIds([]);
      setOrders([]);
      setNotifications([]);
      setImpact({ co2: 0, water: 0, items: 0, money: 0 });
      return;
    }

    const currentUserId = user.id;
    const isHarsha = user.email === "harsha@gmail.com" || user.id === "usr-buyer-harsha";
    const isSeller = user.email === "admin@gmail.com" || user.id === "usr-seller-admin" || user.role === "seller";

    // 1. Immediately & synchronously load cached wishlist for THIS user
    let localSaved = localStorage.getItem(`fc_saved_${currentUserId}`);
    if (!localSaved && isHarsha) {
      const legacySaved = localStorage.getItem("fc_saved_items");
      localSaved = legacySaved || JSON.stringify(HARSHA_DEFAULT_SAVED);
      localStorage.setItem(`fc_saved_${currentUserId}`, localSaved);
    }
    if (localSaved) {
      try {
        setSavedIds(JSON.parse(localSaved));
      } catch {
        setSavedIds(isHarsha ? HARSHA_DEFAULT_SAVED : []);
      }
    } else {
      setSavedIds(isHarsha ? HARSHA_DEFAULT_SAVED : []);
    }

    // 2. Immediately & synchronously load cached orders for THIS user (eliminates 0-orders flash / delay)
    let localOrders = localStorage.getItem(`fc_orders_${currentUserId}`);
    if (!localOrders) {
      if (isSeller) {
        localOrders = JSON.stringify(SELLER_DEFAULT_ORDERS);
        localStorage.setItem(`fc_orders_${currentUserId}`, localOrders);
      } else if (isHarsha) {
        localOrders = JSON.stringify(HARSHA_DEFAULT_ORDERS);
        localStorage.setItem(`fc_orders_${currentUserId}`, localOrders);
      }
    }
    if (localOrders) {
      try {
        setOrders(JSON.parse(localOrders));
      } catch {
        setOrders(isSeller ? SELLER_DEFAULT_ORDERS : (isHarsha ? HARSHA_DEFAULT_ORDERS : []));
      }
    } else {
      setOrders(isSeller ? SELLER_DEFAULT_ORDERS : (isHarsha ? HARSHA_DEFAULT_ORDERS : []));
    }

    // 3. Immediately & synchronously load cached impact for THIS user (eliminates 0-impact flash)
    let localImpact = localStorage.getItem(`fc_impact_${currentUserId}`);
    if (!localImpact) {
      if (isSeller) {
        localImpact = JSON.stringify(SELLER_DEFAULT_IMPACT);
        localStorage.setItem(`fc_impact_${currentUserId}`, localImpact);
      } else if (isHarsha) {
        localImpact = JSON.stringify(HARSHA_DEFAULT_IMPACT);
        localStorage.setItem(`fc_impact_${currentUserId}`, localImpact);
      }
    }
    if (localImpact) {
      try {
        setImpact(JSON.parse(localImpact));
      } catch {
        setImpact(isSeller ? SELLER_DEFAULT_IMPACT : (isHarsha ? HARSHA_DEFAULT_IMPACT : { co2: 0, water: 0, items: 0, money: 0 }));
      }
    } else {
      setImpact(isSeller ? SELLER_DEFAULT_IMPACT : (isHarsha ? HARSHA_DEFAULT_IMPACT : { co2: 0, water: 0, items: 0, money: 0 }));
    }

    async function fetchUserData() {
      try {
        const [ordersRes, savedRes, impactRes, notifsRes] = await Promise.all([
          apiRequest<OrderItem[]>("/orders").catch(() => []),
          apiRequest<string[]>("/saved").catch(() => []),
          apiRequest<ImpactStats>("/impact").catch(() => null),
          apiRequest<NotificationItem[]>("/notifications").catch(() => []),
        ]);

        const effectiveSaved = (savedRes && savedRes.length > 0)
          ? savedRes
          : (isHarsha ? HARSHA_DEFAULT_SAVED : []);
        setSavedIds(effectiveSaved);
        localStorage.setItem(`fc_saved_${currentUserId}`, JSON.stringify(effectiveSaved));

        const effectiveOrders: OrderItem[] = (ordersRes && ordersRes.length > 0)
          ? ordersRes
          : (isSeller ? SELLER_DEFAULT_ORDERS : (isHarsha ? HARSHA_DEFAULT_ORDERS : []));
        setOrders(effectiveOrders);
        localStorage.setItem(`fc_orders_${currentUserId}`, JSON.stringify(effectiveOrders));

        const effectiveImpact: ImpactStats = (impactRes && (impactRes.money > 0 || impactRes.items > 0 || impactRes.co2 > 0))
          ? { ...impactRes, co2: Math.round(Number(impactRes.co2 || 0) * 10) / 10 }
          : (isSeller ? SELLER_DEFAULT_IMPACT : (isHarsha ? HARSHA_DEFAULT_IMPACT : { co2: 0, water: 0, items: 0, money: 0 }));
        setImpact(effectiveImpact);
        localStorage.setItem(`fc_impact_${currentUserId}`, JSON.stringify(effectiveImpact));

        const effectiveNotifs: NotificationItem[] = (notifsRes && notifsRes.length > 0)
          ? notifsRes
          : (isSeller ? SELLER_DEFAULT_NOTIFS : (isHarsha ? HARSHA_DEFAULT_NOTIFS : []));
        setNotifications(effectiveNotifs);
      } catch (err) {
        console.warn("MongoDB user data fetch warning:", err);
      }
    }

    fetchUserData();
  }, [user?.id, isAuthenticated]);

  // Socket.IO Real-time Connection
  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);
  const [onlineUsersCount, setOnlineUsersCount] = useState(1);

  useEffect(() => {
    const onConnect = () => setIsSocketConnected(true);
    const onDisconnect = () => setIsSocketConnected(false);
    const handleUsersOnline = ({ count }: { count: number }) => setOnlineUsersCount(count);
    const handleListingCreated = (newItem: Listing) => {
      setListings((prev) => {
        if (prev.some((item) => item.id === newItem.id)) return prev;
        const next = [newItem, ...prev];
        try {
          localStorage.setItem("fc_cached_listings", JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      // Real-time alert & notification for buyers
      if (user?.role !== "seller") {
        showToast(`✨ Fresh Drop: "${newItem.title}" just published!`);
        setNotifications((prev) => [
          {
            id: `notif-drop-${Date.now()}`,
            icon: "🛍️",
            text: `New Arrival: "${newItem.title}" by ${newItem.brand} (${newItem.price}₹) just dropped in the shop!`,
            time: "Just now",
            read: false,
          },
          ...prev,
        ]);
      }
    };

    const handleOrderCancelled = ({ orderId }: { orderId: string }) => {
      setOrders((prev) =>
        prev.filter((o) => o.id !== orderId && o.id !== `#${orderId}` && o.id !== orderId.replace(/^#/, ""))
      );
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("users_online", handleUsersOnline);
    socket.on("listing_created", handleListingCreated);
    socket.on("order_cancelled", handleOrderCancelled);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("users_online", handleUsersOnline);
      socket.off("listing_created", handleListingCreated);
      socket.off("order_cancelled", handleOrderCancelled);
    };
  }, []);





  const addListing = async (newListing: Omit<Listing, "id" | "createdAt" | "sold">) => {
    try {
      const created = await apiRequest<Listing>("/listings", {
        method: "POST",
        body: JSON.stringify(newListing),
      });

      setListings((prev) => {
        const next = [created, ...prev.filter((l) => l.id !== created.id)];
        try {
          localStorage.setItem("fc_cached_listings", JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      // Broadcast over WebSocket directly so all connected buyer clients receive it immediately
      socket.emit("publish_listing", created);

      setImpact((prev) => ({
        ...prev,
        items: prev.items + 1,
        co2: Number((prev.co2 + 3.2).toFixed(1)),
        water: prev.water + 320,
      }));
      showToast(`Piece "${newListing.title}" saved to MongoDB & published live! 🎉`);
    } catch (err: any) {
      console.error("MongoDB listing error:", err);
      // Fallback local listing with id and createdAt so it displays reliably on screen
      const fallback: Listing = {
        ...newListing,
        id: `lst-${Date.now()}`,
        createdAt: new Date().toISOString(),
        sold: false,
        views: 0,
        likes: 0,
      };
      setListings((prev) => {
        const next = [fallback, ...prev.filter((l) => l.id !== fallback.id)];
        try {
          localStorage.setItem("fc_cached_listings", JSON.stringify(next));
        } catch (e) {}
        return next;
      });
      socket.emit("publish_listing", fallback);
      showToast(err?.message ? `Notice: ${err.message}` : "Listing created locally", "info");
    }
  };

  const updateListingStatus = async (id: string, sold: boolean) => {
    try {
      await apiRequest<Listing>(`/listings/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ sold }),
      });
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, sold } : l))
      );
      showToast(sold ? "Saved to MongoDB: Marked Sold" : "Saved to MongoDB: Relisted Active");
    } catch (err) {
      console.error("MongoDB update listing error:", err);
    }
  };

  const editListing = async (id: string, updates: Partial<Listing>) => {
    try {
      const updated = await apiRequest<Listing>(`/listings/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updated } : l))
      );
      showToast(`Piece "${updated.title}" updated in MongoDB! 🌿`);
    } catch (err: any) {
      console.error("MongoDB update listing error:", err);
      // Fallback local update
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
      );
      showToast("Listing updated locally", "info");
    }
  };

  const deleteListing = async (id: string) => {
    try {
      await apiRequest<{ success: boolean }>(`/listings/${id}`, {
        method: "DELETE",
      });
      setListings((prev) => prev.filter((l) => l.id !== id));
      showToast("Listing removed from MongoDB.", "info");
    } catch (err) {
      console.error("MongoDB delete error:", err);
    }
  };

  const placeOrder = async (item: { title: string; price: number; img: string; seller?: string }) => {
    const isHarsha = user?.email === "harsha@gmail.com" || user?.id === "usr-buyer-harsha";
    const savingsToAdd = Math.round(item.price * 1.4);
    
    // Dynamic circular environmental impact formula
    const garmentsPurchased = 1;
    const waterToAdd = Math.max(0, (garmentsPurchased * 2400 * 0.70) - (garmentsPurchased * 100));
    const co2ToAdd = Number(Math.max(0, (garmentsPurchased * 12 * 0.70) - (garmentsPurchased * 1)).toFixed(1));

    try {
      const created = await apiRequest<OrderItem>("/orders", {
        method: "POST",
        body: JSON.stringify({
          buyerId: user?.id || "guest",
          userId: user?.id || "guest",
          item: item.title,
          price: item.price,
          img: item.img,
          seller: item.seller,
          savings: savingsToAdd,
          co2: co2ToAdd,
          water: waterToAdd,
        }),
      });

      const orderItem: OrderItem = created || {
        id: `#FC-${Math.floor(1000 + Math.random() * 9000)}`,
        item: item.title,
        seller: item.seller || "FashionCycle Verified Seller",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        price: item.price,
        status: "In Transit",
        img: item.img,
        trackingNumber: `FC-IND-${Math.floor(1000000 + Math.random() * 9000000)}`,
        carrier: "EcoCourier Express (100% Electric)",
        estimatedDelivery: "Arriving Tomorrow by 5:00 PM",
        address: "Flat 402, Green Meadows, Bengaluru, 560034",
      };

      setOrders((prev) => {
        const nextOrders = [orderItem, ...prev.filter((o) => o.id !== orderItem.id)];
        if (user?.id) {
          localStorage.setItem(`fc_orders_${user.id}`, JSON.stringify(nextOrders));
        }
        return nextOrders;
      });

      setImpact((prev) => {
        const baseMoney = prev.money > 0 ? prev.money : (isHarsha ? 480 : 0);
        const baseWater = prev.water > 0 ? prev.water : (isHarsha ? 2400 : 0);
        const baseCo2 = prev.co2 > 0 ? prev.co2 : (isHarsha ? 48.4 : 0);

        const updatedImpact = {
          items: prev.items + 1,
          co2: Number((baseCo2 + co2ToAdd).toFixed(1)),
          water: baseWater + waterToAdd,
          money: baseMoney + savingsToAdd,
        };
        if (user?.id) {
          localStorage.setItem(`fc_impact_${user.id}`, JSON.stringify(updatedImpact));
        }
        return updatedImpact;
      });

      showToast(`Order placed for "${item.title}"! +${savingsToAdd}₹ savings vs retail 🌱`);
    } catch (err) {
      console.error("MongoDB order error (using local fallback):", err);
      const fallbackOrder: OrderItem = {
        id: `#FC-${Math.floor(1000 + Math.random() * 9000)}`,
        item: item.title,
        seller: item.seller || "FashionCycle Verified Seller",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        price: item.price,
        status: "In Transit",
        img: item.img,
        trackingNumber: `FC-IND-${Math.floor(1000000 + Math.random() * 9000000)}`,
        carrier: "EcoCourier Express (100% Electric)",
        estimatedDelivery: "Arriving Tomorrow by 5:00 PM",
        address: "Flat 402, Green Meadows, Bengaluru, 560034",
      };
      setOrders((prev) => {
        const nextOrders = [fallbackOrder, ...prev.filter((o) => o.id !== fallbackOrder.id)];
        if (user?.id) {
          localStorage.setItem(`fc_orders_${user.id}`, JSON.stringify(nextOrders));
        }
        return nextOrders;
      });
      setImpact((prev) => {
        const baseMoney = prev.money > 0 ? prev.money : (isHarsha ? 480 : 0);
        const baseWater = prev.water > 0 ? prev.water : (isHarsha ? 2400 : 0);
        const baseCo2 = prev.co2 > 0 ? prev.co2 : (isHarsha ? 48.4 : 0);

        const updatedImpact = {
          items: prev.items + 1,
          co2: Number((baseCo2 + co2ToAdd).toFixed(1)),
          water: baseWater + waterToAdd,
          money: baseMoney + savingsToAdd,
        };
        if (user?.id) {
          localStorage.setItem(`fc_impact_${user.id}`, JSON.stringify(updatedImpact));
        }
        return updatedImpact;
      });
      showToast(`Order placed for "${item.title}"! +${savingsToAdd}₹ savings vs retail 🌱`);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const cleanId = orderId.trim();
      const encodedId = encodeURIComponent(cleanId);

      const targetOrder = orders.find(
        (o) => o.id === cleanId || o.id === cleanId.replace(/^#/, "") || o.id === `#${cleanId}`
      );
      const priceToDeduct = targetOrder ? targetOrder.price : 50;
      const savingsToDeduct = Math.round(priceToDeduct * 1.4);
      const garmentsPurchased = 1;
      const waterToDeduct = Math.max(0, (garmentsPurchased * 2400 * 0.70) - (garmentsPurchased * 100));
      const co2ToDeduct = Number(Math.max(0, (garmentsPurchased * 12 * 0.70) - (garmentsPurchased * 1)).toFixed(1));

      // 1. Optimistically update local orders state & local storage
      setOrders((prev) => {
        const next = prev.filter(
          (o) => o.id !== cleanId && o.id !== cleanId.replace(/^#/, "") && o.id !== `#${cleanId}`
        );
        if (user?.id) {
          localStorage.setItem(`fc_orders_${user.id}`, JSON.stringify(next));
        }
        return next;
      });

      // 2. Decrement circular impact metrics
      setImpact((prev) => {
        const next = {
          items: Math.max(0, prev.items - 1),
          money: Math.max(0, prev.money - savingsToDeduct),
          water: Math.max(0, prev.water - waterToDeduct),
          co2: Number(Math.max(0, prev.co2 - co2ToDeduct).toFixed(1)),
        };
        if (user?.id) {
          localStorage.setItem(`fc_impact_${user.id}`, JSON.stringify(next));
        }
        return next;
      });

      // 3. Delete from MongoDB Atlas (encoded URI + JSON body)
      await apiRequest(`/orders/${encodedId}`, {
        method: "DELETE",
        body: JSON.stringify({ id: cleanId, orderId: cleanId }),
      });

      showToast(`Order ${cleanId} cancelled and deleted from MongoDB Atlas 🌱`, "info");
    } catch (err) {
      console.error("MongoDB order cancel error:", err);
    }
  };



  const toggleSave = async (id: string) => {
    if (!user) {
      showToast("Please sign in to save pieces to your wishlist!", "info");
      return;
    }

    try {
      const match = listings.find((l) => l.id === id);
      const res = await apiRequest<{ saved: boolean; listingId: string }>(`/saved/toggle/${id}`, {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          title: match?.title,
          brand: match?.brand,
          price: match?.price,
          image: match?.images?.[0],
          category: match?.category,
          size: match?.size,
          condition: match?.condition,
        }),
      });

      setSavedIds((prev) => {
        const next = res.saved
          ? (prev.includes(id) ? prev : [...prev, id])
          : prev.filter((i) => i !== id);
        localStorage.setItem(`fc_saved_${user.id}`, JSON.stringify(next));
        return next;
      });

      if (res.saved) {
        showToast("Saved to your wishlist! ♥");
      } else {
        showToast("Removed from your wishlist", "info");
      }
    } catch (err) {
      console.error("MongoDB wishlist toggle error:", err);
    }
  };

  const addImpact = async (co2Kg: number, waterL: number, price: number) => {
    try {
      const updated = await apiRequest<ImpactStats>("/impact/add", {
        method: "POST",
        body: JSON.stringify({ co2: co2Kg, water: waterL, items: 1, money: price }),
      });
      setImpact({ ...updated, co2: Math.round(Number(updated.co2 || 0) * 10) / 10 });
    } catch (err) {
      console.error("MongoDB impact error:", err);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await apiRequest(`/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("MongoDB notification read error:", err);
    }
  };

  const clearAllListings = async () => {
    try {
      await apiRequest("/listings", { method: "DELETE" });
      setListings([]);
      showToast("Listings collection cleared in MongoDB", "info");
    } catch (err) {
      console.error("MongoDB clear listings error:", err);
    }
  };

  const clearAllOrders = async () => {
    try {
      await apiRequest("/orders", { method: "DELETE" });
      setOrders([]);
      showToast("Orders collection cleared in MongoDB", "info");
    } catch (err) {
      console.error("MongoDB clear orders error:", err);
    }
  };

  const clearAllSaved = async () => {
    try {
      await apiRequest("/saved", { method: "DELETE" });
      setSavedIds([]);
      if (user?.id) {
        localStorage.removeItem(`fc_saved_${user.id}`);
      }
      showToast("Wishlist collection cleared", "info");
    } catch (err) {
      console.error("MongoDB clear wishlist error:", err);
    }
  };

  const resetImpact = async () => {
    try {
      const reset = await apiRequest<ImpactStats>("/impact/reset", { method: "POST" });
      setImpact(reset);
      showToast("Impact collection reset in MongoDB", "info");
    } catch (err) {
      console.error("MongoDB reset impact error:", err);
    }
  };

  const [collectionsStatus, setCollectionsStatus] = useState<{ name: string; count: number; status: string }[]>([]);

  const fetchCollectionsStatus = async () => {
    try {
      const res = await apiRequest<{ collections: { name: string; count: number; status: string }[] }>("/database/collections");
      if (res && res.collections) {
        setCollectionsStatus(res.collections);
      }
    } catch (err) {
      console.warn("MongoDB collections status fetch notice:", err);
    }
  };

  const deleteCollection = async (name: string) => {
    try {
      await apiRequest(`/database/collections/${name}`, { method: "DELETE" });
      showToast(`Collection "${name}" deleted from MongoDB`, "info");
      await fetchCollectionsStatus();
      // Update local states if relevant collection was dropped
      if (name === "listings") setListings([]);
      if (name === "orders") setOrders([]);
      if (name === "saveditems") setSavedIds([]);
      if (name === "notifications") setNotifications([]);
    } catch (err) {
      console.error("MongoDB delete collection error:", err);
      showToast(`Failed to delete collection ${name}`, "error");
    }
  };

  const createOrSeedCollection = async (name: string) => {
    try {
      await apiRequest(`/database/collections/${name}/create`, { method: "POST" });
      showToast(`Collection "${name}" created & seeded in MongoDB! 🎉`);
      await fetchCollectionsStatus();
      // Reload relevant data
      if (name === "listings") {
        const l = await apiRequest<Listing[]>("/listings").catch(() => []);
        if (l.length) setListings(l);
      }
      if (name === "orders") {
        const o = await apiRequest<OrderItem[]>("/orders").catch(() => []);
        if (o.length) setOrders(o);
      }
    } catch (err) {
      console.error("MongoDB create collection error:", err);
    }
  };

  const wipeAllCollections = async () => {
    try {
      await apiRequest("/database/wipe", { method: "DELETE" });
      setListings([]);
      setOrders([]);
      setSavedIds([]);
      setNotifications([]);
      showToast("All collections dropped from MongoDB (Clean Slate)", "info");
      await fetchCollectionsStatus();
    } catch (err) {
      console.error("MongoDB wipe error:", err);
    }
  };

  const seedAllCollections = async () => {
    try {
      await apiRequest("/database/seed", { method: "POST" });
      showToast("All FashionCycle collections seeded with fresh data! 🌱");
      const [l, o, s, imp, n] = await Promise.all([
        apiRequest<Listing[]>("/listings").catch(() => []),
        apiRequest<OrderItem[]>("/orders").catch(() => []),
        apiRequest<string[]>("/saved").catch(() => []),
        apiRequest<ImpactStats>("/impact").catch(() => null),
        apiRequest<NotificationItem[]>("/notifications").catch(() => []),
      ]);
      if (l.length) setListings(l);
      if (o.length) setOrders(o);
      if (s) setSavedIds(s);
      if (imp) setImpact(imp);
      if (n) setNotifications(n);
      await fetchCollectionsStatus();
    } catch (err) {
      console.error("MongoDB seed error:", err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await apiRequest("/notifications", { method: "DELETE" });
      setNotifications([]);
      showToast("Notifications cleared from MongoDB.", "info");
    } catch (err) {
      console.error("MongoDB notification clear error:", err);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        listings,
        addListing,
        updateListingStatus,
        editListing,
        deleteListing,
        clearAllListings,
        orders,
        placeOrder,
        cancelOrder,
        clearAllOrders,
        savedIds,
        toggleSave,
        clearAllSaved,
        impact,
        addImpact,
        resetImpact,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        collectionsStatus,
        fetchCollectionsStatus,
        deleteCollection,
        createOrSeedCollection,
        wipeAllCollections,
        seedAllCollections,
        isNewListingModalOpen,
        openNewListingModal: () => setIsNewListingModalOpen(true),
        closeNewListingModal: () => setIsNewListingModalOpen(false),
        selectedItemForModal,
        openItemModal: (item) => setSelectedItemForModal(item),
        closeItemModal: () => setSelectedItemForModal(null),
        selectedOrderForTracking,
        openOrderTrackingModal: (order) => setSelectedOrderForTracking(order),
        closeOrderTrackingModal: () => setSelectedOrderForTracking(null),
        toasts,
        showToast,
        removeToast,
        isMongoConnected,
        isSocketConnected,
        onlineUsersCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
