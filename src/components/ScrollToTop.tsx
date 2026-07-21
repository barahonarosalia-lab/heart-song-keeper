import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      // Try immediately, then retry a few times in case the target mounts later.
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        if (attempts++ < 10) {
          setTimeout(tryScroll, 60);
        }
      };
      tryScroll();
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
