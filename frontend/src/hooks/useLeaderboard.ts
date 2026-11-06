import { useState, useEffect, useMemo } from "react";
import { useAuth } from "./useAuth";
import { useStore } from "../contexts/StoreContext";
import { apiRequest } from "../services/api";

export interface LeaderboardUser {
  rank: number;
  name: string;
  handle: string;
  avatar: string;
  city: string;
  co2Saved: number;
  itemsCycled: number;
  badge: string;
  points: number;
  isCurrentUser?: boolean;
}

export type LeaderboardPeriod = "month" | "allTime" | "local";

export const DEFAULT_LEADERBOARD: Record<LeaderboardPeriod, LeaderboardUser[]> = {
  month: [
    { rank: 1, name: "Ananya Sen", handle: "@ananyathrifts", avatar: "AS", city: "Bengaluru, IN", co2Saved: 164.2, itemsCycled: 38, badge: "👑 Top Circular Buyer", points: 4850 },
    { rank: 2, name: "Vikram Malhotra", handle: "@vikramvintage", avatar: "VM", city: "Bengaluru, IN", co2Saved: 136.5, itemsCycled: 29, badge: "🛍️ Zero Waste Buyer", points: 3920 },
    { rank: 3, name: "Maya Kapoor", handle: "@mayarepeats", avatar: "MK", city: "Bengaluru, IN", co2Saved: 98.4, itemsCycled: 21, badge: "👗 Conscious Collector", points: 3150 },
    { rank: 4, name: "Harsha Shetty", handle: "@harsha", avatar: "HA", city: "Bengaluru, IN", co2Saved: 48.4, itemsCycled: 12, badge: "🌿 Rising Buyer", points: 1420 },
    { rank: 5, name: "Rohan Varma", handle: "@rohanreclaims", avatar: "RV", city: "Hyderabad, IN", co2Saved: 62.0, itemsCycled: 14, badge: "🌱 Mindful Thrifter", points: 1600 },
    { rank: 6, name: "Diya Roy", handle: "@diyasaves", avatar: "DR", city: "Kolkata, IN", co2Saved: 49.5, itemsCycled: 11, badge: "✨ Sustainable Stylist", points: 1280 },
    { rank: 7, name: "Dev Patel", handle: "@devcircular", avatar: "DP", city: "Bengaluru, IN", co2Saved: 38.0, itemsCycled: 9, badge: "🌟 Eco Patron", points: 980 },
    { rank: 8, name: "Nisha Rao", handle: "@nishathrifts", avatar: "NR", city: "Bengaluru, IN", co2Saved: 26.5, itemsCycled: 6, badge: "🧵 Local Thrift Hero", points: 720 },
  ],
  allTime: [
    { rank: 1, name: "Zara Chen", handle: "@zarathrifts", avatar: "ZC", city: "Singapore", co2Saved: 684.5, itemsCycled: 186, badge: "👑 Global Circular Buyer", points: 18900 },
    { rank: 2, name: "Ananya Sen", handle: "@ananyathrifts", avatar: "AS", city: "Bengaluru, IN", co2Saved: 542.0, itemsCycled: 134, badge: "🌱 Master Shopper", points: 14200 },
    { rank: 3, name: "Mateo Silva", handle: "@mateothrift", avatar: "MS", city: "Lisbon, PT", co2Saved: 478.2, itemsCycled: 112, badge: "♻️ Zero Waste Legend", points: 12100 },
    { rank: 4, name: "Vikram Malhotra", handle: "@vikramvintage", avatar: "VM", city: "Bengaluru, IN", co2Saved: 390.6, itemsCycled: 94, badge: "👗 Vintage Patron", points: 9800 },
    { rank: 14, name: "Harsha Shetty", handle: "@harsha", avatar: "HA", city: "Bengaluru, IN", co2Saved: 148.4, itemsCycled: 34, badge: "🌿 Verified Buyer", points: 3420 },
  ],
  local: [
    { rank: 1, name: "Ananya Sen", handle: "@ananyathrifts", avatar: "AS", city: "Bengaluru, IN", co2Saved: 164.2, itemsCycled: 38, badge: "👑 Top Circular Buyer", points: 4850 },
    { rank: 2, name: "Vikram Malhotra", handle: "@vikramvintage", avatar: "VM", city: "Bengaluru, IN", co2Saved: 136.5, itemsCycled: 29, badge: "🛍️ Zero Waste Buyer", points: 3920 },
    { rank: 3, name: "Maya Kapoor", handle: "@mayarepeats", avatar: "MK", city: "Bengaluru, IN", co2Saved: 98.4, itemsCycled: 21, badge: "👗 Conscious Collector", points: 3150 },
    { rank: 4, name: "Harsha Shetty", handle: "@harsha", avatar: "HA", city: "Bengaluru, IN", co2Saved: 48.4, itemsCycled: 12, badge: "🌿 Top 4 Buyer in Bengaluru", points: 1420 },
    { rank: 5, name: "Dev Patel", handle: "@devcircular", avatar: "DP", city: "Bengaluru, IN", co2Saved: 38.0, itemsCycled: 9, badge: "🌟 Eco Patron", points: 980 },
    { rank: 6, name: "Nisha Rao", handle: "@nishathrifts", avatar: "NR", city: "Bengaluru, IN", co2Saved: 26.5, itemsCycled: 6, badge: "🧵 Local Thrift Hero", points: 720 },
  ],
};

