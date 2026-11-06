import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut 
} from "firebase/auth";
import { auth } from "../services/firebase";
import { apiRequest } from "../services/api";
import type { LoginPayload, RegisterPayload, User, UserRole } from "../types/user.types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthReady: boolean;
  role: UserRole;
  isSeller: boolean;
  isBuyer: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  loginAsDemo: (name?: string, role?: UserRole) => void;
  switchRole: (newRole: UserRole) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const MOCK_BUYER_USER: User = {
  id: "usr-buyer-01",
  name: "Sophia Laurent",
  email: "sophia@fashioncycle.eco",
  role: "buyer",
  avatar: undefined,
  createdAt: "2024-03-15T00:00:00Z",
  itemsSold: 0,
  co2Saved: 38.6,
};

const MOCK_SELLER_USER: User = {
  id: "usr-seller-admin",
  name: "Admin Seller Studio",
  email: "admin@gmail.com",
  role: "seller",
  avatar: undefined,
  createdAt: "2024-02-10T00:00:00Z",
  itemsSold: 18,
  co2Saved: 74.2,
};

const PRESET_BUYER: User = {
  id: "usr-buyer-harsha",
  name: "Harsha (Buyer)",
  email: "harsha@gmail.com",
  role: "buyer",
  avatar: undefined,
  createdAt: new Date().toISOString(),
  itemsSold: 0,
  co2Saved: 48.4,
};

