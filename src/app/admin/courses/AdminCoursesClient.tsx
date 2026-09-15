'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Course } from '@/lib/types';
import { Plus, Edit3, Trash2, BookOpen, Eye } from 'lucide-react';
import { useState } from 'react';

interface Props {
  courses: Course[];
}

export default function AdminCoursesClient({ courses }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكورس؟')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
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
          <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--text-pure)' }}>إدارة الكورسات</h1>
          <p className="mt-1" style={{ color: 'var(--text-dim)' }}>إدارة جميع الكورسات على المنصة ({courses.length})</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="text-white px-4 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,210,255,0.3)]"
          style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' }}
        >
          <Plus className="w-4 h-4" />
          إضافة كورس جديد
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
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>الكورس</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>التصنيف</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>الدروس</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>الطلاب</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>السعر</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c, i) => (
                <tr
                  key={c.id}
                  className="transition-all duration-300 hover:shadow-[inset_0_0_20px_rgba(0,210,255,0.05)]"
                  style={{
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                    borderTop: '1px solid var(--border-plasma)',
                  }}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
                        style={{
                          backgroundImage: `linear-gradient(135deg, rgba(0,210,255,0.3), rgba(157,78,221,0.4)), url(${c.image})`,
                        }}
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-sm line-clamp-1" style={{ color: 'var(--text-pure)' }}>{c.title}</div>
                        {c.isFree && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                            style={{ background: 'rgba(0,245,212,0.15)', color: 'var(--neon-green)' }}
                          >
                            مجاني
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className="inline-block text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(0,210,255,0.15)', color: 'var(--neon-blue)' }}
                    >
                      {c.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium" style={{ color: 'var(--text-dim)' }}>{c.lessons.length}</td>
                  <td className="p-4 text-sm font-medium" style={{ color: 'var(--text-dim)' }}>
                    {c.studentsCount.toLocaleString('ar-EG')}
                  </td>
                  <td className="p-4 text-sm font-bold" style={{ color: 'var(--text-pure)' }}>
                    {c.isFree ? (
                      <span style={{ color: 'var(--neon-green)' }}>مجاني</span>
                    ) : (
                      `${c.price} ج.م`
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/student/courses/${c.id}`}
                        className="p-2 rounded-lg transition-all duration-300"
                        style={{ color: 'var(--text-dim)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--neon-blue)'; e.currentTarget.style.background = 'rgba(0,210,255,0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent'; }}
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/courses/${c.id}/edit`}
                        className="p-2 rounded-lg transition-all duration-300"
                        style={{ color: 'var(--text-dim)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--atom-gold)'; e.currentTarget.style.background = 'rgba(255,190,11,0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent'; }}
                        title="تعديل"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={deleting === c.id}
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
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center" style={{ color: 'var(--text-dim)' }}>
                    <BookOpen className="w-12 h-12 mx-auto mb-2" style={{ color: 'rgba(148,163,184,0.3)' }} />
                    <p>لا توجد كورسات بعد.</p>
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
