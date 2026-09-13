/**
 * Auth service
 *
 * Currently uses a localStorage mock so the frontend works without a backend.
 * When your Express + MongoDB API is ready, replace the stub implementations
 * with real `apiRequest()` calls — the AuthContext and UI need zero changes.
 *
 * Example real implementation:
 *   export async function login(payload: LoginPayload): Promise<AuthResponse> {
 *     return apiRequest<AuthResponse>("/auth/login", {
 *       method: "POST",
 *       body: JSON.stringify(payload),
 *     });
 *   }
 */

import type { AuthResponse, LoginPayload, RegisterPayload, User } from "../types/user.types";

const MOCK_USER: User = {
  id: "mock-001",
  name: "Demo User",
  email: "demo@fashioncycle.com",
  createdAt: new Date().toISOString(),
  itemsSold: 7,
  co2Saved: 12.4,
};

const MOCK_TOKEN = "mock-jwt-token-replace-with-real";

/** Sign in with email + password */
export async function login(_payload: LoginPayload): Promise<AuthResponse> {
  // TODO: replace with real API call
  // return apiRequest<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(_payload) });
  await delay(600);
  if (_payload.password.length < 6) throw new Error("Invalid credentials");
  return { user: { ...MOCK_USER, email: _payload.email }, token: MOCK_TOKEN };
}

/** Create a new account */
export async function register(_payload: RegisterPayload): Promise<AuthResponse> {
  // TODO: replace with real API call
  // return apiRequest<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(_payload) });
  await delay(700);
  return {
    user: { ...MOCK_USER, name: _payload.name, email: _payload.email },
    token: MOCK_TOKEN,
  };
}

/** Fetch the currently authenticated user (used on page refresh) */
export async function getMe(): Promise<User> {
  // TODO: replace with real API call
  // return apiRequest<User>("/auth/me");
  await delay(300);
  const raw = localStorage.getItem("fc_user");
  if (!raw) throw new Error("Not authenticated");
  return JSON.parse(raw) as User;
}

// ── helpers ──────────────────────────────────────────────────────────────────
function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
