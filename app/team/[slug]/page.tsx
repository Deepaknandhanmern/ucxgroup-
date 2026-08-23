import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TEAM, getTeamMember } from "@/lib/team";
import TeamProfile from "@/components/sections/TeamProfile";

export function generateStaticParams() {
  return TEAM.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const member = getTeamMember(slug);
  if (!member) return {};

  return {
    title: member.name,
    description: `${member.role} at UCX. ${member.bio}`,
    openGraph: { title: member.name, description: member.bio, images: [member.image] },
  };
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = getTeamMember(slug);
  if (!member) notFound();

  const others = TEAM.filter((m) => m.slug !== member.slug);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    description: member.bio,
    image: `https://ucx-group.com${member.image}`,
    worksFor: { "@type": "Organization", name: "UCX Group", url: "https://ucx-group.com" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <TeamProfile member={member} others={others} />
    </>
  );
}
