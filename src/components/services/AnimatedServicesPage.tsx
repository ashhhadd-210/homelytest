import Image from "next/image";
import Link from "next/link";
import { businessLocation, mapEmbedUrl, mapOpenUrl } from "@/lib/site";
import { ScrollProgress } from "@/components/home/ScrollProgress";
import { SmartInsightsPanel } from "@/components/home/SmartInsightsPanel";

const services = [
  {
    title: "Home Cleaning",
    body: "Professional cleaning for a fresh, healthy home with flexible weekly and deep-clean options.",
    href: "/contact",
    image: "/services/cleaning-photo.png",
    alt: "Home cleaning illustration",
  },
  {
    title: "Lawn Care",
    body: "Mowing, trimming, edging, and seasonal support to keep your yard clean and vibrant all year.",
    href: "/contact",
    image: "/services/lawn-photo.png",
    alt: "Lawn care illustration",
  },
  {
    title: "Home Repairs",
    body: "From quick fixes to essential repairs, our trusted team keeps your home safe and functional.",
    href: "/contact",
    image: "/services/repair-photo.png",
    alt: "Home repairs illustration",
  },
] as const;

const trustItems = [
  { label: "Family-Owned", body: "We treat every home like our own." },
  { label: "Fast and Reliable", body: "On-time service from trained teams." },
  { label: "Affordable Pricing", body: "Clear packages that fit your budget." },
  { label: "Satisfaction First", body: "Your happiness is always our priority." },
] as const;

const stats = [
  { value: "500+", label: "Happy homeowners" },
  { value: "4.9", label: "Average rating" },
  { value: "120+", label: "Verified reviews" },
] as const;

const testimonials = [
  { quote: "They cleaned my home and fixed our sink in one visit. Excellent service.", person: "Jessica M.", city: "Austin, TX" },
  { quote: "Our lawn has never looked better. The team was friendly and right on time.", person: "David R.", city: "Round Rock, TX" },
  { quote: "Very reliable and affordable. We now use them monthly for all services.", person: "Sarah L.", city: "Cedar Park, TX" },
] as const;

export function AnimatedServicesPage() {
  return (
    <div>
      <ScrollProgress />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50">
        <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-sky-200/35 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-12 h-52 w-52 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 right-1/4 h-48 w-48 rounded-full bg-cyan-200/30 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-sm">
                Trusted by local families
              </span>
              <h1 className="mt-5 max-w-xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                <span className="block">We take care of</span>
                <span className="block text-emerald-600">your home,</span>
                <span className="block">so you can focus on what matters.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                From cleaning to repairs and lawn care - reliable, affordable services from a family-owned team you can trust.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-400/30 transition hover:bg-emerald-600 active:scale-95"
                >
                  Get a Free Quote
                  <span aria-hidden>-&gt;</span>
                </Link>
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-400 active:scale-95"
                >
                  Book a Service
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <p className="text-lg font-bold text-slate-900">{item.value}</p>
                    <p className="text-xs font-medium text-slate-600">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[2.2rem] border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-300/45">
                <div className="relative overflow-hidden rounded-[1.8rem]">
                  <Image
                    src="/landing-hero-banner.png"
                    alt="Cleaning service banner image"
                    width={1024}
                    height={667}
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="h-[460px] w-full object-cover md:h-[540px]"
                    priority
                    fetchPriority="high"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-white/10" />
                </div>
              </div>

              <div className="absolute -left-4 bottom-6 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-lg animate-float-y">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">100% Satisfaction</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Guaranteed service quality</p>
              </div>

              <div className="absolute -right-3 top-6 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-md">
                New same-day slots opened
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Our Services</p>
        <h2 className="mx-auto mt-2 max-w-lg text-center text-3xl font-bold text-slate-900">
          Everything your home needs, handled with care.
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative mb-3 overflow-hidden rounded-xl bg-slate-50">
                <Image
                  src={service.image}
                  alt={service.alt}
                  width={900}
                  height={560}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                  className="h-44 w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <span className="absolute left-3 top-3 rounded-full bg-sky-700 px-3 py-1 text-xs font-semibold text-white">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.body}</p>
              <Link href={service.href} className="mt-3 inline-block text-sm font-semibold text-emerald-700 transition hover:translate-x-1">
                Learn More -&gt;
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/pricing"
            className="inline-flex rounded-full bg-sky-900 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/20 transition hover:bg-sky-800 active:scale-95"
          >
            View All Services
          </Link>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50/70">
        <div className="mx-auto grid max-w-6xl gap-7 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1.8fr] lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Why Choose Us</p>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-slate-900">Reliable. Local. Family-Owned.</h2>
            <p className="mt-3 text-slate-600">
              We are not a big franchise. We are your neighborhood team that cares deeply about service quality.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 active:scale-95"
            >
              Learn More About Us
              <span aria-hidden>-&gt;</span>
            </Link>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {trustItems.map((item) => (
              <li key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1">
                <p className="text-base font-semibold text-slate-900">{item.label}</p>
                <p className="mt-1 text-sm text-slate-600">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">{businessLocation.heading}</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Local team, mapped to your neighborhood</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">{businessLocation.paragraph1}</p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">{businessLocation.paragraph2}</p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
          <iframe
            title={`Map: ${businessLocation.mapsQuery}`}
            src={mapEmbedUrl}
            className="h-[280px] w-full border-0 sm:h-[360px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <p className="mt-3 text-center text-sm text-slate-500">
          <Link href={mapOpenUrl} className="font-semibold text-emerald-700 underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
            Open in Google Maps
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <SmartInsightsPanel />
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-sky-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(52,211,153,0.2),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(56,189,248,0.2),transparent_38%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">What Our Customers Say</p>
          <h2 className="mt-2 text-center text-3xl font-bold text-white">Real homes. Real reviews.</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {testimonials.map((review) => (
              <article
                key={review.person}
                className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-sm transition hover:-translate-y-2"
              >
                <p className="mb-2 text-sm text-amber-300">{"*".repeat(5)}</p>
                <p className="text-sm leading-relaxed text-sky-100">{review.quote}</p>
                <div className="mt-4">
                  <p className="text-sm font-semibold">{review.person}</p>
                  <p className="text-xs text-sky-200">{review.city}</p>
                </div>
                <div className="mt-3 h-1 w-3/4 rounded-full bg-gradient-to-r from-emerald-300/80 to-sky-300/80" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-sky-950 pb-14">
        <div className="pointer-events-none absolute left-1/2 top-1 h-40 w-40 -translate-x-1/2 rounded-full bg-emerald-300/30 blur-3xl" />
        <div className="mx-auto grid max-w-5xl gap-4 rounded-3xl border border-emerald-300/30 bg-gradient-to-r from-emerald-500 to-lime-500 px-6 py-6 text-white shadow-2xl shadow-emerald-700/30 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-100">Ready when you are</p>
            <h3 className="mt-1 text-2xl font-bold">Book online in under 60 seconds.</h3>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/booking"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-md transition hover:bg-emerald-50 active:scale-95"
            >
              Book Your Service Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-95"
            >
              Talk to an expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