const PRESET_SELLER: User = {
  id: "usr-seller-admin",
  name: "Admin Seller Studio",
  email: "admin@gmail.com",
  role: "seller",
  avatar: undefined,
  createdAt: new Date().toISOString(),
  itemsSold: 18,
  co2Saved: 74.2,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      // Require an active session in sessionStorage so fresh opens of the website always ask to sign in
      const isSessionActive = sessionStorage.getItem("fc_session_active") === "true";
      if (!isSessionActive) {
        return null;
      }
      const saved = localStorage.getItem("fc_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.role) parsed.role = "buyer";
        if (!parsed.name) parsed.name = parsed.email ? parsed.email.split("@")[0] : "User";
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    const isSessionActive = sessionStorage.getItem("fc_session_active") === "true";
    if (!isSessionActive) {
      return null;
    }
    return localStorage.getItem("fc_token") || null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const isSessionActive = sessionStorage.getItem("fc_session_active") === "true";
    if (!isSessionActive) {
      // Fresh open of website: ensure we start signed out
      localStorage.removeItem("fc_user");
      localStorage.removeItem("fc_token");
      signOut(auth).catch(() => {});
      setUser(null);
      setToken(null);
      setIsAuthReady(true);
      return;
    }

    // Safety timer: ensure isAuthReady becomes true even if Firebase Auth network hangs
    const safetyTimer = setTimeout(() => {
      setIsAuthReady(true);
    }, 1200);

    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        clearTimeout(safetyTimer);
        const stillSessionActive = sessionStorage.getItem("fc_session_active") === "true";
        if (!stillSessionActive) {
          setUser(null);
          setToken(null);
          setIsAuthReady(true);
          return;
        }

        if (firebaseUser) {
          try {
            const idToken = await firebaseUser.getIdToken();
            setToken(idToken);
            localStorage.setItem("fc_token", idToken);

            const normalizedEmail = (firebaseUser.email || "").toLowerCase();
            const isSellerAccount = normalizedEmail === "admin@gmail.com";

            const savedRole = (localStorage.getItem(`fc_role_${firebaseUser.uid}`) ||
              localStorage.getItem(`fc_role_${normalizedEmail}`)) as UserRole | null;
            const role: UserRole = isSellerAccount ? "seller" : (savedRole || "buyer");

            const userName = isSellerAccount
              ? "Admin Seller Studio"
              : (firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split("@")[0] : "User"));

            const loggedInUser: User = {
              id: firebaseUser.uid,
              name: userName,
              email: firebaseUser.email || "",
              avatar: firebaseUser.photoURL || undefined,
              role,
              createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString(),
              itemsSold: isSellerAccount ? 18 : 0,
              co2Saved: isSellerAccount ? 74.2 : 38.6,
            };

            setUser(loggedInUser);
            localStorage.setItem("fc_user", JSON.stringify(loggedInUser));
          } catch (error) {
            console.warn("Firebase auth token error:", error);
          }
        } else {
          // If no Firebase user, clear user state unless a valid local session exists
          const currentToken = localStorage.getItem("fc_token");
          if (!currentToken) {
            setUser(null);
          }
        }
        setIsAuthReady(true);
      });
      return () => {
        clearTimeout(safetyTimer);
        unsubscribe();
      };
    } catch (e) {
      clearTimeout(safetyTimer);
      console.warn("Firebase listener initialization error:", e);
      setIsAuthReady(true);
    }
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    const email = payload.email.trim();
    const normalizedEmail = email.toLowerCase();
    const isSellerAccount = normalizedEmail === "admin@gmail.com";
    const isPresetBuyer = normalizedEmail === "harsha@gmail.com" && payload.password === "iambatman";
    const isPresetSeller = isSellerAccount && payload.password === "123456789";

    try {
      let firebaseUser: any = null;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, payload.password);
        firebaseUser = userCredential.user;
      } catch (authError: any) {
        // 1. If preset account needs first-time creation in Firebase Auth
        if (
          (isPresetSeller || isPresetBuyer) &&
          (authError?.code === "auth/user-not-found" ||
            authError?.code === "auth/invalid-credential" ||
            authError?.code === "auth/invalid-login-credentials")
        ) {
          try {
            const createdCred = await createUserWithEmailAndPassword(auth, email, payload.password);
            firebaseUser = createdCred.user;
            await updateProfile(firebaseUser, {
              displayName: isPresetSeller ? "Admin Seller Studio" : "Harsha (Buyer)",
            });
          } catch {
            // If creation fails due to network or existing account, use preset object fallback below
          }
        }

        // 2. If preset account experiences network/CORS or block error, gracefully log in directly
        if (!firebaseUser && (isPresetBuyer || isPresetSeller)) {
          const directUser = isPresetSeller ? PRESET_SELLER : PRESET_BUYER;
          const directToken = "fc-direct-session-" + Date.now();
          setUser(directUser);
          setToken(directToken);
          localStorage.setItem("fc_user", JSON.stringify(directUser));
          localStorage.setItem("fc_token", directToken);
          return;
        }

        if (!firebaseUser) {
          throw authError;
        }
      }

      // Successful Firebase Auth authentication
      const idToken = await firebaseUser.getIdToken();
      setToken(idToken);
      localStorage.setItem("fc_token", idToken);

      const savedRole = (localStorage.getItem(`fc_role_${firebaseUser.uid}`) ||
        localStorage.getItem(`fc_role_${normalizedEmail}`)) as UserRole | null;
      const role: UserRole = isSellerAccount ? "seller" : (savedRole || "buyer");
      localStorage.setItem(`fc_role_${firebaseUser.uid}`, role);
      localStorage.setItem(`fc_role_${normalizedEmail}`, role);

      const userName = isSellerAccount
        ? "Admin Seller Studio"
        : (firebaseUser.displayName || (email ? email.split("@")[0] : "User"));

      const loggedInUser: User = {
        id: firebaseUser.uid,
        name: userName,
        email: firebaseUser.email || email,
        avatar: firebaseUser.photoURL || undefined,
        role,
        createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString(),
        itemsSold: isSellerAccount ? 18 : 0,
        co2Saved: isSellerAccount ? 74.2 : 48.4,
      };

      sessionStorage.setItem("fc_session_active", "true");
      setUser(loggedInUser);
      localStorage.setItem("fc_user", JSON.stringify(loggedInUser));
    } catch (error: any) {
      console.error("Firebase authentication error:", error);
      let userFriendlyMessage = error?.message || "Invalid email or password. Please check your credentials.";
      if (error?.code === "auth/user-not-found") {
        userFriendlyMessage = "No account found with this email. Please register first or use 1-Click Demo Login.";
      } else if (
        error?.code === "auth/wrong-password" ||
        error?.code === "auth/invalid-credential" ||
        error?.code === "auth/invalid-login-credentials"
      ) {
        userFriendlyMessage = "Incorrect password or credentials. Please try again.";
      } else if (error?.code === "auth/invalid-email") {
        userFriendlyMessage = "Please enter a valid email address.";
      } else if (error?.code === "auth/too-many-requests") {
        userFriendlyMessage = "Access temporarily disabled due to many failed attempts. Try again later.";
      } else if (error?.code === "auth/network-request-failed") {
        userFriendlyMessage = "Network error connecting to Firebase. Please check your connection or use 1-Click Demo Login.";
      }
      throw new Error(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    const chosenRole: UserRole = payload.role || "buyer";
    const email = payload.email.trim();
    const normalizedEmail = email.toLowerCase();
    const isSellerAccount = normalizedEmail === "admin@gmail.com" || chosenRole === "seller";

    try {
      let firebaseUser: any = null;

      try {
        // 1. Create the user directly in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, payload.password);
        firebaseUser = userCredential.user;

        // Save display name in Firebase Auth profile
        await updateProfile(firebaseUser, {
          displayName: payload.name.trim(),
        });
      } catch (authErr: any) {
        // If email is already in Firebase Auth, check if credentials match and sign in seamlessly
        if (authErr?.code === "auth/email-already-in-use") {
          try {
            const loginCred = await signInWithEmailAndPassword(auth, email, payload.password);
            firebaseUser = loginCred.user;
            if (payload.name.trim() && !firebaseUser.displayName) {
              await updateProfile(firebaseUser, { displayName: payload.name.trim() });
            }
          } catch {
            throw new Error("This email is already registered in Firebase. Please sign in with your password or use another email.");
          }
        } else {
          throw authErr;
        }
      }

      // 2. Fetch Firebase ID Token for authenticated requests
      const idToken = await firebaseUser.getIdToken();
      setToken(idToken);
      localStorage.setItem("fc_token", idToken);
      localStorage.setItem(`fc_role_${firebaseUser.uid}`, chosenRole);
      localStorage.setItem(`fc_role_${normalizedEmail}`, chosenRole);

      const registeredUser: User = {
        id: firebaseUser.uid,
        name: payload.name.trim() || firebaseUser.displayName || (email.split("@")[0]),
        email,
        role: chosenRole,
        createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString(),
        itemsSold: chosenRole === "seller" ? 2 : 0,
        co2Saved: 0,
      };

      sessionStorage.setItem("fc_session_active", "true");
      setUser(registeredUser);
      localStorage.setItem("fc_user", JSON.stringify(registeredUser));

      // 3. Automatically sync the user profile into MongoDB Atlas
      try {
        const endpoint = chosenRole === "seller" ? "/seller/profile" : "/buyer/profile";
        const body = chosenRole === "seller"
          ? {
              sellerId: firebaseUser.uid,
              name: payload.name.trim(),
              email,
              handle: `@${payload.name.toLowerCase().replace(/\s+/g, "")}`,
              storeName: `${payload.name.trim()}'s Circular Studio`,
            }
          : {
              buyerId: firebaseUser.uid,
              name: payload.name.trim(),
              email,
              handle: `@${payload.name.toLowerCase().replace(/\s+/g, "")}`,
            };

        await apiRequest(endpoint, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } catch (dbErr) {
        console.warn("MongoDB profile sync notice:", dbErr);
      }
    } catch (error: any) {
      console.error("Firebase registration error:", error);
      let userFriendlyMessage = error?.message || "Registration failed";
      if (error?.code === "auth/email-already-in-use") {
        userFriendlyMessage = "This email is already registered in Firebase. Please sign in instead.";
      } else if (error?.code === "auth/weak-password") {
        userFriendlyMessage = "Password is too weak. Please use at least 6 characters.";
      } else if (error?.code === "auth/invalid-email") {
        userFriendlyMessage = "Please enter a valid email address.";
      } else if (error?.code === "auth/network-request-failed") {
        userFriendlyMessage = "Network error connecting to Firebase. Please check your internet connection.";
      }
      throw new Error(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAsDemo = useCallback((name?: string, demoRole: UserRole = "buyer") => {
    sessionStorage.setItem("fc_session_active", "true");
    const base = demoRole === "seller" ? MOCK_SELLER_USER : MOCK_BUYER_USER;
    const demoUser: User = {
      ...base,
      name: name || base.name,
      role: demoRole,
    };
    setUser(demoUser);
    setToken("mock-jwt-token-active");
    localStorage.setItem("fc_user", JSON.stringify(demoUser));
    localStorage.setItem("fc_token", "mock-jwt-token-active");
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    setUser((prev) => {
      if (!prev) {
        const fallback = newRole === "seller" ? MOCK_SELLER_USER : MOCK_BUYER_USER;
        localStorage.setItem("fc_user", JSON.stringify(fallback));
        return fallback;
      }
      const updated: User = { ...prev, role: newRole };
      localStorage.setItem("fc_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const logout = useCallback(async () => {
    // 1. Immediately and synchronously clear local authentication state
    sessionStorage.removeItem("fc_session_active");
    setUser(null);
    setToken(null);
    localStorage.removeItem("fc_user");
    localStorage.removeItem("fc_token");
    localStorage.removeItem("fc_following_sellers");

    // 2. Perform Firebase Auth signOut
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase signOut error:", e);
    }
  }, []);

  const currentRole: UserRole = user?.role || "buyer";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isAuthReady,
        role: currentRole,
        isSeller: currentRole === "seller",
        isBuyer: currentRole === "buyer",
        login,
        register,
        loginAsDemo,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
