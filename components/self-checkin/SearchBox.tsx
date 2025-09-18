"use client";

import React from "react";
import { Search } from "lucide-react";
import { BRAND_DARK, BRAND_PRIMARY } from "@/lib/constants";

type Props = {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
  numericOnly?: boolean; // NEW
};

export default function SearchBox({
  value,
  onChange,
  label = "",
  placeholder = "05xxxxxxxx",
  numericOnly = false,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (numericOnly) v = v.replace(/\D/g, ""); // digits only
    onChange(v);
  };

  return (
    <div>
      <label className="block text-sm mb-2 font-medium" style={{ color: BRAND_DARK }}>
        {label}
      </label>
      <div className="relative">
        <input
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full rounded-2xl pl-10 pr-4 py-3 outline-none border focus:ring-4 transition"
          style={{ borderColor: `${BRAND_PRIMARY}40`, boxShadow: "none" }}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" size={18} />
      </div>
    </div>
  );
}
