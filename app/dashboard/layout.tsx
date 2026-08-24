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
    { href: "/dashboard/case-studies", label: "Case Studies" },
    { href: "/dashboard/resources", label: "Resources" },
    { href: "/dashboard/careers", label: "Careers" },
    { href: "/dashboard/enquiries", label: "Enquiries" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-sm font-bold tracking-wide text-[#00352d]">
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
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm font-medium text-neutral-500 hover:text-neutral-800"
        >
          Sign out
        </button>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
