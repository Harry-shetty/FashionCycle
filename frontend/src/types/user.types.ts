export type UserRole = "buyer" | "seller";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  /** ISO date string */
  createdAt: string;
  /** Total items sold */
  itemsSold: number;
  /** kg CO₂ saved through circular fashion */
  co2Saved: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

