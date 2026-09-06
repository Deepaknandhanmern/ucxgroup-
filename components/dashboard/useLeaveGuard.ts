"use client";

import { useEffect, useRef, useState } from "react";

// Shared by every dashboard editor that can lose unsaved work: warns on tab
// close/refresh (native beforeunload prompt) and intercepts in-app
// navigation (any <a href> click — nav links, breadcrumbs, next/link
// anywhere on the page) so the caller can show its own "unsaved changes"
// card instead of silently discarding. Doesn't handle same-page state
// resets (e.g. a "Cancel" button that just clears local state) — callers
// check `isDirty` themselves for those.
export function useLeaveGuard(isDirty: boolean) {
  const isDirtyRef = useRef(isDirty);
  useEffect(() => {
    isDirtyRef.current = isDirty;
  });

  const [leaveTarget, setLeaveTarget] = useState<string | null>(null);

  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (!isDirtyRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  useEffect(() => {
    function onDocumentClick(e: MouseEvent) {
      if (!isDirtyRef.current) return;
      const anchor = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (!href.startsWith("/")) return; // let external links, mailto:, etc. through
      e.preventDefault();
      e.stopPropagation();
      setLeaveTarget(href);
    }
    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, []);

  return { leaveTarget, setLeaveTarget };
}
