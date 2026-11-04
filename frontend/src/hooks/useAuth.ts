import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

/** Shorthand hook — use this everywhere instead of importing AuthContext directly. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
