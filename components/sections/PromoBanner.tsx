export default function PromoBanner({
  src,
  alt,
  href,
  fullWidth,
}: {
  src: string;
  alt: string;
  href: string;
  /** Break out to the full viewport width instead of staying inside the section's contained width. */
  fullWidth?: boolean;
}) {
  return (
    <a className={`ucx-promo-banner${fullWidth ? " ucx-promo-banner--full" : ""}`} href={href}>
      <img src={src} alt={alt} loading="lazy" />
    </a>
  );
}
