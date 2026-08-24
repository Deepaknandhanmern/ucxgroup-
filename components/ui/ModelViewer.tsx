"use client";

import { useEffect } from "react";

export default function ModelViewer({ src, alt }: { src: string; alt: string }) {
  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  return (
    <model-viewer
      src={src}
      alt={alt}
      camera-controls
      auto-rotate
      auto-rotate-delay={1200}
      shadow-intensity="1"
      exposure="1"
      loading="eager"
      className="ucx-model-viewer"
    />
  );
}
