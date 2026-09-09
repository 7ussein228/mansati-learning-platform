import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { readDB, generateId } from "@/lib/db";
import { db } from "@/lib/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Course } from "@/lib/types";

const XPAY_SECRET_KEY = process.env.XPAY_SECRET_KEY;
const XPAY_API_URL = "https://api.xpay.app/checkout/sessions";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    const { courseId } = await request.json();
    if (!courseId) {
      return NextResponse.json(
        { error: " معرّف الكورس مطلوب" },
        { status: 400 }
      );
    }

    // Get course
    const courses = await readDB<Course>("courses");
    const course = courses.find((c) => c.id === courseId);
    if (!course) {
      return NextResponse.json(
        { error: "الكورس غير موجود" },
        { status: 404 }
      );
    }

    // Check if already purchased
    const existingPurchases = await db
      .select()
      .from(schema.purchases)
      .where(eq(schema.purchases.studentId, user.id));
    const alreadyPurchased = existingPurchases.some(
      (p) => p.courseId === courseId && p.status === "paid"
    );
    if (alreadyPurchased) {
      return NextResponse.json(
        { error: "لقد اشتريت هذا الكورس بالفعل" },
        { status: 400 }
      );
    }

    // Free course - enroll directly
    if (course.isFree || course.price === 0) {
      const enrollmentId = generateId();
      await db.insert(schema.enrollments).values({
        id: enrollmentId,
        studentId: user.id,
        courseId: course.id,
        progress: 0,
        completedLessons: [],
        enrolledAt: new Date().toISOString(),
      });

      // Update students count
      await db
        .update(schema.courses)
        .set({ studentsCount: course.studentsCount + 1 })
        .where(eq(schema.courses.id, course.id));

      return NextResponse.json({ success: true, free: true });
    }

    if (!XPAY_SECRET_KEY) {
      return NextResponse.json(
        { error: "بوابة الدفع غير مُعدّة" },
        { status: 500 }
      );
    }

    // Create purchase record
    const purchaseId = generateId();
    await db.insert(schema.purchases).values({
      id: purchaseId,
      studentId: user.id,
      courseId: course.id,
      amount: course.price,
      currency: "EGP",
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    // Create XPay Checkout Session
    const sessionRes = await fetch(XPAY_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${XPAY_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        afterCompletion: {
          type: "redirect",
          redirect: {
            url: `${BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          },
        },
        lineItems: [
          {
            priceData: {
              currency: "EGP",
              unitAmount: Math.round(course.price * 100), // Convert to piastres
              productData: {
                name: course.title,
                description: course.description,
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          purchaseId,
          courseId: course.id,
          studentId: user.id,
        },
      }),
    });

    if (!sessionRes.ok) {
      const errorData = await sessionRes.json();
      console.error("XPay error:", errorData);
      return NextResponse.json(
        { error: "حدث خطأ في إنشاء جلسة الدفع" },
        { status: 500 }
      );
    }

    const session = await sessionRes.json();

    // Update purchase with session ID
    await db
      .update(schema.purchases)
      .set({ checkoutSessionId: session.id })
      .where(eq(schema.purchases.id, purchaseId));

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع" },
      { status: 500 }
    );
  }
}
