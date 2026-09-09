import Link from 'next/link';
import { readDB, getSettings } from '@/lib/db';
import type { User, Course, Quiz, Subscription } from '@/lib/types';
import {
  Users,
  BookOpen,
  FileQuestion,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  GraduationCap,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const users = await readDB<User>('users');
  const courses = await readDB<Course>('courses');
  const quizzes = await readDB<Quiz>('quizzes');
  const subscriptions = await readDB<Subscription>('subscriptions');
  const settings = await getSettings();

  const studentCount = users.filter((u) => u.role === 'student').length;
  const totalRevenue = subscriptions.reduce((sum, s) => sum + s.amount, 0);

  const stats = [
    { label: 'إجمالي الطلاب', value: studentCount, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'الكورسات', value: courses.length, icon: BookOpen, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'الاختبارات', value: quizzes.length, icon: FileQuestion, color: 'bg-purple-100 text-purple-600' },
    { label: 'الإيرادات', value: `${totalRevenue} ج.م`, icon: DollarSign, color: 'bg-green-100 text-green-600' },
  ];

  const quickActions = [
    { label: 'إضافة كورس', href: '/admin/courses/new', icon: BookOpen, color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'إضافة اختبار', href: '/admin/quizzes/new', icon: FileQuestion, color: 'bg-yellow-500 hover:bg-yellow-600' },
    { label: 'إدارة الطلاب', href: '/admin/students', icon: Users, color: 'bg-green-600 hover:bg-green-700' },
  ];

  const latestStudents = [...users]
    .filter((u) => u.role === 'student')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
          لوحة التحكم
        </h1>
        <p className="text-slate-500 mt-1">
          مرحباً، {settings?.platformName || 'منصتي'} - نظرة عامة على المنصة
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                  <TrendingUp className="w-3 h-3" />
                  نشط
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mt-3">{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">إجراءات سريعة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((a, i) => {
            const Icon = a.icon;
            return (
              <Link
                key={i}
                href={a.href}
                className={`${a.color} text-white px-4 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2`}
              >
                <Plus className="w-4 h-4" />
                <Icon className="w-5 h-5" />
                {a.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Latest students */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              آخر الطلاب المسجلين
            </h2>
            <Link href="/admin/students" className="text-sm text-blue-600 font-medium">
              عرض الكل
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-xs text-slate-500 bg-slate-50">
                  <th className="p-3 font-semibold">الطالب</th>
                  <th className="p-3 font-semibold">الإيميل</th>
                  <th className="p-3 font-semibold">تاريخ التسجيل</th>
                  <th className="p-3 font-semibold">النقاط</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {latestStudents.length > 0 ? (
                  latestStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                            {s.name.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-900 text-sm">{s.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-slate-600">{s.email}</td>
                      <td className="p-3 text-sm text-slate-600">
                        {new Date(s.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="p-3">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                          {s.points || 0}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500 text-sm">
                      لا يوجد طلاب مسجلين بعد. سيظهر الطلاب هنا بعد تسجيلهم.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Courses overview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-yellow-600" />
            <h2 className="font-bold text-slate-900">نظرة على الكورسات</h2>
          </div>
          <div className="p-5 space-y-3">
            {courses.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                href={`/student/courses/${c.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition"
              >
                <div
                  className="w-10 h-10 rounded-lg bg-cover bg-center flex-shrink-0"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(37,99,235,0.6), rgba(30,64,175,0.7)), url(${c.image})`,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-900 line-clamp-1">{c.title}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{c.studentsCount.toLocaleString('ar-EG')} طالب</span>
                    <span>•</span>
                    <span>{c.lessons.length} درس</span>
                  </div>
                </div>
                <Eye className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </Link>
            ))}
            <Link
              href="/admin/courses"
              className="block text-center text-sm text-blue-600 font-medium py-2 hover:bg-blue-50 rounded-lg"
            >
              إدارة الكورسات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
