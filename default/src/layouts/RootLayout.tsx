import { Outlet } from "react-router-dom";
import Marquee from "../components/layout/Marquee";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { BANNER_HEIGHT, NAVBAR_HEIGHT } from "../utils/layoutConstants";

/**
 * Root layout — wraps every public page.
 * Marquee is pinned at top (z-index 200), Navbar sits below it (z-index 100).
 * Page content is offset by both fixed bars via paddingTop on the main element.
 */
export default function RootLayout() {
  return (
    <>
      <Marquee />
      <Navbar />
      <main style={{ paddingTop: BANNER_HEIGHT + NAVBAR_HEIGHT }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
