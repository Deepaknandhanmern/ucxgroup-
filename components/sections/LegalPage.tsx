export interface LegalSection {
  heading: string;
  body: string[];
}

export default function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="ucx-legal">
      <div className="grid-overlay" aria-hidden="true"></div>
      <div className="wrapper">
        <span className="eyebrow">Legal</span>
        <h1>{title}</h1>
        <p className="updated">Last updated: {updated}</p>
        <p className="intro">{intro}</p>

        {sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
