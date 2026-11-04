import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop ensures that navigating between pages always starts
 * from the very top (0, 0) of the page instead of retaining previous scroll depth.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      const scrollTarget = () => {
        try {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            return true;
          }
        } catch {
          // ignore invalid querySelector
        }
        return false;
      };

      if (scrollTarget()) return;
      const hashTimer = setTimeout(scrollTarget, 100);
      return () => clearTimeout(hashTimer);
    }

    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Also reset any scrollable container element
      const allDivs = document.querySelectorAll("main, #root, div, section");
      allDivs.forEach((el) => {
        if (el.scrollTop > 0) {
          el.scrollTop = 0;
        }
      });
    };

    // Synchronously before paint
    resetScroll();

    // Again in the next animation frames to catch any async re-renders or content loads
    const raf1 = requestAnimationFrame(resetScroll);
    const timeout = setTimeout(resetScroll, 20);

    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(timeout);
    };
  }, [pathname, search, hash]);

  return null;
}
