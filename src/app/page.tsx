import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { getCurrentUser } from '@/lib/auth';
import { readDB, getSettings } from '@/lib/db';
import type { Course, Settings, User, Quiz, Enrollment } from '@/lib/types';
import {
  BookOpen,
  FileQuestion,
  Award,
  Users,
  Play,
  CheckCircle2,
  Trophy,
  Zap,
  Target,
  GraduationCap,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const user = await getCurrentUser();
  const courses = await readDB<Course>('courses');
  const settings = await getSettings();
  const users = await readDB<User>('users');
  const quizzes = await readDB<Quiz>('quizzes');
  const enrollments = await readDB<Enrollment>('enrollments');
  const latestCourses = courses.slice(0, 6);

  const studentCount = users.filter((u) => u.role === 'student').length;
  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);

  const stats = [
    { label: 'طالب مسجل', value: String(studentCount) + '+', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'كورس متاح', value: String(courses.length) + '+', icon: BookOpen, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'اختبار', value: String(quizzes.length) + '+', icon: FileQuestion, color: 'bg-purple-100 text-purple-600' },
    { label: 'درس تعليمي', value: String(totalLessons) + '+', icon: Award, color: 'bg-green-100 text-green-600' },
  ];

  const features = [
    {
      icon: Play,
      title: 'فيديوهات عالية الجودة',
      desc: 'شاهد الدروس في أي وقت ومن أي مكان بجودة عالية وبدون إعلانات',
      color: 'bg-blue-600',
    },
    {
      icon: FileQuestion,
      title: 'اختبارات تفاعلية',
      desc: 'اختبر مستواك بعد كل درس واحصل على تقييم فوري مع شرح الإجابات',
      color: 'bg-yellow-500',
    },
    {
      icon: Trophy,
      title: 'نظام نقاط ولوحة شرف',
      desc: 'احصل على نقاط مع كل إنجاز وتنافس مع زملائك في لوحة الشرف',
      color: 'bg-green-500',
    },
    {
      icon: Award,
      title: 'شهادات معتمدة',
      desc: 'احصل على شهادة إتمام الكورس بعد اجتياز الاختبارات النهائية',
      color: 'bg-purple-500',
    },
    {
      icon: Target,
      title: 'متابعة التقدم',
      desc: 'تابع تقدمك في كل كورس وشاهد الدروس المكتملة والتي تحتاج لإكمالها',
      color: 'bg-rose-500',
    },
    {
      icon: Zap,
      title: 'تحديثات مستمرة',
      desc: 'محتوى يتم تحديثه باستمرار ودروس جديدة تضاف بانتظام',
      color: 'bg-sky-500',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar user={user ? { name: user.name, role: user.role } : null} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(245,158,11,0.15),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-right">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm mb-6">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>منصة {settings?.platformName || 'منصتي'} التعليمية</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                تعلّم بذكاء
                <br />
                <span className="text-yellow-400">وصل لأعلى الدرجات</span>
              </h1>
              <p className="text-lg text-blue-100 leading-relaxed mb-8 max-w-xl">
                {settings?.description || 'منصة تعليمية متكاملة للمرحلة الثانوية مع أحدث الطرق التعليمية فيديوهات، اختبارات، شهادات، ومتابعة مستمرة من الأستاذ أحمد محمد.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="px-7 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold rounded-xl transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <GraduationCap className="w-5 h-5" />
                  سجل مجاناً الآن
                </Link>
                <Link
                  href="#courses"
                  className="px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-bold rounded-xl transition flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  تصفح الكورسات
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-10 text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>اشتراك واحد لكل الكورسات</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/30 rounded-full blur-3xl" />
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'معدل النجاح', val: '96%', icon: Trophy },
                      { label: 'ساعات تعليم', val: `${Math.floor(totalLessons * 0.7)}+`, icon: Play },
                      { label: 'تقييم الطلاب', val: '4.9', icon: Award },
                      { label: 'متفاعلون', val: String(studentCount), icon: Users },
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={i} className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
                          <Icon className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                          <div className="text-2xl font-extrabold">{item.val}</div>
                          <div className="text-xs text-blue-100 mt-1">{item.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="text-center">
                <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-slate-900">{s.value}</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            لماذا منصتي؟
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            كل ما تحتاجه للتفوق في مكان واحد
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            نوفر لك بيئة تعليمية متكاملة تساعدك على المذاكرة بفاعلية والاستعداد للامتحانات بثقة
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block bg-yellow-100 text-yellow-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              الكورسات
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">أحدث الكورسات</h2>
            <p className="text-slate-600 mt-2">ابدأ رحلتك التعليمية الآن مع أفضل الكورسات</p>
          </div>
          {user && (
            <Link
              href="/student/courses"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group"
            >
              عرض كل الكورسات
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            </Link>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestCourses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden bg-gradient-to-l from-blue-600 to-indigo-700 rounded-3xl p-10 lg:p-16 text-white text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.2),transparent_50%)]" />
          <div className="relative">
            <Trophy className="w-14 h-14 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              جاهز تبدأ رحلة التفوق؟
            </h2>
            <p className="text-blue-100 max-w-xl mx-auto mb-8 text-lg">
              انضم لآلاف الطلاب الذين حققوا نتائج ممتازة مع منصتي وابدأ مجاناً
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold rounded-xl transition shadow-lg hover:-translate-y-0.5"
              >
                إنشاء حساب مجاني
              </Link>
              <Link
                href="/login"
                className="px-8 py-3.5 bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 font-bold rounded-xl transition"
              >
                لدي حساب بالفعل
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings || undefined} />
    </div>
  );
}
