"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { BRAND_DARK, BRAND_PRIMARY } from "@/lib/constants";
import BrandPill from "@/components/self-checkin/BrandPill";
import SearchBox from "@/components/self-checkin/SearchBox";
import ResultsList from "@/components/self-checkin/ResultsList";
import DetailsCard from "@/components/self-checkin/DetailsCard";
import { MOCK_CUSTOMERS } from "@/data/mockCustomers";
import { Customer } from "@/types";
import { STRINGS, Lang } from "@/lib/i18n";
// import toast from "react-hot-toast";
import { toast, Toaster } from "sonner";

export default function Page() {
  const [lang, setLang] = useState<Lang>("en"); // language state
  const t = STRINGS[lang];

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);

  // detect if query looks like phone (digits) → search phone; else name
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as Customer[];

    const looksLikePhone = /\d/.test(q);
    return MOCK_CUSTOMERS.filter((c) => {
      if (looksLikePhone) {
        const phoneDigits = (c.phone || "").replace(/\D/g, "");
        const qDigits = q.replace(/\D/g, "");
        return phoneDigits.includes(qDigits);
      }
      return c.name.toLowerCase().includes(q);
    });
  }, [query]);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, [query]);

  // fake check-in: simulate success/fail then show toast
  async function handleCheckIn(c: Customer) {
    await new Promise((r) => setTimeout(r, 400));
    const ok = Math.random() > 0.15;

    if (ok) {
      toast.success(t.success, {
        style: { background: "#A283AF", color: "#fff", fontWeight: 600 }, // brand purple
      });
      setSelected({
        ...c,
        upcoming: (c.upcoming ?? []).map((a) => ({
          ...a,
          status: "checked_in",
        })),
      });
    } else {
      toast.error(t.fail, {
        style: { background: "#646665", color: "#fff", fontWeight: 600 }, // brand dark grey
      });
    }
  }

  // RTL for Arabic
  const isRTL = lang === "ar";

  return (
    <div
      className="min-h-screen w-full p-4"
      style={{
        background: `linear-gradient(135deg, ${BRAND_PRIMARY}10, #ffffff)`,
        direction: isRTL ? ("rtl" as const) : ("ltr" as const),
      }}
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Top bar: logo left, language toggle right */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 flex justify-center">
            <Image
              src="/enaya-logo.png"
              alt="Enaya Care"
              width={140}
              height={80}
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

        {/* Subtitle row with pill */}
        <div
          className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6`}
        >
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
                label={t.enterName}
                placeholder={
                  lang === "ar"
                    ? "مثال: عائشة المنصور أو 05xxxxxxxx"
                    : "e.g., Aisha Al Mansour or 05xxxxxxxx"
                }
                onChange={(v) => {
                  setQuery(v);
                  setSelected(null);
                }}
              />
              <div className="mt-4">
                <ResultsList
                  query={query}
                  loading={loading}
                  results={results}
                  onSelect={setSelected}
                  onWalkIn={() => toast.info("Walk-in flow goes here")}
                  onTryPhone={() => toast.info("Switch to phone lookup")}
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

        {/* Developer notes */}
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
