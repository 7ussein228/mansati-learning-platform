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
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">إدارة الاختبارات</h1>
          <p className="text-slate-500 mt-1">إدارة جميع اختبارات المنصة ({quizzes.length})</p>
        </div>
        <Link
          href="/admin/quizzes/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة اختبار
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-right text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold">الاختبار</th>
                <th className="p-4 font-semibold">الكورس</th>
                <th className="p-4 font-semibold">الأسئلة</th>
                <th className="p-4 font-semibold">المدة</th>
                <th className="p-4 font-semibold">النقاط</th>
                <th className="p-4 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quizzes.map((q) => {
                const course = courses.find((c) => c.id === q.courseId);
                const totalPoints = q.questions.reduce((s, qq) => s + qq.points, 0);
                return (
                  <tr key={q.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileQuestion className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-sm line-clamp-1">{q.title}</div>
                          <div className="text-xs text-slate-500 line-clamp-1">{q.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-700">{course?.title || '---'}</td>
                    <td className="p-4 text-sm font-medium text-slate-700">{q.questions.length}</td>
                    <td className="p-4 text-sm text-slate-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {q.duration} د
                    </td>
                    <td className="p-4 text-sm text-slate-700 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      {totalPoints}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/student/quizzes/${q.id}`}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="عرض"
                        >
                          <FileQuestion className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/quizzes/${q.id}/edit`}
                          className="p-2 text-slate-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                          title="تعديل"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(q.id)}
                          disabled={deleting === q.id}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
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
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-2" />
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
