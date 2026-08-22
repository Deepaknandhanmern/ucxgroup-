"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const WHATSAPP_URL = "https://wa.me/918825827224";

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [isInteriorsFilter, setIsInteriorsFilter] = useState(false);

  useEffect(() => {
    setIsInteriorsFilter(
      pathname === "/projects" && new URLSearchParams(window.location.search).get("filter") === "interiors"
    );
  }, [pathname]);

  const isInteriors = (pathname?.startsWith("/design-interiors") ?? false) || isInteriorsFilter;

  if (!isInteriors) return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="ucx-whatsapp"
    >
      <span className="ucx-whatsapp-ring" aria-hidden="true"></span>
      <span className="ucx-whatsapp-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.13c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.13.11-1.82-.11a13.4 13.4 0 0 1-2.02-.75 11.3 11.3 0 0 1-4.35-3.85 5.02 5.02 0 0 1-1.05-2.7c0-.85.45-1.27.61-1.44.16-.17.35-.21.47-.21h.34c.11 0 .26-.02.4.3.16.36.53 1.24.58 1.33.05.09.08.2.02.32-.06.12-.09.2-.18.31l-.28.32c-.09.1-.19.2-.08.4.11.2.5.85 1.08 1.38.75.69 1.38.9 1.58 1 .2.1.32.09.44-.05.13-.14.52-.6.66-.8.14-.2.28-.17.47-.1.19.07 1.24.59 1.45.69.21.1.35.16.4.24.05.09.05.5-.19 1.17Z" />
        </svg>
      </span>
      <span className="ucx-whatsapp-label">Chat with us</span>
    </a>
  );
}
