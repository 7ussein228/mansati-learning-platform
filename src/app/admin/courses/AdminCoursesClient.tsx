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
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">إدارة الكورسات</h1>
          <p className="text-slate-500 mt-1">إدارة جميع الكورسات على المنصة ({courses.length})</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة كورس جديد
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-right text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold">الكورس</th>
                <th className="p-4 font-semibold">التصنيف</th>
                <th className="p-4 font-semibold">الدروس</th>
                <th className="p-4 font-semibold">الطلاب</th>
                <th className="p-4 font-semibold">السعر</th>
                <th className="p-4 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
                        style={{
                          backgroundImage: `linear-gradient(135deg, rgba(37,99,235,0.5), rgba(30,64,175,0.6)), url(${c.image})`,
                        }}
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-sm line-clamp-1">{c.title}</div>
                        {c.isFree && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                            مجاني
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {c.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-700 font-medium">{c.lessons.length}</td>
                  <td className="p-4 text-sm text-slate-700 font-medium">
                    {c.studentsCount.toLocaleString('ar-EG')}
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-900">
                    {c.isFree ? (
                      <span className="text-green-600">مجاني</span>
                    ) : (
                      `${c.price} ج.م`
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/student/courses/${c.id}`}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/courses/${c.id}/edit`}
                        className="p-2 text-slate-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                        title="تعديل"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={deleting === c.id}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
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
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
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
