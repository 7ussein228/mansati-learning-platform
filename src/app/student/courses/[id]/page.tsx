import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readDB } from '@/lib/db';
import type { Course, Enrollment } from '@/lib/types';
import { getCurrentUser } from '@/lib/auth';
import BuyButton from '@/components/BuyButton';
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
        className="inline-flex items-center gap-2 transition font-medium text-sm"
        style={{ color: 'var(--neon-blue)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        العودة للكورسات
      </Link>

      <div
        className="overflow-hidden"
        style={{
          background: 'var(--card-glass)',
          border: '1px solid var(--border-plasma)',
          borderRadius: '20px',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div
          className="h-48 md:h-64 bg-cover bg-center relative"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0,210,255,0.3), rgba(5,8,19,0.9)), url(${course.image})`,
          }}
        >
          <div className="absolute inset-0 flex items-end p-6 md:p-8">
            <div className="text-white">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
              >
                {course.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold mb-2">{course.title}</h1>
              <p className="text-sm md:text-base max-w-2xl line-clamp-2" style={{ color: 'rgba(255,255,255,0.7)' }}>{course.description}</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4" style={{ borderBottom: '1px solid var(--border-plasma)' }}>
          {[
            { icon: BookOpen, value: `${course.lessons.length} درس`, label: 'الدروس', color: 'var(--neon-blue)' },
            { icon: Clock, value: `${totalHours} ساعة`, label: 'المدة', color: 'var(--atom-gold)' },
            { icon: Users, value: course.studentsCount.toLocaleString('ar-EG'), label: 'الطلاب', color: 'var(--neon-green)' },
            { icon: Star, value: `${course.rating}/5`, label: 'التقييم', color: 'var(--neon-purple)' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${item.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div>
                  <div className="text-sm" style={{ color: 'var(--text-dim)' }}>{item.label}</div>
                  <div className="font-bold" style={{ color: 'var(--text-pure)' }}>{item.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold" style={{ color: 'var(--text-pure)' }}>تقدمك في الكورس</span>
            <span className="font-bold" style={{ color: 'var(--neon-blue)' }}>{progress}%</span>
          </div>
          <div className="quantum-bar" style={{ height: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              className="quantum-fill h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--neon-blue), var(--neon-purple))' }}
            />
          </div>
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
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-pure)' }}>
              <BookOpen className="w-5 h-5" style={{ color: 'var(--neon-blue)' }} />
              محتوى الكورس
            </h2>
            <span className="text-sm" style={{ color: 'var(--text-dim)' }}>{course.lessons.length} درس</span>
          </div>
          <div>
            {course.lessons.map((lesson, idx) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isLocked = !lesson.isFree && !enrollment && idx > 0;
              return (
                <div
                  key={lesson.id}
                  className="p-4 md:p-5 flex items-center gap-4 transition lesson-node"
                  style={{ borderBottom: idx < course.lessons.length - 1 ? '1px solid var(--border-plasma)' : 'none' }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{
                      background: isCompleted ? 'rgba(0,245,212,0.15)' : isLocked ? 'rgba(255,255,255,0.06)' : 'rgba(0,210,255,0.15)',
                      color: isCompleted ? 'var(--neon-green)' : isLocked ? 'var(--text-dim)' : 'var(--neon-blue)',
                    }}
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
                    <h3 className="font-bold mb-1 flex items-center gap-2" style={{ color: 'var(--text-pure)' }}>
                      {lesson.title}
                      {lesson.isFree && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                          style={{ background: 'rgba(0,245,212,0.15)', color: 'var(--neon-green)' }}
                        >
                          مجاني
                        </span>
                      )}
                    </h3>
                    <p className="text-sm line-clamp-1" style={{ color: 'var(--text-dim)' }}>{lesson.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: 'var(--text-dim)' }}>
                      <Clock className="w-3 h-3" />
                      {lesson.duration} دقيقة
                    </div>
                  </div>
                  <button
                    disabled={isLocked}
                    className="px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: isLocked ? 'rgba(255,255,255,0.06)' : isCompleted ? 'var(--neon-green)' : 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
                      color: 'white',
                    }}
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

        <div className="space-y-4">
          <div
            className="p-5"
            style={{
              background: 'var(--card-glass)',
              border: '1px solid var(--border-plasma)',
              borderRadius: '20px',
              backdropFilter: 'blur(16px)',
            }}
          >
            {course.isFree ? (
              <div className="text-center mb-4">
                <div className="text-3xl font-extrabold mb-1" style={{ color: 'var(--neon-green)' }}>مجاني</div>
                <div className="text-sm" style={{ color: 'var(--text-dim)' }}>ابدأ الآن بدون أي رسوم</div>
              </div>
            ) : (
              <div className="text-center mb-4">
                <div className="text-3xl font-extrabold mb-1" style={{ color: 'var(--text-pure)' }}>
                  {course.price} <span className="text-base font-normal" style={{ color: 'var(--text-dim)' }}>ج.م</span>
                </div>
                <div className="text-sm" style={{ color: 'var(--text-dim)' }}>اشتراك لمرة واحدة</div>
              </div>
            )}
            <BuyButton
              courseId={course.id}
              isFree={course.isFree}
              isEnrolled={!!enrollment}
              price={course.price}
            />
          </div>

          <div
            className="p-5"
            style={{
              background: 'var(--card-glass)',
              border: '1px solid var(--border-plasma)',
              borderRadius: '20px',
              backdropFilter: 'blur(16px)',
            }}
          >
            <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-pure)' }}>
              <Download className="w-4 h-4" style={{ color: 'var(--neon-blue)' }} />
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
                  className="flex items-center gap-3 p-3 rounded-lg transition group"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-plasma)' }}
                >
                  <FileText className="w-5 h-5" style={{ color: 'var(--neon-blue)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium" style={{ color: 'var(--text-pure)' }}>{r.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{r.size}</div>
                  </div>
                  <Download className="w-4 h-4 transition" style={{ color: 'var(--text-dim)' }} />
                </a>
              ))}
            </div>
          </div>

          <div
            className="p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(255,190,11,0.15), rgba(255,190,11,0.05))',
              border: '1px solid rgba(255,190,11,0.3)',
              borderRadius: '20px',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5" style={{ color: 'var(--atom-gold)' }} />
              <h3 className="font-bold" style={{ color: 'var(--atom-gold)' }}>شهادة إتمام</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
              عند إتمام الكورس واجتياز الاختبار النهائي ستحصل على شهادة إتمام معتمدة يمكنك تحميلها وطباعتها.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
