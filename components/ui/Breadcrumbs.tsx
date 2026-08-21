export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items, variant = "light" }: { items: Crumb[]; variant?: "light" | "dark" }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://ucx-group.com${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className={`ucx-breadcrumbs ucx-breadcrumbs--${variant}`} aria-label="Breadcrumb">
        <ol>
          {items.map((item, i) => (
            <li key={item.label}>
              {item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}
              {i < items.length - 1 && (
                <span className="ucx-breadcrumbs-sep" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
