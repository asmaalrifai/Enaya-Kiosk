// app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { BRAND_DARK, BRAND_PRIMARY } from "@/lib/constants";
import BrandPill from "@/components/self-checkin/BrandPill";
import SearchBox from "@/components/self-checkin/SearchBox";
import ResultsList from "@/components/self-checkin/ResultsList";
import DetailsCard from "@/components/self-checkin/DetailsCard";
import { Customer } from "@/types";
import { STRINGS, Lang } from "@/lib/i18n";
import { toast } from "sonner";

const PHONE_REGEX = /^05\d{8}$/; // full KSA mobile like 05XXXXXXXX

export default function Page() {
  const [lang, setLang] = useState<Lang>("en");
  const t = STRINGS[lang];

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<Customer | null>(null);

  const [processing, setProcessing] = useState(false);
  // Fetch results only when FULL phone number entered
  useEffect(() => {
    let cancel = false;

    const run = async () => {
      const q = query.trim();
      // Guard: only proceed if full phone matches the pattern
      if (!PHONE_REGEX.test(q)) {
        if (!cancel) setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/guests?query=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (!cancel) setResults(data.guests || []);
      } catch {
        if (!cancel) toast.error("Search failed");
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    const timer = setTimeout(run, 200);
    return () => {
      cancel = true;
      clearTimeout(timer);
    };
  }, [query]);

  async function onSelectGuest(c: Customer) {
    setSelected(c);
    try {
      const res = await fetch(
        `/api/appointments?guestId=${encodeURIComponent(c.id)}`
      );
      const data = await res.json();
      setSelected({ ...c, upcoming: data.appointments ?? [] });
    } catch {
      toast.error(t.fail);
    }
  }

  async function handleCheckIn(c: Customer) {
    if (processing) return;
    setProcessing(true);

    const appt = c.upcoming?.[0];
    if (!appt?.id) {
      toast.error("No appointment found");
      setProcessing(false);
      return;
    }

    // 1) Ask to pay (mock)
    const payToastId = toast.loading("Please tap your card on the reader…");
    await new Promise((r) => setTimeout(r, 3000));
    toast.success("Payment successful", { id: payToastId, duration: 1200 });

    // 2) Check-in with correct success/error handling
    try {
      await toast.promise(
        (async () => {
          const r = await fetch("/api/checkin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ appointmentId: appt.id }),
          });
          if (!r.ok) {
            // Make toast.promise use its error message
            const msg = await r.text().catch(() => "");
            throw new Error(msg || `Check-in failed (${r.status})`);
          }
          return r;
        })(),
        {
          loading: "Checking you in…",
          success: "Check-in successful. Welcome!",
          error: (e) =>
            e?.message || "Check-in failed. Please ask our staff for help.",
        }
      );

      // 3) Only runs on success
      setSelected({
        ...c,
        upcoming: (c.upcoming ?? []).map((a) => ({
          ...a,
          status: "checked_in",
        })),
      });
    } finally {
      setProcessing(false);
    }
  }

  const isRTL = lang === "ar";

  return (
    <div
      className="min-h-screen w-full p-4 bg-white"
      style={{
        backgroundColor: "#fff",
        direction: isRTL ? ("rtl" as const) : ("ltr" as const),
      }}
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 flex justify-center">
            <Image
              src="/enaya-logo.png"
              alt="Enaya Care"
              width={140}
              height={140}
              priority
            />
          </div>
          <div className="right-4 flex gap-2">
            <button
              className="px-3 py-1 rounded-xl border text-sm"
              style={{
                borderColor: `${BRAND_DARK}55`,
                color: BRAND_DARK,
                opacity: lang === "en" ? 1 : 0.6,
              }}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              className="px-3 py-1 rounded-xl border text-sm"
              style={{
                borderColor: `${BRAND_DARK}55`,
                color: BRAND_DARK,
                opacity: lang === "ar" ? 1 : 0.6,
              }}
              onClick={() => setLang("ar")}
            >
              العربية
            </button>
          </div>
        </div>

        {/* Subheader */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <p
            className="text-sm sm:text-base"
            style={{ color: BRAND_DARK, opacity: 0.8 }}
          >
            {t.welcome}
          </p>
          <BrandPill label={t.walkins} />
        </div>

        {/* Search + Results + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div
              className="rounded-3xl p-4 sm:p-5 shadow-md border"
              style={{
                borderColor: `${BRAND_DARK}20`,
                backgroundColor: "#fff",
              }}
            >
              <SearchBox
                value={query}
                // Use a phone-specific label; if you have t.enterPhone use it, otherwise t.phone
                label={t.phone}
                placeholder={
                  lang === "ar"
                    ? "05xxxxxxxx"
                    : "05xxxxxxxx"
                }
                onChange={(v) => {
                  // Optionally strip non-digits and enforce max length 10
                  const digits = v.replace(/\D/g, "").slice(0, 10);
                  // If they started without '05', optionally auto-prepend '05'
                  const normalized = digits.startsWith("05")
                    ? digits
                    : digits
                    ? `05${digits}`.slice(0, 10)
                    : "";
                  setQuery(normalized);
                  setSelected(null);
                }}
              />
              <div className="mt-4">
                <ResultsList
                  query={query}
                  loading={loading}
                  results={results}
                  onSelect={onSelectGuest}
                  onWalkIn={() => toast.info(t.continueWalkIn)}
                  onTryPhone={() => toast.info(t.tryPhone)}
                  strings={{
                    noMatch: t.noMatch,
                    continueWalkIn: t.continueWalkIn,
                    tryPhone: t.tryPhone,
                    member: t.member,
                  }}
                />
                <p
                  className="mt-3 text-[11px] leading-5"
                  style={{ color: BRAND_DARK, opacity: 0.7 }}
                >
                  {t.tip}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <DetailsCard
              selected={selected}
              onCheckIn={handleCheckIn}
              strings={{
                findBooking: t.findBooking,
                selectThenCheckIn: t.selectThenCheckIn,
                phone: t.phone,
                member: t.member,
                today: t.today,
                services: t.services,
                with: t.with,
                checkIn: t.checkIn,
                needHelp: t.needHelp,
                confirmText: t.confirmText,
                needHelpMessage: t.needHelpMessage,
              }}
            />
          </div>
        </div>

        {/* Dev notes */}
        <div
          className="mt-6 text-xs"
          style={{ color: BRAND_DARK, opacity: 0.8 }}
        >
          <details>
            <summary className="cursor-pointer">{t.devNotes}</summary>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>{t.dev1}</li>
              <li>{t.dev2}</li>
              <li>
                On Check-In, POST to <code>/api/checkin</code> with{" "}
                {"{ customerId, appointmentId }"}.
              </li>
              <li>{t.dev4}</li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}
