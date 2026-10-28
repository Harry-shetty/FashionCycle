import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const REVEAL_SELECTOR =
  ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .reveal-up, .rv, .rv-l, .rv-r, .rv-s, [data-reveal]";

/**
 * Universal Scroll Reveal Hook:
 * Attaches high-performance IntersectionObservers to elements across all pages.
 * Handles page transitions, DOM mutations, above-the-fold reveals, and custom staggering.
 */
export function useReveal() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const revealedElements = new WeakSet<Element>();

    const revealElement = (el: Element, delay: number = 0) => {
      if (revealedElements.has(el)) return;
      revealedElements.add(el);

      if (delay > 0) {
        setTimeout(() => {
          el.classList.add("visible", "vis");
        }, delay);
      } else {
        el.classList.add("visible", "vis");
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const explicitDelay =
              Number(el.getAttribute("data-delay") || (el as HTMLElement).dataset.d || 0);
            revealElement(el, explicitDelay);
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    const observeNewElements = () => {
      const elements = document.querySelectorAll(REVEAL_SELECTOR);
      elements.forEach((el, index) => {
        if (revealedElements.has(el) || el.classList.contains("visible") || el.classList.contains("vis")) {
          return;
        }

        // Check if element is already in initial viewport on mount
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInViewport) {
          // Micro-stagger initial viewport elements for a silky entrance
          const initialStagger = Math.min(index * 45, 300);
          revealElement(el, initialStagger);
        } else {
          observer.observe(el);
        }
      });
    };

    // Initial check
    observeNewElements();

    // Re-check shortly after initial render for dynamically loaded data
    const timer = setTimeout(observeNewElements, 120);

    // Watch for DOM mutations (e.g., dynamically fetched listings, profile tabs, filters)
    const mutationObserver = new MutationObserver(() => {
      observeNewElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname, search]);
}

export default useReveal;
