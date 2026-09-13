export type Condition = "Like New" | "Excellent" | "Good" | "Fair";

export type Category =
  | "Tops & Tees"
  | "Outerwear"
  | "Dresses"
  | "Denim"
  | "Shoes"
  | "Accessories";

export interface Listing {
  id: string;
  title: string;
  brand: string;
  size: string;
  condition: Condition;
  category: Category;
  price: number;
  images: string[];
  description?: string;
  sellerId: string;
  /** ISO date string */
  createdAt: string;
  sold: boolean;
}

export interface CreateListingPayload {
  title: string;
  brand: string;
  size: string;
  condition: Condition;
  category: Category;
  price: number;
  images: string[];
  description?: string;
}
