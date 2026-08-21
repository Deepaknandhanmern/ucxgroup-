"use client";

import { useEffect } from "react";

const AWAY_TITLE = "👋 Come back!";

export default function TabTitleSwitcher() {
  useEffect(() => {
    let originalTitle = document.title;

    function handleVisibility() {
      if (document.hidden) {
        originalTitle = document.title;
        document.title = AWAY_TITLE;
      } else {
        document.title = originalTitle;
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return null;
}
