/**
 * Listings service connected to MongoDB backend
 */
import type { CreateListingPayload, Listing } from "../types/listing.types";
import { apiRequest } from "./api";

/** Fetch all listings (optionally filter by category) */
export async function getListings(category?: string): Promise<Listing[]> {
  const query = category && category !== "All" ? `?category=${encodeURIComponent(category)}` : "";
  return apiRequest<Listing[]>(`/listings${query}`);
}

/** Fetch a single listing by ID */
export async function getListing(id: string): Promise<Listing> {
  return apiRequest<Listing>(`/listings/${id}`);
}

/** Create a new listing */
export async function createListing(payload: CreateListingPayload): Promise<Listing> {
  return apiRequest<Listing>("/listings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Update a listing */
export async function updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
  return apiRequest<Listing>(`/listings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

/** Delete a listing */
export async function deleteListingApi(id: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/listings/${id}`, {
    method: "DELETE",
  });
}
