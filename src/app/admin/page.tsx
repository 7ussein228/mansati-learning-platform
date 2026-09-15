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
    { label: 'إجمالي الطلاب', value: studentCount, icon: Users, color: 'rgba(0,210,255,0.15)', iconColor: 'var(--neon-blue)' },
    { label: 'الكورسات', value: courses.length, icon: BookOpen, color: 'rgba(255,190,11,0.15)', iconColor: 'var(--atom-gold)' },
    { label: 'الاختبارات', value: quizzes.length, icon: FileQuestion, color: 'rgba(157,78,221,0.15)', iconColor: 'var(--neon-purple)' },
    { label: 'الإيرادات', value: `${totalRevenue} ج.م`, icon: DollarSign, color: 'rgba(0,245,212,0.15)', iconColor: 'var(--neon-green)' },
  ];

  const quickActions = [
    { label: 'إضافة كورس', href: '/admin/courses/new', icon: BookOpen },
    { label: 'إضافة اختبار', href: '/admin/quizzes/new', icon: FileQuestion },
    { label: 'إدارة الطلاب', href: '/admin/students', icon: Users },
  ];

  const latestStudents = [...users]
    .filter((u) => u.role === 'student')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--text-pure)' }}>
          لوحة التحكم
        </h1>
        <p className="mt-1" style={{ color: 'var(--text-dim)' }}>
          مرحباً، {settings?.platformName || 'Tesla'} - نظرة عامة على المنصة
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              style={{
                background: 'var(--card-glass)',
                border: '1px solid var(--border-plasma)',
                borderRadius: '20px',
                backdropFilter: 'blur(16px)',
              }}
              className="p-5 hover:shadow-[0_0_20px_rgba(0,210,255,0.15)] transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: s.color }}
                >
                  <Icon className="w-5 h-5" style={{ color: s.iconColor }} />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--neon-green)' }}>
                  <TrendingUp className="w-3 h-3" />
                  نشط
                </div>
              </div>
              <div className="text-2xl font-extrabold mt-3" style={{ color: 'var(--text-pure)' }}>{s.value}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          background: 'var(--card-glass)',
          border: '1px solid var(--border-plasma)',
          borderRadius: '20px',
          backdropFilter: 'blur(16px)',
        }}
        className="p-5"
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-pure)' }}>إجراءات سريعة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((a, i) => {
            const Icon = a.icon;
            return (
              <Link
                key={i}
                href={a.href}
                className="text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,210,255,0.3)]"
                style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' }}
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
        <div
          className="lg:col-span-2"
          style={{
            background: 'var(--card-glass)',
            border: '1px solid var(--border-plasma)',
            borderRadius: '20px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-plasma)' }}>
            <h2 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-pure)' }}>
              <Users className="w-5 h-5" style={{ color: 'var(--neon-blue)' }} />
              آخر الطلاب المسجلين
            </h2>
            <Link href="/admin/students" className="text-sm font-medium" style={{ color: 'var(--neon-blue)' }}>
              عرض الكل
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-xs" style={{ background: 'rgba(0,210,255,0.08)' }}>
                  <th className="p-3 font-semibold" style={{ color: 'var(--neon-blue)' }}>الطالب</th>
                  <th className="p-3 font-semibold" style={{ color: 'var(--neon-blue)' }}>الإيميل</th>
                  <th className="p-3 font-semibold" style={{ color: 'var(--neon-blue)' }}>تاريخ التسجيل</th>
                  <th className="p-3 font-semibold" style={{ color: 'var(--neon-blue)' }}>النقاط</th>
                </tr>
              </thead>
              <tbody>
                {latestStudents.length > 0 ? (
                  latestStudents.map((s, i) => (
                    <tr
                      key={s.id}
                      className="hover:shadow-[inset_0_0_20px_rgba(0,210,255,0.05)] transition-all"
                      style={{
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                        borderTop: '1px solid var(--border-plasma)',
                      }}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: 'rgba(0,210,255,0.15)', color: 'var(--neon-blue)' }}
                          >
                            {s.name.charAt(0)}
                          </div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-pure)' }}>{s.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm" style={{ color: 'var(--text-dim)' }}>{s.email}</td>
                      <td className="p-3 text-sm" style={{ color: 'var(--text-dim)' }}>
                        {new Date(s.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="p-3">
                        <span
                          className="inline-block text-xs font-bold px-2 py-1 rounded"
                          style={{ background: 'rgba(0,210,255,0.15)', color: 'var(--neon-blue)' }}
                        >
                          {s.points || 0}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-sm" style={{ color: 'var(--text-dim)' }}>
                      لا يوجد طلاب مسجلين بعد. سيظهر الطلاب هنا بعد تسجيلهم.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={{
            background: 'var(--card-glass)',
            border: '1px solid var(--border-plasma)',
            borderRadius: '20px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="p-5 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border-plasma)' }}>
            <GraduationCap className="w-5 h-5" style={{ color: 'var(--atom-gold)' }} />
            <h2 className="font-bold" style={{ color: 'var(--text-pure)' }}>نظرة على الكورسات</h2>
          </div>
          <div className="p-5 space-y-3">
            {courses.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                href={`/student/courses/${c.id}`}
                className="flex items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:shadow-[inset_0_0_20px_rgba(0,210,255,0.05)]"
                style={{ border: '1px solid transparent' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-plasma)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
              >
                <div
                  className="w-10 h-10 rounded-lg bg-cover bg-center flex-shrink-0"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(0,210,255,0.3), rgba(157,78,221,0.4)), url(${c.image})`,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm line-clamp-1" style={{ color: 'var(--text-pure)' }}>{c.title}</div>
                  <div className="text-xs flex items-center gap-2 mt-0.5" style={{ color: 'var(--text-dim)' }}>
                    <span>{c.studentsCount.toLocaleString('ar-EG')} طالب</span>
                    <span>•</span>
                    <span>{c.lessons.length} درس</span>
                  </div>
                </div>
                <Eye className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-dim)' }} />
              </Link>
            ))}
            <Link
              href="/admin/courses"
              className="block text-center text-sm font-medium py-2 rounded-lg transition-all duration-300"
              style={{ color: 'var(--neon-blue)' }}
            >
              إدارة الكورسات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
