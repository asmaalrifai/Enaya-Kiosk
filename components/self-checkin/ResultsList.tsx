"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Loader2 } from "lucide-react";
import { Customer } from "@/types";
import { BRAND_DARK, BRAND_PRIMARY } from "@/lib/constants";
import { highlight } from "@/lib/highlight";
import { maskPhone } from "@/lib/phone";

type Strings = {
  noMatch: string;
  continueWalkIn: string;
  tryPhone: string;
  member: string;
};

type Props = {
  query: string;
  loading: boolean;
  results?: Customer[];
  onSelect: (c: Customer) => void;
  onWalkIn: () => void;
  onTryPhone: () => void;
  strings: Strings;
};

export default function ResultsList({
  query,
  loading,
  results = [],
  onSelect,
  onWalkIn,
  onTryPhone,
  strings,
}: Props) {
  return (
    <>
      <AnimatePresence initial={false}>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm" style={{ color: BRAND_DARK }}>
            <Loader2 className="animate-spin" size={16} /> Searching…
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="mt-2 max-h-72 overflow-auto divide-y" style={{ borderColor: `${BRAND_DARK}10` }}>
        {query && results.length === 0 && !loading && (
          <li className="py-6 text-center text-sm" style={{ color: BRAND_DARK }}>
            {strings.noMatch}
            <div className="mt-3 flex flex-col gap-2">
              <button className="rounded-xl px-4 py-2 text-sm font-medium border"
                      style={{ borderColor: BRAND_PRIMARY, color: BRAND_PRIMARY }}
                      onClick={onWalkIn}>
                {strings.continueWalkIn}
              </button>
              <button className="rounded-xl px-4 py-2 text-sm font-medium border"
                      style={{ borderColor: `${BRAND_DARK}55`, color: BRAND_DARK }}
                      onClick={onTryPhone}>
                {strings.tryPhone}
              </button>
            </div>
          </li>
        )}

        {results.map((c) => (
          <li key={c.id}>
            <button className="w-full text-left p-3 hover:bg-gray-50 focus:bg-gray-50 transition flex items-center gap-3"
                    onClick={() => onSelect(c)}>
              <div className="h-10 w-10 rounded-2xl grid place-items-center" style={{ backgroundColor: `${BRAND_PRIMARY}15` }}>
                <User size={18} style={{ color: BRAND_PRIMARY }} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: BRAND_DARK }}>
                  {highlight(c.name, query)}
                </div>
                <div className="text-xs opacity-80" style={{ color: BRAND_DARK }}>
                  {maskPhone(c.phone)}{c.membership ? ` • ${c.membership} ${strings.member}` : ""}
                </div>
              </div>
              <div className="text-xs font-medium rounded-full px-2 py-1"
                   style={{ backgroundColor: `${BRAND_PRIMARY}20`, color: BRAND_PRIMARY }}>
                {c.upcoming?.[0]?.time ?? "—"}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
