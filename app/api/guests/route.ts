import { NextRequest, NextResponse } from "next/server";
import { loadLocalCustomers } from "@/lib/localData";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("query") || "").trim();
  const customers = await loadLocalCustomers();
  if (!q) return NextResponse.json({ guests: [] });

  const isPhone = /\d/.test(q);
  const qLower = q.toLowerCase();
  const qDigits = q.replace(/\D/g, "");

  const guests = customers.filter((c) => {
    if (isPhone) {
      const phoneDigits = (c.phone || "").replace(/\D/g, "");
      return phoneDigits && phoneDigits.includes(qDigits);
    }
    return c.name.toLowerCase().includes(qLower);
  }).slice(0, 20);

  return NextResponse.json({ guests });
}
