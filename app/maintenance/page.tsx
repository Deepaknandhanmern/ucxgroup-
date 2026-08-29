import type { Metadata } from "next";
import Maintenance from "@/components/sections/Maintenance";

export const metadata: Metadata = {
  alternates: { canonical: "/maintenance" },
  title: "UCX — Down for Maintenance",
  description: "UCX Group's website is undergoing scheduled maintenance and will be back online shortly.",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return <Maintenance />;
}
