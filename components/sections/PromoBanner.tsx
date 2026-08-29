export default function PromoBanner({
  src,
  alt,
  href,
}: {
  src: string;
  alt: string;
  href: string;
}) {
  return (
    <a className="ucx-promo-banner" href={href}>
      <img src={src} alt={alt} loading="lazy" />
    </a>
  );
}
