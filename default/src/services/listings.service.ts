/**
 * Listings service
 *
 * Currently returns hardcoded mock data.
 * Replace with real `apiRequest()` calls when the MongoDB backend is ready.
 */

import type { CreateListingPayload, Listing } from "../types/listing.types";
// import { apiRequest } from "./api";

const MOCK_LISTINGS: Listing[] = [
  {
    id: "lst-001",
    title: "Vintage Blazer",
    brand: "Ralph Lauren",
    size: "L",
    condition: "Excellent",
    category: "Outerwear",
    price: 85,
    images: ["https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=600&h=800&fit=crop&auto=format"],
    sellerId: "mock-001",
    createdAt: new Date().toISOString(),
    sold: false,
  },
  {
    id: "lst-002",
    title: "Silk Wrap Dress",
    brand: "Zara",
    size: "M",
    condition: "Good",
    category: "Dresses",
    price: 42,
    images: ["https://images.unsplash.com/photo-1664076458686-3449062080ac?w=600&h=800&fit=crop&auto=format"],
    sellerId: "mock-002",
    createdAt: new Date().toISOString(),
    sold: false,
  },
  {
    id: "lst-003",
    title: "Linen Co-ord Set",
    brand: "& Other Stories",
    size: "S",
    condition: "Like New",
    category: "Tops & Tees",
    price: 68,
    images: ["https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?w=600&h=800&fit=crop&auto=format"],
    sellerId: "mock-003",
    createdAt: new Date().toISOString(),
    sold: false,
  },
  {
    id: "lst-004",
    title: "Wool Overcoat",
    brand: "Massimo Dutti",
    size: "M",
    condition: "Good",
    category: "Outerwear",
    price: 110,
    images: ["https://images.unsplash.com/photo-1659522761084-79196b64abe4?w=600&h=800&fit=crop&auto=format"],
    sellerId: "mock-004",
    createdAt: new Date().toISOString(),
    sold: false,
  },
];

/** Fetch all listings (optionally filter by category) */
export async function getListings(category?: string): Promise<Listing[]> {
  // TODO: return apiRequest<Listing[]>(`/listings${category ? `?category=${category}` : ""}`);
  await delay(300);
  if (category) return MOCK_LISTINGS.filter((l) => l.category === category);
  return MOCK_LISTINGS;
}

/** Fetch a single listing by ID */
export async function getListing(id: string): Promise<Listing> {
  // TODO: return apiRequest<Listing>(`/listings/${id}`);
  await delay(200);
  const found = MOCK_LISTINGS.find((l) => l.id === id);
  if (!found) throw new Error("Listing not found");
  return found;
}

/** Create a new listing (requires auth) */
export async function createListing(_payload: CreateListingPayload): Promise<Listing> {
  // TODO: return apiRequest<Listing>("/listings", { method: "POST", body: JSON.stringify(_payload) });
  await delay(500);
  return {
    ..._payload,
    id: `lst-${Date.now()}`,
    sellerId: "mock-001",
    createdAt: new Date().toISOString(),
    sold: false,
  };
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
