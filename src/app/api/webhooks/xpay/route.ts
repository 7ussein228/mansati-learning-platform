import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/db";
import crypto from "node:crypto";

const XPAY_WEBHOOK_SECRET = process.env.XPAY_WEBHOOK_SECRET;

function verifyWebhook(rawBody: string, header: string, secret: string): boolean {
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=")));
  const timestamp = parts.t;
  const signature = parts.v1;

  if (!timestamp || !signature) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("XPay-Signature");

    if (!signature || !XPAY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!verifyWebhook(rawBody, signature, XPAY_WEBHOOK_SECRET)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // Handle successful payment
    if (
      (event.type === "checkout.session.completed" ||
        event.type === "checkout.session.async_payment_succeeded") &&
      event.data.object.paymentStatus === "paid"
    ) {
      const session = event.data.object;
      const metadata = session.metadata || {};
      const { purchaseId, courseId, studentId } = metadata;

      if (purchaseId && courseId && studentId) {
        // Update purchase status
        await db
          .update(schema.purchases)
          .set({
            status: "paid",
            paymentIntentId: session.paymentIntent?.id || null,
          })
          .where(eq(schema.purchases.id, purchaseId));

        // Create enrollment
        const existingEnrollment = await db
          .select()
          .from(schema.enrollments)
          .where(eq(schema.enrollments.studentId, studentId));

        const alreadyEnrolled = existingEnrollment.some(
          (e) => e.courseId === courseId
        );

        if (!alreadyEnrolled) {
          await db.insert(schema.enrollments).values({
            id: generateId(),
            studentId,
            courseId,
            progress: 0,
            completedLessons: [],
            enrolledAt: new Date().toISOString(),
          });

          // Update course students count
          const courses = await db
            .select()
            .from(schema.courses)
            .where(eq(schema.courses.id, courseId));

          if (courses[0]) {
            await db
              .update(schema.courses)
              .set({ studentsCount: (courses[0].studentsCount || 0) + 1 })
              .where(eq(schema.courses.id, courseId));
          }
        }

        console.log(`Payment confirmed for purchase ${purchaseId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
