"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Home, BookOpen, Loader2, AlertCircle } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    fetch(`/api/payments/verify?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full text-center animate-fadeIn">
        {status === "loading" && (
          <>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-3">
              جاري التحقق من الدفع...
            </h1>
            <p className="text-slate-500 text-sm">
              برجاء الانتظار حتى نتأكد من عملية الدفع
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
              تم الدفع بنجاح!
            </h1>
            <p className="text-slate-600 mb-2">
              شكراً لك! تم تسجيل دفعتك بنجاح.
            </p>
            {sessionId && (
              <p className="text-xs text-slate-400 mb-6 font-mono">
                معرّف الجلسة: {sessionId}
              </p>
            )}
            <p className="text-sm text-slate-500 mb-8">
              يمكنك الآن الوصول للكورس من لوحة التحكم.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/student/courses"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                كورساتي
              </Link>
              <Link
                href="/"
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                الرئيسية
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-3">
              جاري التحقق...
            </h1>
            <p className="text-slate-600 mb-2 text-sm">
              قد يكون الدفع قيد المعالجة. تحقق من كورساتك بعد قليل.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                href="/student/courses"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                كورساتي
              </Link>
              <Link
                href="/"
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                الرئيسية
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
