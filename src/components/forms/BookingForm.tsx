"use client";

import { useEffect, useRef, useState } from "react";
import { serviceOptions } from "@/lib/site";
import { inputClass, labelClass } from "./fieldStyles";

type LatLng = { lat: number; lng: number };

type GoogleMapApi = {
  maps: {
    Map: new (el: HTMLElement, options: Record<string, unknown>) => {
      addListener: (eventName: string, handler: (event: unknown) => void) => void;
      setCenter: (latLng: LatLng) => void;
      setZoom: (zoom: number) => void;
    };
    Marker: new (options: Record<string, unknown>) => {
      setPosition: (latLng: LatLng) => void;
      getPosition: () => { lat: () => number; lng: () => number } | null;
      addListener: (eventName: string, handler: () => void) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleMapApi;
  }
}

export function BookingForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const missingMapsApiKey = !mapsApiKey;
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<{
    map: { setCenter: (latLng: LatLng) => void; setZoom: (zoom: number) => void };
    marker: { setPosition: (latLng: LatLng) => void };
  } | null>(null);

  useEffect(() => {
    if (!mapsApiKey) return;

    function initMap() {
      if (!window.google || !mapRef.current || mapInstanceRef.current) return;
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 29.7604, lng: -95.3698 },
        zoom: 11,
        streetViewControl: false,
        mapTypeControl: false,
      });
      const marker = new window.google.maps.Marker({
        position: { lat: 29.7604, lng: -95.3698 },
        map,
        draggable: true,
      });

      map.addListener("click", (event) => {
        const e = event as { latLng?: { lat: () => number; lng: () => number } };
        if (!e.latLng) return;
        const next = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        marker.setPosition(next);
        setSelectedLocation(next);
      });

      marker.addListener("dragend", () => {
        const position = marker.getPosition();
        if (!position) return;
        setSelectedLocation({ lat: position.lat(), lng: position.lng() });
      });

      mapInstanceRef.current = { map, marker };
    }

    if (window.google) {
      initMap();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      "script[data-google-maps-loader='true']",
    );
    if (existingScript) {
      existingScript.addEventListener("load", initMap);
      return () => existingScript.removeEventListener("load", initMap);
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsLoader = "true";
    script.addEventListener("load", initMap);
    script.addEventListener("error", () => {
      setLocationError("Failed to load Google Maps. Please check your API key.");
    });
    document.head.appendChild(script);

    return () => script.removeEventListener("load", initMap);
  }, [mapsApiKey]);

  function useCurrentLocation() {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = { lat: position.coords.latitude, lng: position.coords.longitude };
        setSelectedLocation(next);
        mapInstanceRef.current?.marker.setPosition(next);
        mapInstanceRef.current?.map.setCenter(next);
        mapInstanceRef.current?.map.setZoom(15);
      },
      (geoError) => {
        setLocationError(geoError.message || "Could not access your current location.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const form = e.currentTarget;
    await new Promise((resolve) => setTimeout(resolve, 250));
    setStatus("ok");
    form.reset();
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-6 text-center text-emerald-900">
        <p className="font-semibold">Booking request received.</p>
        <p className="mt-2 text-sm text-emerald-800">
          We will confirm your date and time by phone or email shortly.
        </p>
        <button
          type="button"
          className="mt-4 text-sm font-medium text-sky-800 underline"
          onClick={() => setStatus("idle")}
        >
          Book another visit
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="bk-name">
            Name
          </label>
          <input id="bk-name" name="name" required className={inputClass} autoComplete="name" />
        </div>
        <div>
          <label className={labelClass} htmlFor="bk-email">
            Email
          </label>
          <input id="bk-email" name="email" type="email" required className={inputClass} autoComplete="email" />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="bk-phone">
          Phone
        </label>
        <input id="bk-phone" name="phone" type="tel" required className={inputClass} autoComplete="tel" />
      </div>
      <div>
        <label className={labelClass} htmlFor="bk-service">
          Service
        </label>
        <select id="bk-service" name="service" required className={inputClass}>
          <option value="">Select a service</option>
          {serviceOptions.map((o) => (
            <option key={o.value} value={o.label}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass} htmlFor="bk-when">
          Preferred date &amp; time
        </label>
        <input id="bk-when" name="requestedAt" type="datetime-local" required className={inputClass} />
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between gap-3">
          <label className={labelClass} htmlFor="bk-location">
            Location on map
          </label>
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={missingMapsApiKey}
            className="text-xs font-semibold text-sky-700 hover:underline"
          >
            Use my current location
          </button>
        </div>
        <div
          ref={mapRef}
          className="h-64 w-full rounded-xl border border-slate-200"
          aria-label="Google map location picker"
        />
        <input
          id="bk-location"
          className={`${inputClass} mt-3`}
          value={
            selectedLocation
              ? `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
              : ""
          }
          placeholder="Click map or use current location"
          readOnly
        />
        <input
          type="hidden"
          name="location"
          value={selectedLocation ? `${selectedLocation.lat},${selectedLocation.lng}` : ""}
        />
        {missingMapsApiKey ? (
          <p className="mt-2 text-sm text-red-600">
            Map is unavailable because NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing.
          </p>
        ) : null}
        {locationError ? <p className="mt-2 text-sm text-red-600">{locationError}</p> : null}
      </div>
      <div>
        <label className={labelClass} htmlFor="bk-notes">
          Notes <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <textarea id="bk-notes" name="notes" rows={3} className={inputClass} />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Submitting…" : "Submit booking request"}
      </button>
    </form>
  );
}
