"use client";

import { useState } from "react";
import { serviceOptions } from "@/lib/site";
import { inputClass, labelClass } from "./fieldStyles";

export function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);

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
        <p className="font-semibold">Thanks — we received your request.</p>
        <p className="mt-2 text-sm text-emerald-800">We will call you shortly to confirm details.</p>
        <button
          type="button"
          className="mt-4 text-sm font-medium text-sky-800 underline"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="qf-name">
            Name
          </label>
          <input id="qf-name" name="name" required className={inputClass} autoComplete="name" />
        </div>
        <div>
          <label className={labelClass} htmlFor="qf-email">
            Email <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <input id="qf-email" name="email" type="email" className={inputClass} autoComplete="email" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="qf-phone">
            Phone
          </label>
          <input id="qf-phone" name="phone" type="tel" required className={inputClass} autoComplete="tel" />
        </div>
        <div>
          <label className={labelClass} htmlFor="qf-address">
            Address
          </label>
          <input id="qf-address" name="address" className={inputClass} autoComplete="street-address" />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="qf-service">
          Service type
        </label>
        <select id="qf-service" name="service" required className={inputClass}>
          <option value="">Select a service</option>
          {serviceOptions.map((o) => (
            <option key={o.value} value={o.label}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass} htmlFor="qf-message">
          Message
        </label>
        <textarea id="qf-message" name="message" required rows={4} className={inputClass} />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Sending…" : "Request quote"}
      </button>
    </form>
  );
}
