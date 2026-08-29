export default function PromoBanner({
  src,
  alt,
  href,
  ctaLabel,
  fullWidth,
}: {
  src: string;
  alt: string;
  href: string;
  /** Shown as a real button in the bottom-right corner, over the banner artwork. */
  ctaLabel?: string;
  /** Break out to the full viewport width instead of staying inside the section's contained width. */
  fullWidth?: boolean;
}) {
  return (
    <a className={`ucx-promo-banner${fullWidth ? " ucx-promo-banner--full" : ""}`} href={href}>
      <img src={src} alt={alt} loading="lazy" />
      {ctaLabel && (
        <span className="ucx-promo-banner-cta">
          {ctaLabel}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </span>
      )}
    </a>
  );
}
