"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const THRESHOLD = 480;

export default function BackToTop() {
  const pathname = usePathname();
  const isInteriors = pathname?.startsWith("/design-interiors") ?? false;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible((window.scrollY || document.documentElement.scrollTop) > THRESHOLD);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`ucx-backtotop${isInteriors ? " ucx-backtotop--interiors" : ""}${visible ? " is-visible" : ""}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
