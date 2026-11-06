export type Condition = "Like New" | "Excellent" | "Good" | "Fair";

export type Category =
  | "Jackets"
  | "Denim"
  | "Long Coats"
  | "Tees & Tops"
  | "Sweaters"
  | "Outerwear"
  | "Tops & Tees"
  | "Dresses"
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
  views?: number;
  likes?: number;
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
