'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Loader2, CheckCircle } from 'lucide-react';

interface BuyButtonProps {
  courseId: string;
  isFree: boolean;
  isEnrolled: boolean;
  price: number;
}

export default function BuyButton({ courseId, isFree, isEnrolled, price }: BuyButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClick = async () => {
    if (isEnrolled || isFree) {
      router.push(`/student/courses/${courseId}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ');
      }

      // Free course - enrolled directly
      if (data.free) {
        router.refresh();
        return;
      }

      // Redirect to XPay checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded-lg text-xs mb-3 text-center">
          {error}
        </div>
      )}
      <button
        onClick={handleClick}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
          isEnrolled
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : isFree
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } disabled:opacity-50`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            جاري التحميل...
          </>
        ) : isEnrolled ? (
          <>
            <CheckCircle className="w-5 h-5" />
            متابعة الكورس
          </>
        ) : isFree ? (
          'ابدأ مجاناً'
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            اشتري الآن - {price} ج.م
          </>
        )}
      </button>
    </div>
  );
}
