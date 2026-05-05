"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import { businessLocation, mapEmbedUrl, mapOpenUrl } from "@/lib/site";

type Coordinates = {
  lat: number;
  lng: number;
};

type WeatherSnapshot = {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  time: string;
};

const MAX_RETRY_ATTEMPTS = 2;
const RETRY_DELAY_MS = 400;

const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

async function withRetry<T>(task: () => Promise<T | null>, attempts = MAX_RETRY_ATTEMPTS): Promise<T | null> {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const result = await task();
    if (result !== null) return result;
    if (attempt < attempts) await sleep(RETRY_DELAY_MS * attempt);
  }
  return null;
}

const weatherCodeLabel: Record<number, string> = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  56: "Freezing drizzle",
  57: "Heavy freezing drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Heavy rain showers",
  82: "Violent rain showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm with hail",
};

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
  {
    quote: "They cleaned my home and fixed our sink in one visit. Excellent service.",
    person: "Jessica M.",
    city: "Austin, TX",
  },
  {
    quote: "Our lawn has never looked better. The team was friendly and right on time.",
    person: "David R.",
    city: "Round Rock, TX",
  },
  {
    quote: "Very reliable and affordable. We now use them monthly for all services.",
    person: "Sarah L.",
    city: "Cedar Park, TX",
  },
] as const;

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export function AnimatedServicesPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [locationSource, setLocationSource] = useState<string>("Resolving location...");
  const [locationLabel, setLocationLabel] = useState<string>("Detecting your city");
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [weatherError, setWeatherError] = useState<string>("");
  const [isLoadingGeo, setIsLoadingGeo] = useState<boolean>(true);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });
  const heroLift = useTransform(scrollYProgress, [0, 0.2], [0, -28]);
  const heroFade = useTransform(scrollYProgress, [0, 0.25], [1, 0.8]);
  const googleGeolocationApiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOLOCATION_API_KEY;

  useEffect(() => {
    const resolveGeoFromBrowser = async (): Promise<{ coords: Coordinates; source: string } | null> => {
      if (typeof window === "undefined" || !("geolocation" in navigator)) {
        return null;
      }

      const tryOnce = () =>
        new Promise<{ coords: Coordinates; source: string } | null>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) =>
              resolve({
                coords: { lat: position.coords.latitude, lng: position.coords.longitude },
                source: "Browser Geolocation API",
              }),
            () => resolve(null),
            { timeout: 7000, enableHighAccuracy: false, maximumAge: 60000 },
          );
        });

      return withRetry(tryOnce);
    };

    const resolveGeoFromGoogle = async (): Promise<{ coords: Coordinates; source: string } | null> => {
      if (!googleGeolocationApiKey) {
        return null;
      }

      const tryOnce = async () => {
        try {
          const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${googleGeolocationApiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ considerIp: true }),
          });

          if (!response.ok) {
            return null;
          }

          const data = (await response.json()) as { location?: { lat?: number; lng?: number } };
          if (typeof data.location?.lat !== "number" || typeof data.location?.lng !== "number") {
            return null;
          }

          return {
            coords: { lat: data.location.lat, lng: data.location.lng },
            source: "Google Maps Geolocation API",
          };
        } catch {
          return null;
        }
      };

      return withRetry(tryOnce);
    };

    const resolveGeoFromIp = async (): Promise<{ coords: Coordinates; source: string; cityLabel: string } | null> => {
      const tryOnce = async () => {
        try {
          const response = await fetch("https://ipapi.co/json/");
          if (!response.ok) {
            return null;
          }

          const data = (await response.json()) as {
            latitude?: number;
            longitude?: number;
            city?: string;
            region?: string;
          };

          if (typeof data.latitude !== "number" || typeof data.longitude !== "number") {
            return null;
          }

          const cityLabel = data.city && data.region ? `${data.city}, ${data.region}` : data.city ?? "Your current region";
          return {
            coords: { lat: data.latitude, lng: data.longitude },
            source: "IP Geolocation API",
            cityLabel,
          };
        } catch {
          return null;
        }
      };

      return withRetry(tryOnce);
    };

    const resolveLocation = async () => {
      setIsLoadingGeo(true);
      setLocationError("");

      const browserGeo = await resolveGeoFromBrowser();
      if (browserGeo) {
        setCoords(browserGeo.coords);
        setLocationSource(browserGeo.source);
        setLocationLabel("Precise device location");
        setIsLoadingGeo(false);
        return;
      }

      const googleGeo = await resolveGeoFromGoogle();
      if (googleGeo) {
        setCoords(googleGeo.coords);
        setLocationSource(googleGeo.source);
        setLocationLabel("Network-based location");
        setIsLoadingGeo(false);
        return;
      }

      const ipGeo = await resolveGeoFromIp();
      if (ipGeo) {
        setCoords(ipGeo.coords);
        setLocationSource(ipGeo.source);
        setLocationLabel(ipGeo.cityLabel);
        setIsLoadingGeo(false);
        return;
      }

      setLocationError("Unable to detect location from browser, Google, or IP services.");
      setLocationSource("Location unavailable");
      setIsLoadingGeo(false);
    };

    void resolveLocation();
  }, [googleGeolocationApiKey]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!coords) {
        return;
      }

      setIsLoadingWeather(true);
      setWeatherError("");

      try {
        const weatherData = await withRetry<{
          temperature_2m: number;
          wind_speed_10m: number;
          weather_code: number;
          time: string;
        }>(async () => {
          try {
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto`,
            );
            if (!response.ok) {
              return null;
            }

            const data = (await response.json()) as {
              current?: {
                temperature_2m?: number;
                wind_speed_10m?: number;
                weather_code?: number;
                time?: string;
              };
            };
            if (
              typeof data.current?.temperature_2m !== "number" ||
              typeof data.current?.wind_speed_10m !== "number" ||
              typeof data.current?.weather_code !== "number" ||
              typeof data.current?.time !== "string"
            ) {
              return null;
            }

            return {
              temperature_2m: data.current.temperature_2m,
              wind_speed_10m: data.current.wind_speed_10m,
              weather_code: data.current.weather_code,
              time: data.current.time,
            };
          } catch {
            return null;
          }
        });

        if (!weatherData) {
          throw new Error("Weather request failed after retries");
        }

        setWeather({
          temperature: weatherData.temperature_2m,
          windSpeed: weatherData.wind_speed_10m,
          weatherCode: weatherData.weather_code,
          time: weatherData.time,
        });
      } catch {
        setWeatherError("Weather data could not be loaded for your detected location.");
      } finally {
        setIsLoadingWeather(false);
      }
    };

    void fetchWeather();
  }, [coords]);

  const weatherSummary = useMemo(() => {
    if (!weather) {
      return "Live weather data will appear once location is available.";
    }

    return weatherCodeLabel[weather.weatherCode] ?? "Current conditions";
  }, [weather]);

  return (
    <div ref={rootRef}>
      <motion.div className="fixed left-0 top-0 z-[60] h-1 origin-left bg-emerald-500" style={{ scaleX: progressScale, width: "100%" }} />

      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50">
        <div className="floating-blob-a pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-sky-200/35 blur-3xl" />
        <div className="floating-blob-b pointer-events-none absolute right-10 top-12 h-52 w-52 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="floating-blob-c pointer-events-none absolute -bottom-10 right-1/4 h-48 w-48 rounded-full bg-cyan-200/30 blur-3xl" />

        <motion.div className="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pt-14" style={{ y: heroLift, opacity: heroFade }}>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <span className="hero-badge inline-flex rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-sm">
                Trusted by local families
              </span>
              <h1 className="mt-5 max-w-xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                <span className="hero-title-line block">We take care of</span>
                <span className="hero-title-line block text-emerald-600">your home,</span>
                <span className="hero-title-line block">so you can focus on what matters.</span>
              </h1>
              <p className="hero-subcopy mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                From cleaning to repairs and lawn care - reliable, affordable services from a family-owned team you can trust.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <motion.div className="hero-cta" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-400/30 transition hover:bg-emerald-600"
                  >
                    Get a Free Quote
                    <span aria-hidden>-&gt;</span>
                  </Link>
                </motion.div>
                <motion.div className="hero-cta" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/booking"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-400"
                  >
                    Book a Service
                  </Link>
                </motion.div>
              </div>

              <div className="hero-proof mt-7 flex flex-wrap gap-3">
                {stats.map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <p className="text-lg font-bold text-slate-900">{item.value}</p>
                    <p className="text-xs font-medium text-slate-600">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div className="hero-card relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
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

              <motion.div
                className="pulse-badge absolute -left-4 bottom-6 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-lg"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">100% Satisfaction</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Guaranteed service quality</p>
              </motion.div>

              <motion.div
                className="absolute -right-3 top-6 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-md"
                animate={{ x: [0, -5, 0], rotate: [0, 1.2, 0] }}
                transition={{ duration: 3.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                New same-day slots opened
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <motion.section
        className="gsap-reveal mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-emerald-700" variants={itemVariants}>
          Our Services
        </motion.p>
        <motion.h2 className="mx-auto mt-2 max-w-lg text-center text-3xl font-bold text-slate-900" variants={itemVariants}>
          Everything your home needs, handled with care.
        </motion.h2>

        <motion.div className="mt-8 grid gap-5 md:grid-cols-3" variants={sectionVariants}>
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              variants={itemVariants}
              whileHover={{ y: -10, rotateX: 2, rotateY: index === 1 ? 0 : index === 0 ? -1 : 1 }}
              transition={{ type: "spring", stiffness: 170, damping: 15 }}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
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
                <motion.span
                  className="absolute left-3 top-3 rounded-full bg-sky-700 px-3 py-1 text-xs font-semibold text-white"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.1, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
                >
                  {index + 1}
                </motion.span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.body}</p>
              <motion.div whileHover={{ x: 5 }} className="mt-3">
                <Link href={service.href} className="text-sm font-semibold text-emerald-700">
                  Learn More -&gt;
                </Link>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div className="mt-8 flex justify-center" variants={itemVariants}>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/pricing"
              className="inline-flex rounded-full bg-sky-900 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/20 transition hover:bg-sky-800"
            >
              View All Services
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        className="gsap-reveal border-y border-slate-200 bg-slate-50/70"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto grid max-w-6xl gap-7 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1.8fr] lg:px-8">
          <motion.div variants={itemVariants}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Why Choose Us</p>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-slate-900">Reliable. Local. Family-Owned.</h2>
            <p className="mt-3 text-slate-600">
              We are not a big franchise. We are your neighborhood team that cares deeply about service quality.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-5 inline-block">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Learn More About Us
                <span aria-hidden>-&gt;</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div className="grid gap-3 sm:grid-cols-2" variants={sectionVariants}>
            {trustItems.map((item) => (
              <motion.li
                key={item.label}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="list-none rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="text-base font-semibold text-slate-900">{item.label}</p>
                <p className="mt-1 text-sm text-slate-600">{item.body}</p>
              </motion.li>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="gsap-reveal mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700" variants={itemVariants}>
          {businessLocation.heading}
        </motion.p>
        <motion.h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl" variants={itemVariants}>
          Local team, mapped to your neighborhood
        </motion.h2>
        <motion.p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base" variants={itemVariants}>
          {businessLocation.paragraph1}
        </motion.p>
        <motion.p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base" variants={itemVariants}>
          {businessLocation.paragraph2}
        </motion.p>
        <motion.div
          className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm"
          variants={itemVariants}
        >
          <iframe
            title={`Map: ${businessLocation.mapsQuery}`}
            src={mapEmbedUrl}
            className="h-[280px] w-full border-0 sm:h-[360px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </motion.div>
        <motion.p className="mt-3 text-center text-sm text-slate-500" variants={itemVariants}>
          <Link href={mapOpenUrl} className="font-semibold text-emerald-700 underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
            Open in Google Maps
          </Link>
        </motion.p>
      </motion.section>

      <motion.section
        className="gsap-reveal mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50 p-5 shadow-sm sm:p-7">
          <motion.p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700" variants={itemVariants}>
            Smart Local Insights
          </motion.p>
          <motion.h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl" variants={itemVariants}>
            Weather + geolocation powered service planning
          </motion.h2>
          <motion.p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base" variants={itemVariants}>
            We combine Browser Geolocation API, Google Maps Geolocation API, and IP Geolocation API to estimate your area, then load live weather to better plan timing and staffing.
          </motion.p>

          <motion.div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4" variants={sectionVariants}>
            <motion.article variants={itemVariants} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Detected area</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{locationLabel}</p>
              <p className="mt-2 text-xs text-slate-600">{isLoadingGeo ? "Resolving..." : locationSource}</p>
            </motion.article>

            <motion.article variants={itemVariants} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Temperature</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {isLoadingWeather ? "Loading..." : weather ? `${weather.temperature.toFixed(1)} C` : "--"}
              </p>
              <p className="mt-2 text-xs text-slate-600">{weatherSummary}</p>
            </motion.article>

            <motion.article variants={itemVariants} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Wind speed</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {isLoadingWeather ? "Loading..." : weather ? `${weather.windSpeed.toFixed(1)} km/h` : "--"}
              </p>
              <p className="mt-2 text-xs text-slate-600">Useful for lawn care and exterior work windows.</p>
            </motion.article>

            <motion.article variants={itemVariants} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Latest weather time</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {isLoadingWeather ? "Loading..." : weather ? new Date(weather.time).toLocaleTimeString() : "--"}
              </p>
              <p className="mt-2 text-xs text-slate-600">Auto-adjusted by location timezone.</p>
            </motion.article>
          </motion.div>

          {(locationError || weatherError) && (
            <motion.div variants={itemVariants} className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {locationError || weatherError}
            </motion.div>
          )}
        </div>
      </motion.section>

      <motion.section
        className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-sky-900 to-slate-900"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(52,211,153,0.2),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(56,189,248,0.2),transparent_38%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <motion.p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-emerald-300" variants={itemVariants}>
            What Our Customers Say
          </motion.p>
          <motion.h2 className="mt-2 text-center text-3xl font-bold text-white" variants={itemVariants}>
            Real homes. Real reviews.
          </motion.h2>

          <motion.div className="mt-8 grid gap-4 md:grid-cols-3" variants={sectionVariants}>
            {testimonials.map((review, index) => (
              <motion.article
                key={review.person}
                className="review-card rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-sm"
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -8 }}
                transition={{ type: "spring", stiffness: 180, damping: 16 }}
              >
                <p className="mb-2 text-sm text-amber-300">{"*".repeat(5)}</p>
                <p className="text-sm leading-relaxed text-sky-100">{review.quote}</p>
                <div className="mt-4">
                  <p className="text-sm font-semibold">{review.person}</p>
                  <p className="text-xs text-sky-200">{review.city}</p>
                </div>
                <motion.div
                  className="mt-3 h-1 rounded-full bg-gradient-to-r from-emerald-300/80 to-sky-300/80"
                  initial={{ width: "0%" }}
                  whileInView={{ width: `${65 + index * 12}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: index * 0.15 }}
                />
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <section className="gsap-reveal relative bg-sky-950 pb-14">
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1 h-40 w-40 -translate-x-1/2 rounded-full bg-emerald-300/30 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="mx-auto grid max-w-5xl gap-4 rounded-3xl border border-emerald-300/30 bg-gradient-to-r from-emerald-500 to-lime-500 px-6 py-6 text-white shadow-2xl shadow-emerald-700/30 md:grid-cols-[1fr_auto] md:items-center"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-100">Ready when you are</p>
            <h3 className="mt-1 text-2xl font-bold">Book online in under 60 seconds.</h3>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/booking"
                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-md transition hover:bg-emerald-50"
              >
                Book Your Service Now
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Talk to an expert
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
