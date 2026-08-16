"use client";

import { useState } from "react";

export default function StudioInterlude() {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="ucx-interlude">
      <div className="interlude-frame">
        {imgOk ? (
          <img src="/brand/about/interlude.jpg" alt="UCX project delivery" onError={() => setImgOk(false)} />
        ) : (
          <div className="interlude-fallback" aria-hidden="true">
            <svg viewBox="0 0 240 120" fill="none" stroke="currentColor" strokeWidth="0.6">
              <path d="M10 108V44l40-24 40 24v64" />
              <path d="M90 108V60l38-22 38 22v48" />
              <path d="M166 108V72l32-18 32 18v36" />
              <path d="M10 108h220" />
            </svg>
          </div>
        )}
      </div>
      <span className="interlude-caption">Coordinated delivery, from design intent to asset handover.</span>
    </div>
  );
}
