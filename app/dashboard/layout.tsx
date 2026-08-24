"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.startsWith("/dashboard/login")) return <>{children}</>;

  async function handleLogout() {
    await fetch("/api/dashboard-auth/logout", { method: "POST" });
    router.push("/dashboard/login");
    router.refresh();
  }

  const navItems = [
    { href: "/dashboard", label: "Overview", exact: true },
    { href: "/dashboard/posts", label: "Blog Posts" },
    { href: "/dashboard/projects", label: "Projects" },
    { href: "/dashboard/case-studies", label: "Case Studies" },
    { href: "/dashboard/resources", label: "Resources" },
    { href: "/dashboard/careers", label: "Careers" },
    { href: "/dashboard/enquiries", label: "Enquiries" },
  ];

  return (
    <div className="relative isolate min-h-screen bg-white font-atyp">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white/80 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="font-getho text-sm font-bold tracking-wide text-[#00352d]">
            UCX DASHBOARD
          </Link>
          <nav className="flex gap-1">
            {navItems.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    active ? "bg-[#00352d] text-white" : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/dashboard/settings"
            className={`text-sm font-medium ${
              pathname === "/dashboard/settings" ? "text-[#00352d]" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Settings
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-neutral-500 hover:text-neutral-800"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
