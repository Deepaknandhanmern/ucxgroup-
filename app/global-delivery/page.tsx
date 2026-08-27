import type { Metadata } from "next";
import GlobalDelivery from "@/components/sections/GlobalDelivery";

export const metadata: Metadata = {
  alternates: { canonical: "/global-delivery" },
  title: "Global Delivery",
  description:
    "UCX delivers projects across India, the UAE, the UK and the US through a distributed team model built for global time-zone coverage and local project standards.",
};

export default function GlobalDeliveryPage() {
  return (
    <>
      <GlobalDelivery />
    </>
  );
}
