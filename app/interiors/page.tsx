import type { Metadata } from "next";
import Interiors from "@/components/sections/Interiors";

export const metadata: Metadata = {
  title: "Design & Interiors — SpayceX by UCX",
  description:
    "SpayceX is UCX's design and interiors studio — workplace, hospitality and residential interior design carried through to buildable construction documentation.",
};

export default function InteriorsPage() {
  return <Interiors />;
}
