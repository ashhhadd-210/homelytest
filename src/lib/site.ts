export const site = {
  name: "HomelyFix",
  description:
    "Reliable home services for busy homeowners - cleaning, lawn care, and repairs from one family-owned team.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phoneDisplay: "(555) 123-4567",
  phoneHref: "tel:+15551234567",
} as const;

/** Shown on the landing page map section; adjust for your real office or service hub. */
export const businessLocation = {
  heading: "Where we are",
  paragraph1:
    "We serve homeowners across the greater Austin metro area. Our local team plans routes from our hub so visits stay on time and communication stays simple.",
  paragraph2:
    "Use the map below to see our area center. For your exact visit, we come to your address—call or book online and we will confirm your location before we head out.",
  /** Used for “Open in Google Maps” and falls back for embed if no embed URL is set */
  mapsQuery: "Austin, TX",
  lat: 30.2672,
  lng: -97.7431,
} as const;

/**
 * Google Maps embed iframe `src`. Optional: set `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` to the full embed URL
 * from Google Maps → Share → Embed a map (recommended for an exact pin).
 * Otherwise uses lat/lng from `businessLocation`.
 */
export const mapEmbedUrl =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL?.trim() ||
  `https://www.google.com/maps?q=${businessLocation.lat},${businessLocation.lng}&z=14&output=embed`;

export const mapOpenUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessLocation.mapsQuery)}`;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
  { href: "/booking", label: "Book Service" },
] as const;

export const serviceOptions = [
  { value: "cleaning", label: "Home cleaning" },
  { value: "lawn", label: "Lawn care" },
  { value: "repair", label: "Home repair" },
  { value: "bundle", label: "Multiple / bundle" },
] as const;
