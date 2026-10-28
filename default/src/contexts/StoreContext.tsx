import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Listing } from "../types/listing.types";
import { apiRequest } from "../services/api";
import { socket } from "../services/socket";

export interface OrderItem {
  id: string;
  item: string;
  seller: string;
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

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(INITIAL_FALLBACK_LISTINGS);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [impact, setImpact] = useState<ImpactStats>({ co2: 48.4, water: 3820, items: 12, money: 836 });
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

  // Initial Data Fetch from MongoDB
  useEffect(() => {
    async function fetchFromMongoDB() {
      try {
        const [listingsRes, ordersRes, savedRes, impactRes, notifsRes] = await Promise.all([
          apiRequest<Listing[]>("/listings").catch(() => []),
          apiRequest<OrderItem[]>("/orders").catch(() => []),
          apiRequest<string[]>("/saved").catch(() => []),
          apiRequest<ImpactStats>("/impact").catch(() => null),
          apiRequest<NotificationItem[]>("/notifications").catch(() => []),
        ]);

        if (listingsRes && listingsRes.length > 0) {
          setListings(listingsRes);
          setIsMongoConnected(true);
        }
        if (ordersRes && ordersRes.length > 0) setOrders(ordersRes);
        if (savedRes) setSavedIds(savedRes);
        if (impactRes) setImpact({ ...impactRes, co2: Math.round(Number(impactRes.co2 || 0) * 10) / 10 });
        if (notifsRes) setNotifications(notifsRes);
      } catch (err) {
        console.warn("MongoDB initial fetch warning:", err);
      }
    }

    fetchFromMongoDB();
  }, []);

  // Socket.IO Real-time Connection
  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);
  const [onlineUsersCount, setOnlineUsersCount] = useState(1);

  useEffect(() => {
    const onConnect = () => setIsSocketConnected(true);
    const onDisconnect = () => setIsSocketConnected(false);
    const handleUsersOnline = ({ count }: { count: number }) => setOnlineUsersCount(count);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("users_online", handleUsersOnline);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("users_online", handleUsersOnline);
    };
  }, []);





  const addListing = async (newListing: Omit<Listing, "id" | "createdAt" | "sold">) => {
    try {
      const created = await apiRequest<Listing>("/listings", {
        method: "POST",
        body: JSON.stringify(newListing),
      });

      setListings((prev) => [created, ...prev]);
      setImpact((prev) => ({
        ...prev,
        items: prev.items + 1,
        co2: Number((prev.co2 + 3.2).toFixed(1)),
        water: prev.water + 320,
      }));
      showToast(`Piece "${newListing.title}" saved to MongoDB! 🎉`);
    } catch (err) {
      console.error("MongoDB listing error:", err);
      showToast("Listing created locally", "info");
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
    try {
      const created = await apiRequest<OrderItem>("/orders", {
        method: "POST",
        body: JSON.stringify({
          item: item.title,
          price: item.price,
          img: item.img,
          seller: item.seller,
        }),
      });

      setOrders((prev) => [created, ...prev]);
      setImpact((prev) => ({
        ...prev,
        items: prev.items + 1,
        co2: Number((prev.co2 + 4.1).toFixed(1)),
        water: prev.water + 450,
        money: prev.money + item.price,
      }));
      showToast(`Order ${created.id} saved to MongoDB! 🎉`);
    } catch (err) {
      console.error("MongoDB order error:", err);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await apiRequest(`/orders/${orderId}`, {
        method: "DELETE",
      });
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      showToast(`Order ${orderId} cancelled in MongoDB.`, "info");
    } catch (err) {
      console.error("MongoDB order cancel error:", err);
    }
  };



  const toggleSave = async (id: string) => {
    try {
      const res = await apiRequest<{ saved: boolean; listingId: string }>(`/saved/toggle/${id}`, {
        method: "POST",
      });

      if (res.saved) {
        setSavedIds((prev) => [...prev, id]);
        showToast("Saved to MongoDB wishlist! ♥");
      } else {
        setSavedIds((prev) => prev.filter((i) => i !== id));
        showToast("Removed from MongoDB wishlist", "info");
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
      showToast("Wishlist collection cleared in MongoDB", "info");
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
