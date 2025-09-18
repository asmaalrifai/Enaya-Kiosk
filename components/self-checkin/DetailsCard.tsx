/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, IdCard, Phone, Clock, MapPin, Check } from "lucide-react";
import { toast } from "sonner";
import { Customer } from "@/types";
import { BRAND_DARK, BRAND_PRIMARY } from "@/lib/constants";
import { maskPhone } from "@/lib/phone";

type Strings = {
  findBooking: string;
  selectThenCheckIn: string;
  phone: string;
  member: string;
  today: string;
  services: string;
  with: string;
  checkIn: string;
  needHelp: string;
  confirmText: string;
  needHelpMessage: string;
  alreadyCheckedIn: string; // NEW
};

type Props = {
  selected: Customer | null;
  onCheckIn: (c: Customer) => void;
  strings: Strings;
  processing?: boolean;
};

export default function DetailsCard({
  selected,
  onCheckIn,
  strings,
  processing = false,
}: Props) {
  // De-dupe upcoming items & build stable identity
  const appointments = useMemo(() => {
    const src = selected?.upcoming ?? [];
    const seen = new Set<string>();
    const out: typeof src = [];
    for (const a of src) {
      const k = (a as any).uid ?? `${a.id}|${a.time}|${a.staff ?? ""}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(a);
    }
    return out;
  }, [selected]);

  // True if any of today's appointments are already checked in
  const isAlreadyCheckedIn = (selected?.upcoming ?? []).some(
    (a) =>
      (a.status ?? "")
        .toLowerCase()
        .replace(/_/g, "") === "checkedin"
  );

  return (
    <div
      className="rounded-3xl p-5 sm:p-7 shadow-md border min-h-[340px] flex flex-col"
      style={{ borderColor: `${BRAND_DARK}20`, backgroundColor: "#fff" }}
    >
      {!selected ? (
        <div className="flex-1 grid place-items-center text-center p-8">
          <div>
            <div
              className="mx-auto h-14 w-14 rounded-2xl grid place-items-center mb-3"
              style={{ backgroundColor: `${BRAND_PRIMARY}15` }}
            >
              <IdCard size={26} style={{ color: BRAND_PRIMARY }} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: BRAND_DARK }}>
              {strings.findBooking}
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: BRAND_DARK, opacity: 0.8 }}
            >
              {strings.selectThenCheckIn}
            </p>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex-1"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  className="text-2xl font-extrabold tracking-tight"
                  style={{ color: BRAND_DARK }}
                >
                  {selected.name}
                </h2>
                <div
                  className="mt-1 flex flex-wrap items-center gap-3 text-sm"
                  style={{ color: BRAND_DARK }}
                >
                  <span className="inline-flex items-center gap-1 opacity-90">
                    <Phone size={16} /> {maskPhone(selected.phone)}
                  </span>
                  {selected.email && (
                    <span className="opacity-90">{selected.email}</span>
                  )}
                  {selected.membership && (
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: `${BRAND_PRIMARY}18`,
                        color: BRAND_PRIMARY,
                      }}
                    >
                      <CreditCard size={14} /> {selected.membership}{" "}
                      {strings.member}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              {appointments.map((a, i) => {
                const key =
                  (a as any).uid ?? `${a.id}|${a.time}|${a.staff ?? ""}|${i}`;
                return (
                  <div
                    key={key}
                    className="rounded-2xl border p-4"
                    style={{ borderColor: `${BRAND_DARK}15` }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="inline-flex items-center gap-2 text-sm font-semibold"
                        style={{ color: BRAND_DARK }}
                      >
                        <Clock size={16} /> {strings.today} • {a.time}
                      </span>
                      <span
                        className="text-[11px] rounded-full px-2 py-1"
                        style={{
                          backgroundColor: `${BRAND_PRIMARY}15`,
                          color: BRAND_PRIMARY,
                        }}
                      >
                        {a.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-3 text-sm" style={{ color: BRAND_DARK }}>
                      <div className="font-medium">{strings.services}</div>
                      <ul className="list-disc pl-5 mt-1 space-y-0.5 opacity-90">
                        {(a.services ?? []).map((s, i2) => (
                          <li key={i2}>{s}</li>
                        ))}
                      </ul>

                      {a.staff && (
                        <div className="mt-3 text-sm flex items-center gap-2 opacity-90">
                          < MapPin size={16} /> {strings.with} {a.staff}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {selected.notes && (
              <div
                className="mt-4 rounded-2xl border p-4 text-sm"
                style={{ borderColor: `${BRAND_DARK}15`, color: BRAND_DARK }}
              >
                <div className="font-semibold mb-1">Notes</div>
                <p className="opacity-90">{selected.notes}</p>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                disabled={processing || isAlreadyCheckedIn}
                className="flex-1 rounded-2xl px-5 py-3 font-semibold shadow-sm focus:ring-4 transition disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: BRAND_PRIMARY, color: "#fff" }}
                onClick={() => onCheckIn(selected!)}
              >
                <span className="inline-flex items-center gap-2">
                  <Check size={18} />
                  {isAlreadyCheckedIn
                    ? strings.alreadyCheckedIn
                    : strings.checkIn}
                </span>
              </button>
              <button
                className="rounded-2xl px-5 py-3 font-semibold border focus:ring-4 transition"
                style={{ borderColor: `${BRAND_DARK}55`, color: BRAND_DARK }}
                onClick={() => toast.warning(strings.needHelpMessage)}
              >
                {strings.needHelp}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      <div
        className="pt-6 mt-6 border-t text-[11px]"
        style={{
          borderColor: `${BRAND_DARK}15`,
          color: BRAND_DARK,
          opacity: 0.8,
        }}
      >
        {strings.confirmText}
      </div>
    </div>
  );
}
