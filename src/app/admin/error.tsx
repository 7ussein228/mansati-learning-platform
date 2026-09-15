'use client';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
      >
        <span className="text-3xl">⚠️</span>
      </div>
      <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-pure)' }}>
        حصلت مشكلة
      </h2>
      <p className="mb-6 max-w-md" style={{ color: 'var(--text-dim)' }}>
        في مشكلة في تحميل الصفحة. جرّب تاني.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl font-bold transition"
          style={{
            background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
            color: 'white',
          }}
        >
          حاول تاني
        </button>
        <a
          href="/admin"
          className="px-6 py-3 rounded-xl font-bold transition"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-plasma)',
            color: 'var(--text-pure)',
          }}
        >
          الصفحة الرئيسية
        </a>
      </div>
    </div>
  );
}
