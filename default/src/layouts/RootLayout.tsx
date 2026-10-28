import { Outlet } from "react-router-dom";
import Marquee from "../components/layout/Marquee";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import GlobalModals from "../components/shared/GlobalModals";
import ToastContainer from "../components/shared/ToastContainer";
import ScrollToTop from "../components/shared/ScrollToTop";
import ScrollProgress from "../components/layout/ScrollProgress";
import FashionChatbot from "../components/shared/FashionChatbot";
import { useReveal } from "../hooks/useReveal";
import { useAuth } from "../hooks/useAuth";
import { BANNER_HEIGHT, NAVBAR_HEIGHT } from "../utils/layoutConstants";

/**
 * Root layout — wraps every public page.
 * Marquee is pinned at top, Navbar sits below it, Footer at bottom.
 */
export default function RootLayout() {
  useReveal();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <ScrollToTop />
      <ScrollProgress />
      <Marquee />
      <Navbar />
      <main
        style={{
          paddingTop: BANNER_HEIGHT + NAVBAR_HEIGHT,
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </main>
      <Footer />
      <GlobalModals />
      <ToastContainer />
      {isAuthenticated && <FashionChatbot />}
    </>
  );
}
