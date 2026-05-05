import type { Metadata } from "next";
import Link from "next/link";
import { BookingForm } from "@/components/forms/BookingForm";

export const metadata: Metadata = {
  title: "Book a visit",
  description: "Choose a service and preferred time — we confirm by phone or email.",
};

export default function BookingPage() {
  return (
    <div className="bg-gradient-to-b from-emerald-50/70 via-white to-white">
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-14 sm:px-6 lg:px-8 lg:pt-16">
        <p className="inline-flex rounded-full border border-emerald-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
          Priority Scheduling
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Book a visit</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          Choose your service, preferred date and location. We confirm availability before finalizing your appointment.
          Questions first?{" "}
          <Link href="/contact" className="font-semibold text-sky-700 hover:underline">
            Request a quote
          </Link>
          .
        </p>
      </section>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
          <BookingForm />
        </div>
        <aside className="rounded-3xl border border-sky-100 bg-sky-50/70 p-6 ring-1 ring-sky-100/70 sm:p-8">
          <h2 className="text-lg font-semibold text-sky-950">Booking notes</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-sky-900/90">
            <li>We confirm by phone or email before arrival.</li>
            <li>Need to reschedule? Reply to our confirmation message.</li>
            <li>For urgent needs, include details in your notes.</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
