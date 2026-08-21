import Hero from "@/components/sections/Hero";
import AnnouncementBanner from "@/components/ui/AnnouncementBanner";
import AboutUs from "@/components/sections/AboutUs";
import Ecosystem from "@/components/sections/Ecosystem";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import OurServices from "@/components/sections/OurServices";
import SpecialistSolutions from "@/components/sections/SpecialistSolutions";
import CapabilitiesRail from "@/components/sections/CapabilitiesRail";
import Sectors from "@/components/sections/Sectors";
import GlobalReach from "@/components/sections/GlobalReach";
import GalleryArc from "@/components/sections/GalleryArc";
import DeliveryModel from "@/components/sections/DeliveryModel";
import TestimonialReel from "@/components/sections/TestimonialReel";
import LabPromo from "@/components/sections/LabPromo";
import Support from "@/components/sections/Support";

export default function Home() {
  return (
    <>
      <AnnouncementBanner
        id="q4-2026-capacity"
        buttonText="Accepting New Projects for Q4"
        description="Limited delivery slots — reach out to discuss your project."
        href="/contact"
      />
      <Hero />
      <AboutUs />
      <Ecosystem />
      <WhyChooseUs />
      <OurServices />
      <SpecialistSolutions />
      <CapabilitiesRail />
      <Sectors />
      <GlobalReach />
      <GalleryArc />
      <DeliveryModel />
      <TestimonialReel />
      <LabPromo />
      <Support />
    </>
  );
}
