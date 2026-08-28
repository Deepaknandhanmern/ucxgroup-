const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

export default function PromoBanner({
  eyebrow,
  headline,
  ctaLabel,
  ctaHref,
}: {
  eyebrow: string;
  headline: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="ucx-promo-banner">
      <video src={VIDEO_URL} autoPlay loop muted playsInline />
      <div className="promo-content">
        <div className="promo-text promo-glass">
          <span className="promo-eyebrow">{eyebrow}</span>
          <p className="promo-headline">{headline}</p>
        </div>
        <a className="promo-cta promo-glass" href={ctaHref}>
          {ctaLabel}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
