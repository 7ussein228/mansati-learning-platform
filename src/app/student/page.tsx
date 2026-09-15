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

  const myEnrollments = enrollments.filter((e) => e.studentId === currentUser.id);
  const completedLessons = myEnrollments.reduce((sum, e) => sum + e.completedLessons.length, 0);
  const myCerts = certs.filter((c) => c.studentId === currentUser.id);

  const inProgress = courses.slice(0, 3).map((c, i) => ({
    ...c,
    progress: i === 0 ? 65 : i === 1 ? 40 : 20,
  }));

  const upcoming = quizzes.slice(0, 3);

  const leaderboard = [...users]
    .filter((u) => u.role === 'student')
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  const stats = [
    { label: 'دروس مكتملة', value: completedLessons || 24, icon: CheckCircle2, accent: 'var(--neon-green)' },
    { label: 'متوسط الدرجات', value: '89%', icon: Award, accent: 'var(--atom-gold)' },
    { label: 'نقاطك', value: currentUser.points || 850, icon: Sparkles, accent: 'var(--neon-blue)' },
    { label: 'شهادات', value: myCerts.length || 2, icon: Trophy, accent: 'var(--neon-purple)' },
  ];

  const getRankIcon = (i: number) => {
    if (i === 0) return <Crown className="w-5 h-5" style={{ color: 'var(--atom-gold)' }} />;
    if (i === 1) return <Medal className="w-5 h-5" style={{ color: 'var(--text-dim)' }} />;
    if (i === 2) return <Medal className="w-5 h-5" style={{ color: '#cd7f32' }} />;
    return <span className="w-5 h-5 flex items-center justify-center text-xs font-bold" style={{ color: 'var(--text-dim)' }}>{i + 1}</span>;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
          border: '1px solid var(--border-plasma)',
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,190,11,0.15),transparent_50%)]" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>أهلاً بعودتك</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">{currentUser.name}</h1>
            <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>تابع رحلتك التعليمية وكمّل ما بدأته</p>
          </div>
          <Link
            href="/student/courses"
            className="self-start md:self-auto btn-neon font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' }}
          >
            <BookOpen className="w-5 h-5 text-white" />
            <span className="text-white">تصفح الكورسات</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="glass-box p-5"
              style={{
                background: 'var(--card-glass)',
                border: '1px solid var(--border-plasma)',
                borderRadius: '20px',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${s.accent}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: s.accent }} />
              </div>
              <div className="text-2xl font-extrabold" style={{ color: s.accent }}>{s.value}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>{s.label}</div>
            </div>
          );
        })}
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
            <div className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5" style={{ color: 'var(--neon-blue)' }} />
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-pure)' }}>كمّل تعلمك</h2>
            </div>
            <Link href="/student/courses" className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--neon-blue)' }}>
              الكل
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {inProgress.map((c) => (
              <Link href={`/student/courses/${c.id}`} key={c.id} className="block">
                <div
                  className="flex items-center gap-4 p-3 rounded-xl transition"
                  style={{ border: '1px solid transparent' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--neon-blue)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0,210,255,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `linear-gradient(135deg, rgba(0,210,255,0.3), rgba(157,78,221,0.4)), url(${c.image})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold line-clamp-1 mb-1" style={{ color: 'var(--text-pure)' }}>{c.title}</h3>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-dim)' }}>{c.lessons.length} درس</p>
                    <div className="flex items-center gap-2">
                      <div className="quantum-bar flex-1" style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div
                          className="quantum-fill h-full rounded-full transition-all"
                          style={{ width: `${c.progress}%`, background: 'linear-gradient(90deg, var(--neon-blue), var(--neon-purple))' }}
                        />
                      </div>
                      <span className="text-xs font-bold" style={{ color: 'var(--neon-blue)' }}>{c.progress}%</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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
            <Calendar className="w-5 h-5" style={{ color: 'var(--atom-gold)' }} />
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-pure)' }}>اختبارات قادمة</h2>
          </div>
          <div className="p-5 space-y-3">
            {upcoming.map((q) => (
              <Link
                href={`/student/quizzes/${q.id}`}
                key={q.id}
                className="block p-3 rounded-xl transition"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-plasma)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--neon-blue)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0,210,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-plasma)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 className="font-bold text-sm mb-1 line-clamp-1" style={{ color: 'var(--text-pure)' }}>{q.title}</h3>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-dim)' }}>
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
              className="block text-center text-sm font-medium py-2 rounded-lg transition"
              style={{ color: 'var(--neon-blue)' }}
            >
              عرض كل الاختبارات
            </Link>
          </div>
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
          <Trophy className="w-5 h-5" style={{ color: 'var(--atom-gold)' }} />
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-pure)' }}>لوحة الشرف</h2>
        </div>
        <div className="p-5">
          <div className="space-y-2">
            {leaderboard.map((u, i) => {
              const isMe = u.id === currentUser.id;
              return (
                <div
                  key={u.id}
                  className="flex items-center gap-4 p-3 rounded-xl transition"
                  style={{
                    background: isMe ? 'rgba(0,210,255,0.1)' : 'transparent',
                    border: isMe ? '1px solid var(--neon-blue)' : '1px solid transparent',
                  }}
                >
                  <div className="w-10 flex justify-center">{getRankIcon(i)}</div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' }}
                  >
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold flex items-center gap-2" style={{ color: 'var(--text-pure)' }}>
                      {u.name}
                      {isMe && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--neon-blue)', color: 'white' }}
                        >
                          أنت
                        </span>
                      )}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-dim)' }}>طالب</div>
                  </div>
                  <div className="text-left">
                    <div className="font-extrabold" style={{ color: 'var(--neon-blue)' }}>{u.points}</div>
                    <div className="text-xs" style={{ color: 'var(--text-dim)' }}>نقطة</div>
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
