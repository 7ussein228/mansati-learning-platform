'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Quiz, Course } from '@/lib/types';
import { Plus, Edit3, Trash2, FileQuestion, Clock, Award } from 'lucide-react';
import { useState } from 'react';

interface Props {
  quizzes: Quiz[];
  courses: Course[];
}

export default function AdminQuizzesClient({ quizzes, courses }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الاختبار؟')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/quizzes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('حدث خطأ أثناء الحذف');
      }
    } catch {
      alert('حدث خطأ أثناء الحذف');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--text-pure)' }}>إدارة الاختبارات</h1>
          <p className="mt-1" style={{ color: 'var(--text-dim)' }}>إدارة جميع اختبارات المنصة ({quizzes.length})</p>
        </div>
        <Link
          href="/admin/quizzes/new"
          className="text-white px-4 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,210,255,0.3)]"
          style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' }}
        >
          <Plus className="w-4 h-4" />
          إضافة اختبار
        </Link>
      </div>

      <div
        style={{
          background: 'var(--card-glass)',
          border: '1px solid var(--border-plasma)',
          borderRadius: '20px',
          backdropFilter: 'blur(16px)',
        }}
        className="overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-right text-xs" style={{ background: 'rgba(0,210,255,0.08)' }}>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>الاختبار</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>الكورس</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>الأسئلة</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>المدة</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>النقاط</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((q, i) => {
                const course = courses.find((c) => c.id === q.courseId);
                const totalPoints = q.questions.reduce((s, qq) => s + qq.points, 0);
                return (
                  <tr
                    key={q.id}
                    className="transition-all duration-300 hover:shadow-[inset_0_0_20px_rgba(0,210,255,0.05)]"
                    style={{
                      background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                      borderTop: '1px solid var(--border-plasma)',
                    }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(0,210,255,0.15)' }}
                        >
                          <FileQuestion className="w-5 h-5" style={{ color: 'var(--neon-blue)' }} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm line-clamp-1" style={{ color: 'var(--text-pure)' }}>{q.title}</div>
                          <div className="text-xs line-clamp-1" style={{ color: 'var(--text-dim)' }}>{q.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm" style={{ color: 'var(--text-dim)' }}>{course?.title || '---'}</td>
                    <td className="p-4 text-sm font-medium" style={{ color: 'var(--text-dim)' }}>{q.questions.length}</td>
                    <td className="p-4 text-sm flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
                      <Clock className="w-3.5 h-3.5" />
                      {q.duration} د
                    </td>
                    <td className="p-4 text-sm flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
                      <Award className="w-3.5 h-3.5" />
                      {totalPoints}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/student/quizzes/${q.id}`}
                          className="p-2 rounded-lg transition-all duration-300"
                          style={{ color: 'var(--text-dim)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--neon-blue)'; e.currentTarget.style.background = 'rgba(0,210,255,0.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent'; }}
                          title="عرض"
                        >
                          <FileQuestion className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/quizzes/${q.id}/edit`}
                          className="p-2 rounded-lg transition-all duration-300"
                          style={{ color: 'var(--text-dim)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--atom-gold)'; e.currentTarget.style.background = 'rgba(255,190,11,0.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent'; }}
                          title="تعديل"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(q.id)}
                          disabled={deleting === q.id}
                          className="p-2 rounded-lg transition-all duration-300 disabled:opacity-50"
                          style={{ color: 'var(--text-dim)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#ff5050'; e.currentTarget.style.background = 'rgba(255,80,80,0.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent'; }}
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {quizzes.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center" style={{ color: 'var(--text-dim)' }}>
                    <FileQuestion className="w-12 h-12 mx-auto mb-2" style={{ color: 'rgba(148,163,184,0.3)' }} />
                    <p>لا توجد اختبارات بعد.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
