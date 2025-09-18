/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { loadLocalCustomers } from "@/lib/localData";

const FULL_SA_PHONE = /^05\d{8}$/; // exactly 10 digits starting with 05

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("query") || "").trim();

  // Only accept full KSA phone numbers; otherwise return empty
  if (!FULL_SA_PHONE.test(q)) {
    return NextResponse.json({ guests: [] });
  }

  const customers = await loadLocalCustomers();

  // Normalize to digits in case source has formatting
  const qDigits = q.replace(/\D/g, "");

  const guests = customers
    .filter((c: any) => {
      const phoneDigits = String(c.phone || "").replace(/\D/g, "");
      return phoneDigits === qDigits; // exact match only
    })
    .slice(0, 20);

  return NextResponse.json({ guests });
}
