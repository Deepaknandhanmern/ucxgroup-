"use client";

import { useEffect, useState } from "react";

const LOADING_STATES = ["Loading...", "Fetching Data..", "Syncing...", "Processing..", "Optimizing..."];

function CoreSpinLoader() {
  const [loadingText, setLoadingText] = useState("Initializing");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_STATES.length;
      setLoadingText(LOADING_STATES[i]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pl-loader">
      <div className="pl-spinner">
        <div className="pl-ring pl-ring-glow" />
        <div className="pl-ring pl-ring-dashed" />
        <div className="pl-ring pl-ring-arc" />
        <div className="pl-ring pl-ring-arc-rev" />
        <div className="pl-ring pl-ring-fast" />
        <div className="pl-orbit">
          <span className="pl-orbit-dot" />
        </div>
        <span className="pl-core" />
      </div>
      <span className="pl-label" key={loadingText}>
        {loadingText}
      </span>
    </div>
  );
}

export default function Preloader() {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("ucx-intro-seen")) {
      return;
    }

    document.body.style.overflow = "hidden";
    const leaveTimer = setTimeout(() => {
      setLeaving(true);
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem("ucx-intro-seen", "1");
      } catch {
        /* sessionStorage unavailable — intro will just replay next load */
      }
    }, 2300);

    return () => {
      clearTimeout(leaveTimer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className={`ucx-preloader${leaving ? " is-leaving" : ""}`} aria-hidden="true">
      <CoreSpinLoader />
    </div>
  );
}
