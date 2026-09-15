'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ fontFamily: 'Cairo, system-ui, sans-serif', background: '#050813', color: '#f8fafc' }}>
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
          >
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold mb-3">حصلت مشكلة</h2>
          <p className="mb-6 max-w-md" style={{ color: '#94a3b8' }}>
            في مشكلة في تحميل الصفحة. جرّب تاني.
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #00d2ff, #9d4edd)',
              color: 'white',
            }}
          >
            حاول تاني
          </button>
        </div>
      </body>
    </html>
  );
}
