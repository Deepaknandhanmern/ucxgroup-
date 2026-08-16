import type { Metadata } from "next";
import Capabilities from "@/components/sections/Capabilities";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "BIM & digital delivery, design & interiors, project & construction support, and asset & digital information — explore UCX's four connected delivery capabilities.",
};

export default function CapabilitiesPage() {
  return <Capabilities />;
}
