import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/components/shared/fonts.css";
import "@/components/layout/Header.css";
import "@/components/sections/Hero.css";
import "@/components/sections/AboutUs.css";
import "@/components/sections/WhyChooseUs.css";
import "@/components/sections/Founders.css";
import "@/components/sections/Workspace.css";
import "@/components/layout/Footer.css";
import "@/components/sections/ContactForm.css";
import "@/components/sections/FAQ.css";
import "@/components/sections/OurServices.css";
import "@/components/sections/CapabilitiesRail.css";
import "@/components/sections/Support.css";
import "@/components/sections/CaseStudies.css";
import "@/components/sections/Careers.css";
import "@/components/sections/GlobalDelivery.css";
import "@/components/sections/Interiors.css";
import "@/components/sections/CollaborationLab.css";
import "@/components/sections/Experience.css";
import "@/components/sections/CapabilityPage.css";
import "@/components/sections/Capabilities.css";
import "@/components/ui/FileCard.css";
import "@/components/sections/Resources.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UCX Group",
  description: "Unconventional Collaboration",
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
      </body>
    </html>
  );
}
