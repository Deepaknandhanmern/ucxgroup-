import type { Metadata } from "next";
import InteriorsVRExperience from "@/components/sections/InteriorsVRExperience";

export const metadata: Metadata = {
  title: "360° VR Experience — Design & Interiors",
  description:
    "A drag-to-look-around 360° walkthrough of a UCX interior project — step inside the space before a single wall goes up.",
};

export default function InteriorsVRExperiencePage() {
  return <InteriorsVRExperience />;
}
