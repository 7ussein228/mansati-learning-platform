import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readDB } from '@/lib/db';
import type { Course, Enrollment } from '@/lib/types';
import { getCurrentUser } from '@/lib/auth';
import {
  Clock,
  Users,
  Star,
  BookOpen,
  PlayCircle,
  Lock,
  CheckCircle2,
  Download,
  ArrowLeft,
  FileText,
  Award,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CourseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const courses = await readDB<Course>('courses');
  const course = courses.find((c) => c.id === id);
  if (!course) notFound();

  const user = await getCurrentUser();
  const enrollments = await readDB<Enrollment>('enrollments');
  const enrollment = enrollments.find(
    (e) => e.studentId === user?.id && e.courseId === course.id
  );

  const completedLessons = enrollment?.completedLessons || ['l1'];
  const progress = course.lessons.length > 0
    ? Math.round((completedLessons.length / course.lessons.length) * 100)
    : 0;

  const totalHours = Math.round(course.duration / 60);

  return (
    <div className="space-y-8 animate-fadeIn">
      <Link
        href="/student/courses"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition font-medium text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        العودة للكورسات
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div
          className="h-48 md:h-64 bg-cover bg-center relative"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(37,99,235,0.85), rgba(15,23,42,0.9)), url(${course.image})`,
          }}
        >
          <div className="absolute inset-0 flex items-end p-6 md:p-8">
            <div className="text-white">
              <span className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold mb-3">
                {course.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold mb-2">{course.title}</h1>
              <p className="text-blue-100 text-sm md:text-base max-w-2xl line-clamp-2">{course.description}</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-slate-500">الدروس</div>
              <div className="font-bold text-slate-900">{course.lessons.length} درس</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-slate-500">المدة</div>
              <div className="font-bold text-slate-900">{totalHours} ساعة</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-slate-500">الطلاب</div>
              <div className="font-bold text-slate-900">{course.studentsCount.toLocaleString('ar-EG')}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-purple-600 fill-purple-600" />
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500">التقييم</div>
              <div className="font-bold text-slate-900">{course.rating}/5</div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-900">تقدمك في الكورس</span>
            <span className="font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-blue-600 to-blue-400 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lessons list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              محتوى الكورس
            </h2>
            <span className="text-sm text-slate-500">{course.lessons.length} درس</span>
          </div>
          <div className="divide-y divide-slate-100">
            {course.lessons.map((lesson, idx) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isLocked = !lesson.isFree && !enrollment && idx > 0;
              return (
                <div key={lesson.id} className="p-4 md:p-5 flex items-center gap-4 hover:bg-slate-50 transition">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                      isCompleted
                        ? 'bg-green-100 text-green-600'
                        : isLocked
                        ? 'bg-slate-100 text-slate-400'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                      {lesson.title}
                      {lesson.isFree && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                          مجاني
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{lesson.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {lesson.duration} دقيقة
                    </div>
                  </div>
                  <button
                    disabled={isLocked}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1 flex-shrink-0 ${
                      isLocked
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : isCompleted
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-4 h-4" />
                        مغلق
                      </>
                    ) : isCompleted ? (
                      <>
                        <PlayCircle className="w-4 h-4" />
                        إعادة
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4" />
                        ابدأ
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Resources & Price */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            {course.isFree ? (
              <div className="text-center mb-4">
                <div className="text-3xl font-extrabold text-green-600 mb-1">مجاني</div>
                <div className="text-sm text-slate-500">ابدأ الآن بدون أي رسوم</div>
              </div>
            ) : (
              <div className="text-center mb-4">
                <div className="text-3xl font-extrabold text-slate-900 mb-1">
                  {course.price} <span className="text-base font-normal text-slate-500">ج.م</span>
                </div>
                <div className="text-sm text-slate-500">اشتراك لمرة واحدة</div>
              </div>
            )}
            <button
              className={`w-full py-3 rounded-xl font-bold transition ${
                course.isFree
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {enrollment || course.isFree ? 'متابعة الكورس' : 'سجّل في الكورس'}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-600" />
              موارد التحميل
            </h3>
            <div className="space-y-2">
              {[
                { name: 'ملخص الكورس PDF', size: '2.4 MB' },
                { name: 'كراسة التمارين', size: '5.1 MB' },
              ].map((r, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50 rounded-lg transition group"
                >
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.size}</div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-l from-yellow-400 to-yellow-500 rounded-2xl p-5 text-slate-900 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5" />
              <h3 className="font-bold">شهادة إتمام</h3>
            </div>
            <p className="text-sm leading-relaxed">
              عند إتمام الكورس واجتياز الاختبار النهائي ستحصل على شهادة إتمام معتمدة يمكنك تحميلها وطباعتها.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
