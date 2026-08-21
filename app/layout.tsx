import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/components/shared/fonts.css";
import "@/components/layout/Header.css";
import "@/components/layout/BackToTop.css";
import "@/components/sections/Hero.css";
import "@/components/sections/AboutUs.css";
import "@/components/sections/Ecosystem.css";
import "@/components/sections/SpecialistSolutions.css";
import "@/components/sections/Sectors.css";
import "@/components/sections/GlobalReach.css";
import "@/components/sections/GalleryArc.css";
import "@/components/sections/DeliveryModel.css";
import "@/components/sections/TestimonialReel.css";
import "@/components/sections/LabPromo.css";
import "@/components/sections/WhyChooseUs.css";
import "@/components/sections/Founders.css";
import "@/components/sections/CompanyHero.css";
import "@/components/sections/OurApproach.css";
import "@/components/sections/EngineeringPurpose.css";
import "@/components/sections/StudioInterlude.css";
import "@/components/sections/BuildingEcosystem.css";
import "@/components/sections/Workspace.css";
import "@/components/layout/Footer.css";
import "@/components/sections/ContactForm.css";
import "@/components/sections/ContactMap.css";
import "@/components/sections/FAQ.css";
import "@/components/sections/OurServices.css";
import "@/components/sections/CapabilitiesRail.css";
import "@/components/sections/Support.css";
import "@/components/sections/CaseStudies.css";
import "@/components/sections/Careers.css";
import "@/components/sections/GlobalDelivery.css";
import "@/components/sections/InteriorsHero.css";
import "@/components/sections/InteriorsFooter.css";
import "@/components/sections/Interiors.css";
import "@/components/sections/LabHero.css";
import "@/components/sections/LabExplore.css";
import "@/components/sections/CollaborationLab.css";
import "@/components/sections/Experience.css";
import "@/components/sections/ProjectLifecycle.css";
import "@/components/sections/CapabilityPage.css";
import "@/components/sections/Capabilities.css";
import "@/components/sections/DigitalProjectExperience.css";
import "@/components/ui/FileCard.css";
import "@/components/ui/WorldMap.css";
import "@/components/sections/Resources.css";
import "@/components/sections/FeaturedProjects.css";
import "@/components/sections/ProjectDetail.css";
import "@/components/sections/Insights.css";
import "@/components/sections/InsightArticle.css";
import "@/components/sections/Maintenance.css";
import "@/components/sections/NotFoundContent.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ucx-group.com"),
  title: {
    default: "UCX Group — Unconventional Collaboration",
    template: "%s | UCX Group",
  },
  description:
    "UCX is a design, digital engineering, project delivery and asset information ecosystem — one connected team delivering built environments end to end.",
  openGraph: {
    title: "UCX Group — Unconventional Collaboration",
    description:
      "Design, digital engineering, project delivery and asset information — one connected delivery ecosystem.",
    url: "https://ucx-group.com",
    siteName: "UCX Group",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UCX Group — Unconventional Collaboration",
    description:
      "Design, digital engineering, project delivery and asset information — one connected delivery ecosystem.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
