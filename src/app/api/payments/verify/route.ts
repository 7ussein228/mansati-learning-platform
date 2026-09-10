import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import * as schema from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { generateId } from "@/lib/db";

const XPAY_SECRET_KEY = process.env.XPAY_SECRET_KEY;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    // Check if already processed
    const existingPurchase = await db
      .select()
      .from(schema.purchases)
      .where(eq(schema.purchases.checkoutSessionId, sessionId));

    if (existingPurchase.length > 0 && existingPurchase[0].status === "paid") {
      return NextResponse.json({ success: true, alreadyProcessed: true });
    }

    if (!XPAY_SECRET_KEY) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    // Verify session with XPay API
    const sessionRes = await fetch(
      `https://api.xpay.app/checkout/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${XPAY_SECRET_KEY}`,
        },
      }
    );

    if (!sessionRes.ok) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const session = await sessionRes.json();

    if (session.paymentStatus === "paid" || session.status === "complete") {
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

        // Check if already enrolled
        const existingEnrollment = await db
          .select()
          .from(schema.enrollments)
          .where(
            and(
              eq(schema.enrollments.studentId, studentId),
              eq(schema.enrollments.courseId, courseId)
            )
          );

        if (existingEnrollment.length === 0) {
          // Create enrollment
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

        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ success: false, status: session.paymentStatus });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
