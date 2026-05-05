import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Testimonials from homeowners who use our cleaning, lawn, and repair services.",
};

const items = [
  {
    quote: "They cleaned my home and fixed my sink the same day. Highly recommend!",
    by: "Local customer",
  },
  {
    quote: "Finally one team for the yard and the house. Scheduling was painless.",
    by: "Homeowner, nearby neighborhood",
  },
  {
    quote: "Fair pricing and they actually showed up in the window they promised.",
    by: "Repeat customer",
  },
] as const;

export default function ReviewsPage() {
  return (
    <div className="bg-gradient-to-b from-sky-50/70 via-white to-white">
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 lg:px-8 lg:pt-16">
        <p className="inline-flex rounded-full border border-sky-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-800">
          Client Testimonials
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Reviews</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          Word of mouth built our business. Here is what neighbors say after trusting us with their home.
        </p>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t.quote}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm ring-1 ring-slate-100"
            >
              <blockquote className="text-sm leading-relaxed text-slate-700">“{t.quote}”</blockquote>
              <figcaption className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                — {t.by}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
          <p className="text-sm text-slate-600">
            Ready to try us?{" "}
            <Link href="/booking" className="font-semibold text-sky-700 hover:underline">
              Book now
            </Link>{" "}
            or{" "}
            <Link href="/contact" className="font-semibold text-sky-700 hover:underline">
              request a quote
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
