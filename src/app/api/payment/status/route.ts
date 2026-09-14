import { NextRequest, NextResponse } from "next/server";

const XPAY_BASE_URL = process.env.XPAY_BASE_URL || "https://api.test.xpaycheckout.com";
const XPAY_API_KEY = process.env.XPAY_API_KEY || "";
const XPAY_SECRET_KEY = process.env.XPAY_SECRET_KEY || "";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const intentId = searchParams.get("intentId");

    if (!intentId) {
      return NextResponse.json({ error: "Missing intentId parameter" }, { status: 400 });
    }

    const response = await fetch(`${XPAY_BASE_URL}/v1/payments/${intentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${XPAY_API_KEY}`,
        "X-Secret-Key": XPAY_SECRET_KEY,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Failed to check payment status" }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      status: data.status,
      intentId: data.xIntentId || data.intentId,
      amount: data.amount,
      currency: data.currency,
    });
  } catch (error) {
    console.error("XPay status check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}