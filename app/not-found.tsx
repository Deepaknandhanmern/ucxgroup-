import type { Metadata } from "next";
import NotFoundContent from "@/components/sections/NotFoundContent";

export const metadata: Metadata = {
  title: "UCX — Page Not Found",
  description: "The page you're looking for doesn't exist or has moved. Find your way back to UCX Group's capabilities, projects and insights.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundContent />;
}
