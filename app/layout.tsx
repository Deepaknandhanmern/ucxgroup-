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
import "@/components/ui/Breadcrumbs.css";
import "@/components/ui/Toast.css";
import "@/components/ui/LinkPreview.css";
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
import TabTitleSwitcher from "@/components/ui/TabTitleSwitcher";

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

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: "UCX Group",
  url: "https://ucx-group.com",
  logo: "https://ucx-group.com/brand/logo.png",
  image: "https://ucx-group.com/brand/logo.png",
  description:
    "UCX is a design, digital engineering, project delivery and asset information ecosystem — one connected team delivering built environments end to end.",
  email: "collaborate@ucx-group.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Door No. 653, Part LCC Compound, 1-3, Trichy Rd, opposite Srivari Trisara, Singanallur",
    addressLocality: "Coimbatore",
    addressRegion: "Tamil Nadu",
    postalCode: "641005",
    addressCountry: "IN",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-[#00352D] focus:shadow-lg"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <TabTitleSwitcher />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
