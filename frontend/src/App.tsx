import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { StoreProvider } from "./contexts/StoreContext";
import { router } from "./router";

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </AuthProvider>
  );
}
