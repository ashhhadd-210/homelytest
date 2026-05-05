import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
              <Image src="/logo.png" alt={`${site.name} logo`} width={32} height={32} className="h-7 w-7 object-contain" />
            </span>
            <p className="text-base font-semibold text-slate-900">{site.name}</p>
          </div>
          <p className="mt-3 max-w-sm text-sm text-slate-600">{site.description}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-slate-600">
          <Link href="/contact" className="font-medium text-sky-800 hover:underline">
            Get a free quote
          </Link>
          <Link href="/booking" className="font-medium text-sky-800 hover:underline">
            Book a visit
          </Link>
        </div>
      </div>
      <div className="border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-500">
        © {year} {site.name}. Family-owned and operated.
      </div>
    </footer>
  );
}
