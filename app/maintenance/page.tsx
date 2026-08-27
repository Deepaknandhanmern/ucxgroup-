import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/maintenance" },
  title: "UCX — Down for Maintenance",
  description: "UCX Group's website is undergoing scheduled maintenance and will be back online shortly.",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <div className="ucx-maintenance">
      <div className="grid-overlay"></div>
      <div className="wrapper">
        <span className="mark">UCX</span>
        <h1>We&apos;ll Be Right Back.</h1>
        <p>
          UCX is undergoing scheduled maintenance. We&apos;re working to get everything back online as quickly as
          possible.
        </p>
        <a href="mailto:collaborate@ucx-group.com">collaborate@ucx-group.com</a>
      </div>
    </div>
  );
}
