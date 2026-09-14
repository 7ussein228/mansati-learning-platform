"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function CallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [intentId, setIntentId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("xpay_intent_id") || searchParams.get("intentId");
    setIntentId(id);

    if (id) {
      fetch(`/api/payment/status?intentId=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.status === "SUCCESS") {
            setStatus("success");
          } else {
            setStatus("failed");
          }
        })
        .catch(() => setStatus("failed"));
    } else {
      setStatus("failed");
    }
  }, [searchParams]);

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center">
      {status === "loading" && (
        <>
          <div className="w-16 h-16 border-4 border-[#00235b] border-t-transparent rounded-full animate-spin mx-auto" />
          <h1 className="text-xl font-black text-[#00235b] mt-6">جاري التحقق من الدفع...</h1>
          <p className="text-gray-500 text-sm mt-2">لحظات وسيتم تأكيد عملية الدفع</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl mx-auto">
            ✓
          </div>
          <h1 className="text-xl font-black text-emerald-700 mt-6">تم الدفع بنجاح!</h1>
          <p className="text-gray-500 text-sm mt-2">تم تفعيل الكورس بنجاح. يمكنك البدء في المشاهدة الآن.</p>
          {intentId && (
            <p className="text-xs text-gray-400 mt-2">رقم المعاملة: {intentId}</p>
          )}
          <Link
            href="/courses"
            className="mt-6 inline-flex bg-[#00235b] text-white px-8 py-3 rounded-full font-bold hover:bg-[#001a44] transition"
          >
            الذهاب للكورسات
          </Link>
        </>
      )}

      {status === "failed" && (
        <>
          <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center text-3xl mx-auto">
            ✗
          </div>
          <h1 className="text-xl font-black text-red-700 mt-6">فشل عملية الدفع</h1>
          <p className="text-gray-500 text-sm mt-2">حدث خطأ أثناء عملية الدفع. يرجى المحاولة مرة أخرى.</p>
          <div className="flex gap-3 mt-6 justify-center">
            <Link
              href="/courses"
              className="bg-[#00235b] text-white px-6 py-3 rounded-full font-bold hover:bg-[#001a44] transition"
            >
              المحاولة مرة أخرى
            </Link>
            <Link
              href="/"
              className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition"
            >
              الرئيسية
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function PaymentCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Suspense fallback={
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 border-4 border-[#00235b] border-t-transparent rounded-full animate-spin mx-auto" />
          <h1 className="text-xl font-black text-[#00235b] mt-6">جاري التحميل...</h1>
        </div>
      }>
        <CallbackContent />
      </Suspense>
    </div>
  );
}