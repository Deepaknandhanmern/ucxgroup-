"use client";

import { useState } from "react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import type { TeamMember } from "@/lib/team";

function ProfilePhoto({ src, alt, initials }: { src: string; alt: string; initials: string }) {
  const [ok, setOk] = useState(true);
  if (ok) {
    return <img src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />;
  }
  return <span className="profile-photo-mark">{initials}</span>;
}

export default function TeamProfile({ member, others }: { member: TeamMember; others: TeamMember[] }) {
  const firstName = member.name.split(" ")[0];

  return (
    <div className="ucx-team-profile">
      <div className="profile-hero">
        <div className="grid-overlay"></div>
        <div className="profile-hero-inner">
          <Breadcrumbs
            variant="dark"
            items={[{ label: "Home", href: "/" }, { label: "Team", href: "/team" }, { label: member.name }]}
          />

          <div className="profile-grid">
            <div className="profile-photo">
              <ProfilePhoto src={member.image} alt={member.name} initials={member.initials} />
            </div>
            <div className="profile-copy">
              <span className="eyebrow">{member.role}</span>
              <h1 className="heading">{member.name}</h1>
              <p className="intro">{member.longBio ?? member.bio}</p>

              <div className="profile-focus">
                {member.focus.map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </div>

              <div className="profile-actions">
                <a className="profile-cta" href="/contact">
                  Get in Touch
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </a>
                {member.linkedin && (
                  <a className="profile-cta profile-cta--ghost" href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                )}
                {member.email && (
                  <a className="profile-cta profile-cta--ghost" href={`mailto:${member.email}`}>
                    Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <div className="wrapper">
          <div className="other-team">
            <span className="sub-eyebrow">Meet the Rest of the Team</span>
            <div className="other-grid">
              {others.map((o) => (
                <a className="other-card" href={`/team/${o.slug}`} key={o.slug}>
                  <ProfilePhoto src={o.image} alt={o.name} initials={o.initials} />
                  <span className="other-name">{o.name}</span>
                  <span className="other-role">{o.role}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="profile-closing">
            <p>Want to work with {firstName}?</p>
            <a className="closing-cta" href="/contact">
              Start a Conversation
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
