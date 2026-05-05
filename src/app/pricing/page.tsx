import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent starting ranges for cleaning, lawn care, and repairs. Request a quote for your home.",
};

const tiers = [
  {
    title: "Cleaning",
    range: "$100 – $300+ per job",
    note: "Depends on home size, frequency, and deep-clean scope.",
  },
  {
    title: "Lawn care",
    range: "$50 – $150+ per visit",
    note: "Lot size, frequency, and seasonal extras affect price.",
  },
  {
    title: "Home repair",
    range: "$80+ per hour",
    note: "Minimums may apply; we confirm scope before starting.",
  },
] as const;

export default function PricingPage() {
  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-white">
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 lg:px-8 lg:pt-16">
        <p className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
          Transparent Pricing
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Pricing</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          Fair, upfront ranges. Every home is different, so we confirm exact scope and price before any work starts.
        </p>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.title}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-100"
            >
              <h2 className="text-lg font-semibold text-slate-900">{t.title}</h2>
              <p className="mt-3 text-3xl font-bold tracking-tight text-sky-800">{t.range}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{t.note}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-emerald-950">Monthly home care plan</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-emerald-900/90">
            Bundle cleaning and lawn care on a recurring schedule for predictable pricing and priority booking. Ask us
            for a custom plan when you{" "}
            <Link href="/contact" className="font-semibold text-sky-800 underline">
              request a quote
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
