import { NextRequest, NextResponse } from "next/server";

const XPAY_BASE_URL = process.env.XPAY_BASE_URL || "https://api.test.xpaycheckout.com";
const XPAY_API_KEY = process.env.XPAY_API_KEY || "";
const XPAY_SECRET_KEY = process.env.XPAY_SECRET_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency, description, courseId, studentId, callbackUrl } = body;

    if (!amount || !currency || !courseId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const payload = {
      amount: amount * 100,
      currency,
      description: description || `اشتراك كورس ${courseId}`,
      customer: {
        id: studentId || "guest",
        email: body.email || "",
        name: body.name || "",
        phone: body.phone || "",
      },
      metadata: {
        courseId,
        studentId: studentId || "guest",
      },
      callbackUrl: callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
      redirectUrl: callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
    };

    const response = await fetch(`${XPAY_BASE_URL}/v1/payments/create-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${XPAY_API_KEY}`,
        "X-Secret-Key": XPAY_SECRET_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Payment creation failed" }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      paymentUrl: data.fwdUrl || data.paymentUrl,
      intentId: data.xIntentId || data.intentId,
      status: data.status,
    });
  } catch (error) {
    console.error("XPay payment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}