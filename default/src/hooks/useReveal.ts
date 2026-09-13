import { useEffect } from "react";

/**
 * Attaches an IntersectionObserver to elements with reveal classes.
 * Adding the "visible" class triggers CSS transitions defined in index.css.
 */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale",
    );
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const delay = Number(e.target.getAttribute("data-delay") || 0);
            setTimeout(() => e.target.classList.add("visible"), delay);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
