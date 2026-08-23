"use client";

import { useState } from "react";
import { TEAM, type TeamMember } from "@/lib/team";

function TeamCardPhoto({ src, alt, initials }: { src: string; alt: string; initials: string }) {
  const [ok, setOk] = useState(true);
  if (ok) {
    return <img src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />;
  }
  return <span className="team-card-mark">{initials}</span>;
}

export default function TeamHub() {
  return (
    <div className="ucx-team-hub">
      <div className="team-hub-hero">
        <div className="grid-overlay"></div>
        <div className="team-hub-hero-inner">
          <span className="eyebrow">Company · Team</span>
          <h1 className="heading">Meet the UCX Team</h1>
          <p className="intro">
            The people behind UCX &mdash; complementary expertise across architecture, BIM, interiors, technology
            and business, united by a shared ambition to build something different.
          </p>
        </div>
      </div>

      <div className="wrapper">
        <div className="team-hub-grid">
          {TEAM.map((m: TeamMember) => (
            <a className="team-hub-card" href={`/team/${m.slug}`} key={m.slug}>
              <div className="team-hub-card-photo">
                <TeamCardPhoto src={m.image} alt={m.name} initials={m.initials} />
              </div>
              <h3>{m.name}</h3>
              <span className="role">{m.role}</span>
              <p className="bio-snip">{m.bio}</p>
              <span className="view-link">
                View Profile
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
