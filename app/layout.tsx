import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/components/shared/fonts.css";
import "@/components/layout/Header.css";
import "@/components/sections/Hero.css";
import "@/components/sections/AboutUs.css";
import "@/components/sections/WhyChooseUs.css";
import "@/components/sections/Founders.css";
import "@/components/layout/Footer.css";
import "@/components/sections/ContactForm.css";
import "@/components/sections/FAQ.css";
import "@/components/sections/OurServices.css";
import "@/components/sections/CapabilitiesRail.css";
import "@/components/sections/Support.css";
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
