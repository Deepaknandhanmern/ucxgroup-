import type { Metadata } from "next";
import { unsubscribeByToken } from "@/lib/subscribers-db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = await searchParams;
  const ok = typeof token === "string" && token.length > 0 ? unsubscribeByToken(token) : false;

  return (
    <div className="ucx-unsubscribe">
      <div className="wrapper">
        <h1>{ok ? "You're unsubscribed." : "Link not found."}</h1>
        <p>
          {ok
            ? "You won't receive any more email updates from UCX Group. If this was a mistake, you can subscribe again any time from our Insights page."
            : "This unsubscribe link is invalid or has already been used."}
        </p>
        <a className="home-cta" href="/">
          Back to Home
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
