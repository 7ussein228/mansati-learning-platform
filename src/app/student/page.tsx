import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { readDB } from '@/lib/db';
import type { Course, Quiz, Enrollment, User, Certificate } from '@/lib/types';
import {
  BookOpen,
  Award,
  Trophy,
  Sparkles,
  Clock,
  CheckCircle2,
  Medal,
  Crown,
  ArrowLeft,
  PlayCircle,
  Calendar,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentDashboard() {
  const currentUser = (await getCurrentUser())!;
  const courses = await readDB<Course>('courses');
  const quizzes = await readDB<Quiz>('quizzes');
  const enrollments = await readDB<Enrollment>('enrollments');
  const users = await readDB<User>('users');
  const certs = await readDB<Certificate>('certificates');

  // Calculate stats
  const myEnrollments = enrollments.filter((e) => e.studentId === currentUser.id);
  const completedLessons = myEnrollments.reduce((sum, e) => sum + e.completedLessons.length, 0);
  const myCerts = certs.filter((c) => c.studentId === currentUser.id);

  // For demo: show top courses as in-progress
  const inProgress = courses.slice(0, 3).map((c, i) => ({
    ...c,
    progress: i === 0 ? 65 : i === 1 ? 40 : 20,
  }));

  // Upcoming quizzes
  const upcoming = quizzes.slice(0, 3);

  // Leaderboard - top 10 students by points
  const leaderboard = [...users]
    .filter((u) => u.role === 'student')
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  const stats = [
    { label: 'دروس مكتملة', value: completedLessons || 24, icon: CheckCircle2, color: 'bg-green-100 text-green-600', accent: 'text-green-600' },
    { label: 'متوسط الدرجات', value: '89%', icon: Award, color: 'bg-yellow-100 text-yellow-600', accent: 'text-yellow-600' },
    { label: 'نقاطك', value: currentUser.points || 850, icon: Sparkles, color: 'bg-blue-100 text-blue-600', accent: 'text-blue-600' },
    { label: 'شهادات', value: myCerts.length || 2, icon: Trophy, color: 'bg-purple-100 text-purple-600', accent: 'text-purple-600' },
  ];

  const getRankIcon = (i: number) => {
    if (i === 0) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (i === 1) return <Medal className="w-5 h-5 text-slate-400" />;
    if (i === 2) return <Medal className="w-5 h-5 text-amber-700" />;
    return <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-slate-500">{i + 1}</span>;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-l from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(245,158,11,0.2),transparent_50%)]" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-blue-100 mb-1">أهلاً بعودتك 👋</p>
            <h1 className="text-2xl md:text-3xl font-extrabold">{currentUser.name}</h1>
            <p className="text-blue-100 mt-2 text-sm">تابع رحلتك التعليمية وكمّل ما بدأته</p>
          </div>
          <Link
            href="/student/courses"
            className="self-start md:self-auto bg-yellow-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-300 transition flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            تصفح الكورسات
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className={`text-2xl font-extrabold ${s.accent}`}>{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Continue learning */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">كمّل تعلمك</h2>
            </div>
            <Link href="/student/courses" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              الكل
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {inProgress.map((c) => (
              <Link href={`/student/courses/${c.id}`} key={c.id} className="block">
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition">
                  <div
                    className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `linear-gradient(135deg, rgba(37,99,235,0.5), rgba(30,64,175,0.6)), url(${c.image})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 line-clamp-1 mb-1">{c.title}</h3>
                    <p className="text-xs text-slate-500 mb-2">{c.lessons.length} درس</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-l from-blue-600 to-blue-400 rounded-full transition-all"
                          style={{ width: `${c.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-blue-600">{c.progress}%</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming quizzes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-600" />
            <h2 className="text-lg font-bold text-slate-900">اختبارات قادمة</h2>
          </div>
          <div className="p-5 space-y-3">
            {upcoming.map((q) => (
              <Link href={`/student/quizzes/${q.id}`} key={q.id} className="block p-3 bg-slate-50 hover:bg-blue-50 rounded-xl transition">
                <h3 className="font-bold text-sm text-slate-900 mb-1 line-clamp-1">{q.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {q.duration} دقيقة
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {q.passingScore}% للنجاح
                  </span>
                </div>
              </Link>
            ))}
            <Link
              href="/student/quizzes"
              className="block text-center text-sm text-blue-600 font-medium py-2 hover:bg-blue-50 rounded-lg transition"
            >
              عرض كل الاختبارات
            </Link>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-bold text-slate-900">لوحة الشرف</h2>
        </div>
        <div className="p-5">
          <div className="space-y-2">
            {leaderboard.map((u, i) => {
              const isMe = u.id === currentUser.id;
              return (
                <div
                  key={u.id}
                  className={`flex items-center gap-4 p-3 rounded-xl transition ${
                    isMe ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 flex justify-center">{getRankIcon(i)}</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      {u.name}
                      {isMe && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">أنت</span>}
                    </div>
                    <div className="text-xs text-slate-500">طالب</div>
                  </div>
                  <div className="text-left">
                    <div className="font-extrabold text-blue-600">{u.points}</div>
                    <div className="text-xs text-slate-500">نقطة</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
