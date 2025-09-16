import React from "react";
import { Users } from "lucide-react";
import { BRAND_PRIMARY } from "@/lib/constants";

export default function BrandPill({ label = "Walk-ins Welcome" }: { label?: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 shadow-sm"
      style={{ backgroundColor: BRAND_PRIMARY, color: "#fff" }}
    >
      <Users size={18} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
