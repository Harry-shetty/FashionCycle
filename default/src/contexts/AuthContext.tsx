import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut 
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { LoginPayload, RegisterPayload, User } from "../types/user.types";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          setToken(idToken);
          
          // Fetch extra user details from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          let itemsSold = 0;
          let co2Saved = 0;
          let createdAt = new Date().toISOString();
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            itemsSold = data.itemsSold || 0;
            co2Saved = data.co2Saved || 0;
            createdAt = data.createdAt || createdAt;
          }
          
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "User",
            email: firebaseUser.email || "",
            avatar: firebaseUser.photoURL || undefined,
            createdAt,
            itemsSold,
            co2Saved
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    await signInWithEmailAndPassword(auth, payload.email, payload.password);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const userCredential = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
    
    await updateProfile(userCredential.user, {
      displayName: payload.name
    });
    
    // Save additional fields to Firestore
    const createdAt = new Date().toISOString();
    await setDoc(doc(db, "users", userCredential.user.uid), {
      name: payload.name,
      email: payload.email,
      createdAt,
      itemsSold: 0,
      co2Saved: 0
    });
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
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
