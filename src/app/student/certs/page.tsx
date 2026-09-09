import Link from 'next/link';
import { Award, Download, Calendar, CheckCircle2, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Demo certificates
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
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">الشهادات</h1>
          <p className="text-slate-500 mt-1">شهاداتك المعتمدة من المنصة</p>
        </div>
      </div>

      {certs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-900 mb-2">لا توجد شهادات بعد</h3>
          <p className="text-slate-500 mb-4">أكمل الكورسات واحصل على شهادات معتمدة</p>
          <Link href="/student/courses" className="inline-flex items-center gap-2 text-blue-600 font-bold">
            <ArrowLeft className="w-4 h-4" />
            تصفح الكورسات
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="bg-gradient-to-bl from-yellow-50 via-white to-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 relative overflow-hidden shadow-sm"
            >
              <div className="absolute top-4 left-4 w-14 h-14 bg-yellow-400/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl" />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      معتمدة
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 mb-1">
                  شهادة إتمام
                </h3>
                <p className="text-slate-700 font-bold mb-4">{cert.courseName}</p>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-slate-500">التقدير:</span>
                    <span className="font-bold text-slate-900">{cert.grade}</span>
                    <span className="text-xs bg-yellow-400 text-slate-900 px-2 py-0.5 rounded-full font-bold">
                      {cert.score}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>تاريخ الإصدار: {new Date(cert.date).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-xl transition flex items-center justify-center gap-2">
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
