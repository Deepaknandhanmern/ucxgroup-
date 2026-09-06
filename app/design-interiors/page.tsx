import type { Metadata } from "next";
import Interiors from "@/components/sections/Interiors";

const TITLE = "Design & Interiors — SpayceX by UCX";
const DESCRIPTION =
  "SpayceX is UCX's design and interiors studio — workplace, hospitality and residential interior design carried through to buildable construction documentation.";

export const metadata: Metadata = {
  alternates: { canonical: "/design-interiors" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://ucx-group.com/design-interiors",
    type: "website",
    images: ["/brand/interiors/hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/brand/interiors/hero.png"],
  },
};

export default function DesignInteriorsPage() {
  return <Interiors />;
}
