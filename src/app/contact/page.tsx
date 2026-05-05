import type { Metadata } from "next";
import Link from "next/link";
import { QuoteForm } from "@/components/forms/QuoteForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a free quote for cleaning, lawn care, or home repair.",
};

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-b from-sky-50/80 via-white to-white">
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-14 sm:px-6 lg:px-8 lg:pt-16">
        <p className="inline-flex rounded-full border border-sky-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-800">
          Fast Response
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Request a quote</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          Tell us what you need and your preferred timeline. We usually respond the same day. Prefer to lock a time?{" "}
          <Link href="/booking" className="font-semibold text-sky-700 hover:underline">
            Book a visit
          </Link>
          .
        </p>
      </section>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
          <QuoteForm />
        </div>
        <aside className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6 ring-1 ring-emerald-100/70 sm:p-8">
          <h2 className="text-lg font-semibold text-emerald-950">What happens next</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-emerald-900/90">
            <li>1. We review your request and contact you with options.</li>
            <li>2. We confirm scope, pricing range, and schedule.</li>
            <li>3. Our team arrives on time and keeps you updated.</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
