import type { Metadata } from "next";
import BimModelViewer from "@/components/sections/BimModelViewer";

export const metadata: Metadata = {
  alternates: { canonical: "/experience/bim-model" },
  title: "Live BIM Model — Mr. Aravind Residence",
  description:
    "A real, coordinated BIM model rendered live in the browser — converted from the project's IFC export using the same connected-model approach UCX uses across design, coordination and delivery.",
};

export default function BimModelPage() {
  return <BimModelViewer />;
}
