import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import * as authService from "../services/auth.service";
import type {
  LoginPayload,
  RegisterPayload,
  User,
} from "../types/user.types";

// ── Context shape ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on first load
  useEffect(() => {
    const storedToken = localStorage.getItem("fc_token");
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    authService
      .getMe()
      .then((u) => {
        setUser(u);
        setToken(storedToken);
      })
      .catch(() => {
        localStorage.removeItem("fc_token");
        localStorage.removeItem("fc_user");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const persist = (u: User, t: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem("fc_token", t);
    localStorage.setItem("fc_user", JSON.stringify(u));
  };

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await authService.login(payload);
    persist(res.user, res.token);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await authService.register(payload);
    persist(res.user, res.token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("fc_token");
    localStorage.removeItem("fc_user");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
