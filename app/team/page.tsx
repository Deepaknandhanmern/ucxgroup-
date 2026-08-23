import type { Metadata } from "next";
import TeamHub from "@/components/sections/TeamHub";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the people behind UCX — complementary expertise across architecture, BIM, interiors, technology and business.",
};

export default function TeamPage() {
  return <TeamHub />;
}
