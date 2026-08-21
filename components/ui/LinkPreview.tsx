"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface LinkPreviewProps {
  href: string;
  image: string;
  children: ReactNode;
  className?: string;
}

export default function LinkPreview({ href, image, children, className }: LinkPreviewProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleEnter() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) setCoords({ top: rect.top, left: rect.left + rect.width / 2 });
    setOpen(true);
  }

  return (
    <>
      <a
        href={href}
        ref={triggerRef}
        className={`ucx-linkpreview-trigger${className ? ` ${className}` : ""}`}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </a>
      {mounted &&
        createPortal(
          <span
            className={`ucx-linkpreview-card${open ? " is-open" : ""}`}
            style={{ top: coords.top, left: coords.left }}
            aria-hidden="true"
          >
            <img src={image} alt="" loading="lazy" />
          </span>,
          document.body
        )}
    </>
  );
}
