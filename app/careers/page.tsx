import type { Metadata } from "next";
import Careers from "@/components/sections/Careers";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join UCX's team of BIM, digital engineering, design and delivery specialists — open roles and what it's like to build with us.",
};

export default function CareersPage() {
  return <Careers />;
}
