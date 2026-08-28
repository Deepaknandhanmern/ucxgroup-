"use client";

import { useEffect } from "react";
import { Inter } from "next/font/google";
import FadeIn from "./FadeIn";
import AnimatedHeading from "./AnimatedHeading";
import styles from "./test-hero.module.css";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

const NAV_LINKS = ["Story", "Investing", "Building", "Advisory"];

export default function TestHeroPage() {
  // This preview sits on top of the site's normal header/footer/cookie
  // banner (they still render behind it) rather than escaping the root
  // layout, since this route is a throwaway approval preview, not a real
  // page — locking scroll keeps the real page from peeking out underneath.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className={`${inter.className} fixed inset-0 z-[10000] h-[100dvh] w-full overflow-hidden bg-black text-white antialiased`}
      style={{ WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale" }}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="px-6 pt-6 md:px-12 lg:px-16">
          <nav className={`${styles.liquidGlass} flex items-center justify-between rounded-xl px-4 py-2`}>
            <span className="text-2xl font-semibold tracking-tight">VEX</span>

            <div className="hidden items-center gap-8 text-sm md:flex">
              {NAV_LINKS.map((link) => (
                <a key={link} href="#" className={styles.navLink}>
                  {link}
                </a>
              ))}
            </div>

            <button type="button" className={`${styles.startChatBtn} rounded-lg bg-white px-6 py-2 text-sm font-medium text-black`}>
              Start a Chat
            </button>
          </nav>
        </div>

        <div className="flex flex-1 flex-col justify-end px-6 pb-12 md:px-12 lg:px-16 lg:pb-16">
          <div className="lg:grid lg:grid-cols-2 lg:items-end">
            <div>
              <AnimatedHeading
                text={"Shaping tomorrow\nwith vision and action."}
                className="mb-4 text-4xl font-normal md:text-5xl lg:text-6xl xl:text-7xl"
                style={{ letterSpacing: "-0.04em" }}
              />

              <FadeIn delay={800} duration={1000}>
                <p className="mb-5 text-base text-gray-300 md:text-lg">
                  We back visionaries and craft ventures that define what comes next.
                </p>
              </FadeIn>

              <FadeIn delay={1200} duration={1000}>
                <div className="flex flex-wrap gap-4">
                  <button type="button" className={`${styles.startChatBtn} rounded-lg bg-white px-8 py-3 font-medium text-black`}>
                    Start a Chat
                  </button>
                  <button
                    type="button"
                    className={`${styles.liquidGlass} ${styles.exploreBtn} rounded-lg border border-white/20 px-8 py-3 font-medium text-white`}
                  >
                    Explore Now
                  </button>
                </div>
              </FadeIn>
            </div>

            <div className="mt-8 flex items-end justify-start lg:mt-0 lg:justify-end">
              <FadeIn delay={1400} duration={1000}>
                <div className={`${styles.liquidGlass} rounded-xl border border-white/20 px-6 py-3`}>
                  <span className="text-lg font-light md:text-xl lg:text-2xl">Investing. Building. Advisory.</span>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
