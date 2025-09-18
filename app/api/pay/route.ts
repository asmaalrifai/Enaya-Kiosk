// app/api/pay/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // You can read { appointmentId, amount } if you want
  // const { appointmentId, amount } = await req.json().catch(() => ({}));

  // Simulate processing latency
  await new Promise((r) => setTimeout(r, 400));

  // Always "success" for now
  return NextResponse.json({
    ok: true,
    paymentId: `pay_${Date.now()}`,
    status: "succeeded",
  });
}
