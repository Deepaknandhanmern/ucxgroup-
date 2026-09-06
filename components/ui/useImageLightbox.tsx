"use client";

import { useCallback, useState } from "react";
import ImageLightbox, { type LightboxImage } from "@/components/ui/ImageLightbox";

/**
 * Gives a section an `open(src, alt)` it can call from a tap handler, plus the
 * element to render. Opening is a no-op unless the device has a coarse
 * pointer, so desktop keeps its normal card click-through to the project page
 * and only touch visitors — who can actually pinch — get the viewer.
 */
export function useImageLightbox() {
  const [image, setImage] = useState<LightboxImage | null>(null);

  const open = useCallback((src: string, alt: string) => {
    if (typeof window === "undefined") return false;
    if (!window.matchMedia("(pointer: coarse)").matches) return false;
    setImage({ src, alt });
    return true;
  }, []);

  const close = useCallback(() => setImage(null), []);

  const lightbox = image ? <ImageLightbox image={image} onClose={close} /> : null;

  return { open, close, lightbox };
}
