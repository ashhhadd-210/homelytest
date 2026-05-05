import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home cleaning",
  description: "Professional home cleaning — weekly, bi-weekly, or one-time deep cleans.",
};

export default function CleaningPage() {
  return (
    <div className="bg-gradient-to-b from-emerald-50/60 via-white to-white">
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-14 sm:px-6 lg:px-8 lg:pt-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Service</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Home cleaning</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          Keep your home spotless with weekly, bi-weekly, or one-time deep clean options tailored to your routine.
        </p>
      </section>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900">What is included</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
            <li>Kitchens, bathrooms, floors, and common areas cleaned with detail.</li>
            <li>Move-in, move-out, and seasonal deep-clean services available.</li>
            <li>Supplies and checklist aligned with your priorities and preferences.</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Get free quote
            </Link>
            <Link
              href="/booking"
              className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:border-emerald-300"
            >
              Book cleaning
            </Link>
          </div>
        </div>
        <aside className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6 ring-1 ring-emerald-100/70 sm:p-8">
          <h2 className="text-lg font-semibold text-emerald-950">Best for</h2>
          <p className="mt-3 text-sm leading-relaxed text-emerald-900/90">
            Busy families, short-term rentals, and homeowners who want a consistently clean space without the stress.
          </p>
        </aside>
      </section>
    </div>
  );
}
