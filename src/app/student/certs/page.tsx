import Link from 'next/link';
import { Award, Download, Calendar, CheckCircle2, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

const certs = [
  {
    id: 'cert1',
    courseName: 'أساسيات الفيزياء - المرحلة الثانوية',
    date: '2025-01-15',
    grade: 'ممتاز',
    score: 94,
  },
  {
    id: 'cert2',
    courseName: 'الكيمياء العضوية',
    date: '2024-12-20',
    grade: 'جيد جداً',
    score: 85,
  },
];

export default function StudentCertificates() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--text-pure)' }}>الشهادات</h1>
          <p className="mt-1" style={{ color: 'var(--text-dim)' }}>شهاداتك المعتمدة من المنصة</p>
        </div>
      </div>

      {certs.length === 0 ? (
        <div
          className="p-12 text-center"
          style={{
            background: 'var(--card-glass)',
            border: '1px solid var(--border-plasma)',
            borderRadius: '20px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <Award className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-dim)' }} />
          <h3 className="font-bold mb-2" style={{ color: 'var(--text-pure)' }}>لا توجد شهادات بعد</h3>
          <p className="mb-4" style={{ color: 'var(--text-dim)' }}>أكمل الكورسات واحصل على شهادات معتمدة</p>
          <Link href="/student/courses" className="inline-flex items-center gap-2 font-bold" style={{ color: 'var(--neon-blue)' }}>
            <ArrowLeft className="w-4 h-4" />
            تصفح الكورسات
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="p-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,190,11,0.1), var(--card-glass))',
                border: '1px solid rgba(255,190,11,0.3)',
                borderRadius: '20px',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="absolute top-4 left-4 w-14 h-14 rounded-full blur-xl" style={{ background: 'rgba(255,190,11,0.15)' }} />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl" style={{ background: 'rgba(255,190,11,0.1)' }} />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, var(--atom-gold), #e6a800)' }}
                  >
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div
                      className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(0,245,212,0.15)', color: 'var(--neon-green)' }}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      معتمدة
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold mb-1" style={{ color: 'var(--text-pure)' }}>
                  شهادة إتمام
                </h3>
                <p className="font-bold mb-4" style={{ color: 'var(--text-dim)' }}>{cert.courseName}</p>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-dim)' }}>
                    <span>التقدير:</span>
                    <span className="font-bold" style={{ color: 'var(--text-pure)' }}>{cert.grade}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: 'var(--atom-gold)', color: 'white' }}
                    >
                      {cert.score}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-dim)' }}>
                    <Calendar className="w-4 h-4" />
                    <span>تاريخ الإصدار: {new Date(cert.date).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>

                <button
                  className="w-full py-2.5 font-bold rounded-xl transition flex items-center justify-center gap-2"
                  style={{ background: 'var(--atom-gold)', color: 'white' }}
                >
                  <Download className="w-4 h-4" />
                  تحميل الشهادة (PDF)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
