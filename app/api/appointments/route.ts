import { NextRequest, NextResponse } from "next/server";
import { loadLocalCustomers } from "@/lib/localData";

export async function GET(req: NextRequest) {
  const guestId = req.nextUrl.searchParams.get("guestId");
  if (!guestId) return NextResponse.json({ error: "guestId required" }, { status: 400 });

  const customers = await loadLocalCustomers();
  const guest = customers.find((c) => c.id === guestId);
  const appointments = guest?.upcoming ?? [];
  return NextResponse.json({ appointments });
}
