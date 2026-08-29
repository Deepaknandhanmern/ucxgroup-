"use client";

import { useCursorGlow } from "@/components/ui/useCursorGlow";

export default function Maintenance() {
  const glowRef = useCursorGlow<HTMLDivElement>();

  return (
    <div className="ucx-maintenance" ref={glowRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>
      <div className="wrapper">
        <span className="mark">UCX</span>
        <h1>We&apos;ll Be Right Back.</h1>
        <p>
          UCX is undergoing scheduled maintenance. We&apos;re working to get everything back online as quickly as
          possible.
        </p>
        <a href="mailto:collaborate@ucx-group.com">collaborate@ucx-group.com</a>
      </div>
    </div>
  );
}
