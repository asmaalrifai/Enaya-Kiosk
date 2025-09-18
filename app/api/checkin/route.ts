import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { appointmentId } = await req.json();
  if (!appointmentId) return NextResponse.json({ error: "appointmentId required" }, { status: 400 });
  // TODO: when you connect real DB/Zenoti, persist this.
  return NextResponse.json({ ok: true });
}
