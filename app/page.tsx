import Hero from "@/components/sections/Hero";
import AnnouncementBanner from "@/components/ui/AnnouncementBanner";
import SectionRail from "@/components/ui/SectionRail";
import AboutUs from "@/components/sections/AboutUs";
import Ecosystem from "@/components/sections/Ecosystem";
import OurServices from "@/components/sections/OurServices";
import SpecialistSolutions from "@/components/sections/SpecialistSolutions";
import DeliveryModel from "@/components/sections/DeliveryModel";
import DeliveryProof from "@/components/sections/DeliveryProof";
import GalleryArc from "@/components/sections/GalleryArc";
import Sectors from "@/components/sections/Sectors";
import GlobalReach from "@/components/sections/GlobalReach";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import LabPromo from "@/components/sections/LabPromo";
import Support from "@/components/sections/Support";
import TestimonialReel from "@/components/sections/TestimonialReel";

const RAIL_SECTIONS = [
  { id: "hero", label: "Overview" },
  { id: "about", label: "About" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "services", label: "Services" },
  { id: "solutions", label: "Solutions" },
  { id: "sectors", label: "Sectors" },
  { id: "support", label: "Get Started" },
];

export default function Home() {
  return (
    <>
      <SectionRail sections={RAIL_SECTIONS} />
      <AnnouncementBanner
        id="q4-2026-capacity"
        buttonText="Accepting New Projects for Q4"
        description="Limited delivery slots — reach out to discuss your project."
        href="/contact"
      />
      <Hero />
      <AboutUs />
      <Ecosystem />
      <OurServices />
      <SpecialistSolutions />
      <DeliveryModel />
      <DeliveryProof />
      <GalleryArc />
      <Sectors />
      <GlobalReach />
      <WhyChooseUs />
      <LabPromo />
      <Support />
      <TestimonialReel />
    </>
  );
}
