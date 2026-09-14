import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, data } = body;

    console.log("XPay webhook received:", { event, data });

    if (event === "intent.success") {
      const { xIntentId, metadata } = data;
      const { courseId, studentId } = metadata || {};

      console.log("Payment successful:", { xIntentId, courseId, studentId });

      return NextResponse.json({ success: true, message: "Payment processed" });
    }

    if (event === "intent.failed") {
      const { xIntentId, metadata } = data;
      console.log("Payment failed:", { xIntentId, metadata });

      return NextResponse.json({ success: true, message: "Failure recorded" });
    }

    return NextResponse.json({ success: true, message: "Event acknowledged" });
  } catch (error) {
    console.error("XPay webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}