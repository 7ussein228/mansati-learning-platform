"use client";
import { useState } from "react";

export default function PaymentButton({ courseId, price, title }: { courseId: string; price: number; title: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/payment/xpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price,
          currency: "EGP",
          description: `اشتراك كورس ${title}`,
          courseId,
          studentId: "demo-student",
          callbackUrl: `${window.location.origin}/payment/callback`,
        }),
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setError(data.error || "حدث خطأ أثناء إنشاء عملية الدفع");
      }
    } catch {
      setError("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full h-12 rounded-full bg-[#FFB800] text-[#00235b] font-black hover:bg-[#FFCC33] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-[#00235b] border-t-transparent rounded-full animate-spin" />
            جاري التحويل للدفع...
          </>
        ) : (
          <>
            اشترك الآن — {price.toLocaleString("ar-EG")} جنيه
            <span>←</span>
          </>
        )}
      </button>
      {error && (
        <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-2 text-center">
          {error}
        </div>
      )}
    </div>
  );
}