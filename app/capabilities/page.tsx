import type { Metadata } from "next";
import Capabilities from "@/components/sections/Capabilities";

const TITLE = "Capabilities";
const DESCRIPTION =
  "BIM & digital delivery, design & interiors, project & construction support, and asset & digital information — explore UCX's four connected delivery capabilities.";

export const metadata: Metadata = {
  alternates: { canonical: "/capabilities" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: `${TITLE} | UCX Group`,
    description: DESCRIPTION,
    url: "https://ucx-group.com/capabilities",
    type: "website",
    images: ["/brand/social.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | UCX Group`,
    description: DESCRIPTION,
    images: ["/brand/social.png"],
  },
};

export default function CapabilitiesPage() {
  return <Capabilities />;
}
