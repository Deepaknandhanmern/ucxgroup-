import type { Metadata } from "next";
import NotFoundContent from "@/components/sections/NotFoundContent";

export const metadata: Metadata = {
  title: "UCX — Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundContent />;
}