// Module-level cache so Home screen and Leaderboard page instantly share API responses
let cachedLeaderboards: Record<LeaderboardPeriod, LeaderboardUser[]> | null = null;

export function useLeaderboard(period: LeaderboardPeriod = "month") {
  const { user } = useAuth();
  const { impact, orders } = useStore();
  const [data, setData] = useState<LeaderboardUser[]>(() => {
    if (cachedLeaderboards && cachedLeaderboards[period]) {
      return cachedLeaderboards[period];
    }
    return DEFAULT_LEADERBOARD[period];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    apiRequest<LeaderboardUser[]>(`/leaderboard?period=${period}`)
      .then((res) => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          cachedLeaderboards = {
            ...(cachedLeaderboards || DEFAULT_LEADERBOARD),
            [period]: res,
          };
          setData(res);
        }
      })
      .catch((err) => {
        console.warn(`[Leaderboard API] Fallback to default for ${period}:`, err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [period]);

  const isDemo = user?.email === "harsha@gmail.com" || user?.email === "admin@gmail.com";

  // Build the live synchronized list incorporating live user impact & orders
  const { list, currentUserData } = useMemo(() => {
    const liveCo2 = Number(impact.co2) || 0;
    const liveItems = Number(impact.items) || orders.length;

    // Determine current user stats
    let userEntry: LeaderboardUser;

    if (isDemo) {
      const effectiveCo2 = liveCo2 > 0 ? liveCo2 : 48.4;
      const effectiveItems = liveItems > 0 ? liveItems : 12;
      // Recalculate dynamic points: base 1420 + points for items beyond baseline
      const addedCo2 = Math.max(0, effectiveCo2 - 48.4);
      const addedItems = Math.max(0, effectiveItems - 12);
      const effectivePoints = 1420 + Math.round(addedCo2 * 30 + addedItems * 50);

      const dynamicBadge =
        effectiveItems >= 30
          ? "👑 Top Circular Buyer"
          : effectiveItems >= 20
          ? "👗 Conscious Collector"
          : effectiveItems >= 10
          ? "🌿 Rising Buyer"
          : "🌱 Active Cycler";

      userEntry = {
        rank: 4,
        name: "Harsha (You)",
        handle: "@harsha",
        avatar: "HA",
        city: "Bengaluru, IN",
        co2Saved: Math.round(effectiveCo2 * 10) / 10,
        itemsCycled: effectiveItems,
        badge: dynamicBadge,
        points: effectivePoints,
        isCurrentUser: true,
      };
    } else if (user) {
      const userHandle = `@${(user.email || "cycler").split("@")[0].toLowerCase()}`;
      const userInitials = (user.name || "You").slice(0, 2).toUpperCase();
      const points = Math.round(liveCo2 * 30 + liveItems * 50);

      const badge =
        liveItems >= 25
          ? "👑 Top Circular Buyer"
          : liveItems >= 15
          ? "👗 Conscious Collector"
          : liveItems > 0
          ? "🌿 Rising Buyer"
          : "🌱 New Cycler";

      userEntry = {
        rank: liveItems > 0 ? Math.max(1, 16 - liveItems) : 0,
        name: user.name ? `${user.name} (You)` : "You",
        handle: userHandle,
        avatar: userInitials,
        city: "Bengaluru, IN",
        co2Saved: Math.round(liveCo2 * 10) / 10,
        itemsCycled: liveItems,
        badge,
        points,
        isCurrentUser: true,
      };
    } else {
      userEntry = {
        rank: 0,
        name: "Guest Cycler",
        handle: "@guest",
        avatar: "GC",
        city: "Global",
        co2Saved: 0,
        itemsCycled: 0,
        badge: "🌱 New Cycler",
        points: 0,
        isCurrentUser: false,
      };
    }

    // Map through the raw list
    let mapped = data.map((u) => {
      if (isDemo && u.handle === "@harsha") {
        return {
          ...u,
          ...userEntry,
        };
      }
      return { ...u, isCurrentUser: false };
    });

    // If non-demo user has active recycled items, ensure they appear in the leaderboard table
    if (!isDemo && user && userEntry.itemsCycled > 0) {
      const existingIdx = mapped.findIndex((u) => u.handle === userEntry.handle);
      if (existingIdx >= 0) {
        mapped[existingIdx] = userEntry;
      } else {
        mapped.push(userEntry);
      }
    }

    // Sort appropriately by points & co2Saved
    mapped.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.co2Saved - a.co2Saved;
    });

    // Re-assign accurate ranks
    mapped = mapped.map((u, i) => ({
      ...u,
      rank: i + 1,
    }));

    // Re-locate user's actual rank if present in sorted list
    const foundUserInList = mapped.find((u) => u.isCurrentUser);
    if (foundUserInList) {
      userEntry = { ...userEntry, rank: foundUserInList.rank };
    }

    return { list: mapped, currentUserData: userEntry };
  }, [data, isDemo, user, impact, orders]);

  const topThree = useMemo(() => list.slice(0, 3), [list]);
  const others = useMemo(() => list.slice(3), [list]);

  return {
    list,
    topThree,
    others,
    currentUserData,
    loading,
    isDemo,
  };
}
