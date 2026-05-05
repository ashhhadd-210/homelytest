"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/";
    }
    return pathname === href;
  };

  const getLinkClass = (href: string) => {
    const isActive = isActiveLink(href);
    return [
      "rounded-full px-3 py-1.5 transition",
      isActive ? "bg-emerald-600 text-white shadow-sm" : "hover:bg-emerald-50 hover:text-emerald-900",
    ].join(" ");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-3 leading-tight">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
              <Image src="/logo.png" alt={`${site.name} logo`} width={36} height={36} className="h-8 w-8 object-contain" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-lg font-semibold tracking-tight text-slate-900">{site.name}</span>
              <span className="text-xs text-emerald-700">All-in-one home services</span>
            </span>
          </Link>
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href={site.phoneHref}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
            >
              {site.phoneDisplay}
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center rounded-full bg-sky-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"
            >
              Book a Service
            </Link>
          </div>
          <details className="relative lg:hidden">
            <summary className="list-none cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white py-2 shadow-lg">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "block px-4 py-2 text-sm",
                    isActiveLink(item.href)
                      ? "bg-emerald-600 font-semibold text-white"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-900",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-slate-100 px-4 pt-2">
                <Link href={site.phoneHref} className="block py-2 text-sm font-semibold text-slate-700">
                  Call: {site.phoneDisplay}
                </Link>
              </div>
            </div>
          </details>
        </div>
        <nav className="mt-3 hidden flex-wrap items-center gap-x-1 gap-y-2 text-sm font-medium text-slate-700 lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={getLinkClass(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
