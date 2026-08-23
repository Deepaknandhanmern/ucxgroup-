export interface TeamMember {
  slug: string;
  index: string;
  initials: string;
  name: string;
  role: string;
  bio: string;
  /** Longer-form bio for the individual profile page — falls back to `bio` when omitted. */
  longBio?: string;
  focus: string[];
  image: string;
  /** Optional — omit until a real profile URL exists rather than guessing one. */
  linkedin?: string;
  email?: string;
}

export const TEAM: TeamMember[] = [
  {
    slug: "shangeeth-raju",
    index: "01",
    initials: "SR",
    name: "Shangeeth Raju",
    role: "Co-Founder | BIM & Digital Delivery",
    bio: "Leads UCX's BIM, digital delivery and technology strategy, with a focus on coordinated project workflows and scalable digital delivery.",
    focus: ["BIM", "Digital Delivery", "Technology", "Project Strategy"],
    image: "/brand/founders/shangeeth-raju.png",
  },
  {
    slug: "bhuvaneshwari",
    index: "02",
    initials: "BH",
    name: "Bhuvaneshwari",
    role: "Co-Founder | Interiors & Business",
    bio: "Leads UCX's interiors and business development direction, connecting design capability with client requirements and commercial growth.",
    focus: ["Interiors", "Business Development", "Client Strategy", "Growth"],
    image: "/brand/founders/bhuvaneshwari.png",
  },
];

export function getTeamMember(slug: string): TeamMember | undefined {
  return TEAM.find((m) => m.slug === slug);
}
