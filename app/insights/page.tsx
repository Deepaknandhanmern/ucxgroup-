import type { Metadata } from "next";
import Insights from "@/components/sections/Insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Perspectives on BIM & digital engineering, design & delivery, and technology & AI from the teams delivering UCX's projects.",
};

export default function InsightsPage() {
  return <Insights />;
}
