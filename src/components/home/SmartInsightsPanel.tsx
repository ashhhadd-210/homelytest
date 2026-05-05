"use client";

import { useEffect, useMemo, useState } from "react";

type Coordinates = { lat: number; lng: number };
type WeatherSnapshot = { temperature: number; windSpeed: number; weatherCode: number; time: string };

const MAX_RETRY_ATTEMPTS = 2;
const RETRY_DELAY_MS = 400;

const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

async function withRetry<T>(task: () => Promise<T | null>, attempts = MAX_RETRY_ATTEMPTS): Promise<T | null> {
  for (let i = 1; i <= attempts; i += 1) {
    const result = await task();
    if (result !== null) return result;
    if (i < attempts) await sleep(RETRY_DELAY_MS * i);
  }
  return null;
}

const weatherCodeLabel: Record<number, string> = {
  0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Rime fog",
  51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  56: "Freezing drizzle", 57: "Heavy freezing drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain",
  66: "Freezing rain", 67: "Heavy freezing rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
  80: "Rain showers", 81: "Heavy rain showers", 82: "Violent rain showers",
  85: "Snow showers", 86: "Heavy snow showers",
  95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Severe thunderstorm with hail",
};

export function SmartInsightsPanel() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [locationSource, setLocationSource] = useState<string>("Resolving location...");
  const [locationLabel, setLocationLabel] = useState<string>("Detecting your city");
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [weatherError, setWeatherError] = useState<string>("");
  const [isLoadingGeo, setIsLoadingGeo] = useState<boolean>(true);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const googleGeolocationApiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOLOCATION_API_KEY;

  useEffect(() => {
    const resolveGeoFromBrowser = (): Promise<{ coords: Coordinates; source: string } | null> =>
      new Promise((resolve) => {
        if (typeof window === "undefined" || !("geolocation" in navigator)) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (p) => resolve({ coords: { lat: p.coords.latitude, lng: p.coords.longitude }, source: "Browser Geolocation API" }),
          () => resolve(null),
          { timeout: 7000, enableHighAccuracy: false, maximumAge: 60000 },
        );
      });

    const resolveGeoFromGoogle = async (): Promise<{ coords: Coordinates; source: string } | null> => {
      if (!googleGeolocationApiKey) return null;
      try {
        const r = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${googleGeolocationApiKey}`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ considerIp: true }),
        });
        if (!r.ok) return null;
        const d = (await r.json()) as { location?: { lat?: number; lng?: number } };
        if (typeof d.location?.lat !== "number" || typeof d.location?.lng !== "number") return null;
        return { coords: { lat: d.location.lat, lng: d.location.lng }, source: "Google Maps Geolocation API" };
      } catch { return null; }
    };

    const resolveGeoFromIp = async (): Promise<{ coords: Coordinates; source: string; cityLabel: string } | null> => {
      try {
        const r = await fetch("https://ipapi.co/json/");
        if (!r.ok) return null;
        const d = (await r.json()) as { latitude?: number; longitude?: number; city?: string; region?: string };
        if (typeof d.latitude !== "number" || typeof d.longitude !== "number") return null;
        const cityLabel = d.city && d.region ? `${d.city}, ${d.region}` : d.city ?? "Your current region";
        return { coords: { lat: d.latitude, lng: d.longitude }, source: "IP Geolocation API", cityLabel };
      } catch { return null; }
    };

    const run = async () => {
      setIsLoadingGeo(true);
      setLocationError("");
      const browserGeo = await withRetry(resolveGeoFromBrowser);
      if (browserGeo) {
        setCoords(browserGeo.coords); setLocationSource(browserGeo.source);
        setLocationLabel("Precise device location"); setIsLoadingGeo(false); return;
      }
      const googleGeo = await withRetry(resolveGeoFromGoogle);
      if (googleGeo) {
        setCoords(googleGeo.coords); setLocationSource(googleGeo.source);
        setLocationLabel("Network-based location"); setIsLoadingGeo(false); return;
      }
      const ipGeo = await withRetry(resolveGeoFromIp);
      if (ipGeo) {
        setCoords(ipGeo.coords); setLocationSource(ipGeo.source);
        setLocationLabel(ipGeo.cityLabel); setIsLoadingGeo(false); return;
      }
      setLocationError("Unable to detect location from browser, Google, or IP services.");
      setLocationSource("Location unavailable");
      setIsLoadingGeo(false);
    };
    void run();
  }, [googleGeolocationApiKey]);

  useEffect(() => {
    if (!coords) return;
    const fetchWeather = async () => {
      setIsLoadingWeather(true);
      setWeatherError("");
      const data = await withRetry<{ temperature_2m: number; wind_speed_10m: number; weather_code: number; time: string }>(async () => {
        try {
          const r = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto`,
          );
          if (!r.ok) return null;
          const d = (await r.json()) as { current?: { temperature_2m?: number; wind_speed_10m?: number; weather_code?: number; time?: string } };
          if (
            typeof d.current?.temperature_2m !== "number" ||
            typeof d.current?.wind_speed_10m !== "number" ||
            typeof d.current?.weather_code !== "number" ||
            typeof d.current?.time !== "string"
          ) return null;
          return { temperature_2m: d.current.temperature_2m, wind_speed_10m: d.current.wind_speed_10m, weather_code: d.current.weather_code, time: d.current.time };
        } catch { return null; }
      });
      if (!data) {
        setWeatherError("Weather data could not be loaded for your detected location.");
        setIsLoadingWeather(false);
        return;
      }
      setWeather({ temperature: data.temperature_2m, windSpeed: data.wind_speed_10m, weatherCode: data.weather_code, time: data.time });
      setIsLoadingWeather(false);
    };
    void fetchWeather();
  }, [coords]);

  const weatherSummary = useMemo(() => {
    if (!weather) return "Live weather data will appear once location is available.";
    return weatherCodeLabel[weather.weatherCode] ?? "Current conditions";
  }, [weather]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50 p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Smart Local Insights</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
        Weather + geolocation powered service planning
      </h2>
      <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
        We combine Browser Geolocation API, Google Maps Geolocation API, and IP Geolocation API to estimate your area, then load live weather to better plan timing and staffing.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Detected area</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{locationLabel}</p>
          <p className="mt-2 text-xs text-slate-600">{isLoadingGeo ? "Resolving..." : locationSource}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Temperature</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {isLoadingWeather ? "Loading..." : weather ? `${weather.temperature.toFixed(1)} C` : "--"}
          </p>
          <p className="mt-2 text-xs text-slate-600">{weatherSummary}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Wind speed</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {isLoadingWeather ? "Loading..." : weather ? `${weather.windSpeed.toFixed(1)} km/h` : "--"}
          </p>
          <p className="mt-2 text-xs text-slate-600">Useful for lawn care and exterior work windows.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Latest weather time</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {isLoadingWeather ? "Loading..." : weather ? new Date(weather.time).toLocaleTimeString() : "--"}
          </p>
          <p className="mt-2 text-xs text-slate-600">Auto-adjusted by location timezone.</p>
        </article>
      </div>
      {(locationError || weatherError) && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {locationError || weatherError}
        </div>
      )}
    </div>
  );
}
