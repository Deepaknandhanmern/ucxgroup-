import Hero from "@/components/sections/Hero";
import AboutUs from "@/components/sections/AboutUs";
import Ecosystem from "@/components/sections/Ecosystem";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import OurServices from "@/components/sections/OurServices";
import SpecialistSolutions from "@/components/sections/SpecialistSolutions";
import CapabilitiesRail from "@/components/sections/CapabilitiesRail";
import Sectors from "@/components/sections/Sectors";
import DeliveryModel from "@/components/sections/DeliveryModel";
import LabPromo from "@/components/sections/LabPromo";
import Support from "@/components/sections/Support";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutUs />
      <Ecosystem />
      <WhyChooseUs />
      <OurServices />
      <SpecialistSolutions />
      <CapabilitiesRail />
      <Sectors />
      <DeliveryModel />
      <LabPromo />
      <Support />
    </>
  );
}
