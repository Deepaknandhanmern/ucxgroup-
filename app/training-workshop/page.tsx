import type { Metadata } from "next";
import TrainingWorkshop from "@/components/sections/TrainingWorkshop";

export const metadata: Metadata = {
  title: "Training & Workshop",
  description:
    "Industry-focused BIM and digital delivery training — fundamentals, advanced workshops, corporate programs and certification tracks for professionals and project teams.",
};

export default function TrainingWorkshopPage() {
  return <TrainingWorkshop />;
}
