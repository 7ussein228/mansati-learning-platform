'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
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
  Rocket,
  Atom,
  Orbit,
} from 'lucide-react';

export default function LandingPage() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => d && setUser({ name: d.user.name, role: d.user.role })).catch(() => {});
    fetch('/api/db?table=courses').then(r => r.json()).then(d => setCourses(d.data || [])).catch(() => {});
    fetch('/api/settings').then(r => r.json()).then(d => setSettings(d)).catch(() => {});
    fetch('/api/db?table=users').then(r => r.json()).then(d => setUsers(d.data || [])).catch(() => {});
    fetch('/api/db?table=quizzes').then(r => r.json()).then(d => setQuizzes(d.data || [])).catch(() => {});
    fetch('/api/db?table=enrollments').then(r => r.json()).then(d => setEnrollments(d.data || [])).catch(() => {});
  }, []);

  const latestCourses = courses.slice(0, 6);
  const studentCount = users.filter((u) => u.role === 'student').length;
  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);

  const stats = [
    { label: 'طالب مسجل', value: `${studentCount}+`, icon: Users, color: '#00d2ff' },
    { label: 'كورس متاح', value: `${courses.length}+`, icon: BookOpen, color: '#9d4edd' },
    { label: 'اختبار', value: `${quizzes.length}+`, icon: FileQuestion, color: '#00f5d4' },
    { label: 'درس تعليمي', value: `${totalLessons}+`, icon: Award, color: '#ffbe0b' },
  ];

  const features = [
    {
      icon: Play,
      title: 'فيديوهات عالية الجودة',
      desc: 'شاهد الدروس في أي وقت ومن أي مكان بجودة عالية وبدون إعلانات',
      color: '#00d2ff',
    },
    {
      icon: FileQuestion,
      title: 'اختبارات تفاعلية',
      desc: 'اختبر مستواك بعد كل درس واحصل على تقييم فوري مع شرح الإجابات',
      color: '#9d4edd',
    },
    {
      icon: Trophy,
      title: 'نظام نقاط ولوحة شرف',
      desc: 'احصل على نقاط مع كل إنجاز وتنافس مع زملائك في لوحة الشرف',
      color: '#00f5d4',
    },
    {
      icon: Award,
      title: 'شهادات معتمدة',
      desc: 'احصل على شهادة إتمام الكورس بعد اجتياز الاختبارات النهائية',
      color: '#ffbe0b',
    },
    {
      icon: Target,
      title: 'متابعة التقدم',
      desc: 'تابع تقدمك في كل كورس وشاهد الدروس المكتملة والتي تحتاج لإكمالها',
      color: '#00d2ff',
    },
    {
      icon: Zap,
      title: 'تحديثات مستمرة',
      desc: 'محتوى يتم تحديثه باستمرار ودروس جديدة تضاف بانتظام',
      color: '#9d4edd',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-space)' }}>
      <Navbar user={user} />

      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--bg-space) 0%, #0a0e27 50%, var(--bg-space) 100%)',
          color: 'var(--text-pure)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(0, 210, 255, 0.12) 0%, transparent 50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 80% 80%, rgba(157, 78, 221, 0.12) 0%, transparent 50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 20%, rgba(0, 245, 212, 0.06) 0%, transparent 50%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '80px 24px 100px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '48px',
              alignItems: 'center',
            }}
            className="hero-grid"
          >
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(0, 210, 255, 0.08)',
                  border: '1px solid var(--border-plasma)',
                  padding: '8px 20px',
                  borderRadius: '30px',
                  fontSize: '0.9rem',
                  color: 'var(--neon-blue)',
                  marginBottom: '28px',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Sparkles size={16} style={{ color: 'var(--atom-gold)' }} />
                <span>منصة {settings?.platformName || 'Tesla'} التعليمية</span>
              </div>
              <h1
                style={{
                  fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                  fontWeight: 900,
                  lineHeight: 1.2,
                  marginBottom: '24px',
                }}
              >
                تعلّم بذكاء
                <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  وصل لأعلى الدرجات
                </span>
              </h1>
              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--text-dim)',
                  lineHeight: 1.8,
                  marginBottom: '32px',
                  maxWidth: '540px',
                }}
              >
                {settings?.description || 'منصة تعليمية متكاملة للمرحلة الثانوية مع أحدث الطرق التعليمية فيديوهات، اختبارات، شهادات، ومتابعة مستمرة من الأستاذ د. حسين علي.'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <Link href="/register" className="btn-neon" style={{ textDecoration: 'none', fontSize: '1rem' }}>
                  <GraduationCap size={20} />
                  سجل مجاناً الآن
                </Link>
                <Link
                  href="#courses"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-plasma)',
                    borderRadius: '12px',
                    color: 'var(--text-pure)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <BookOpen size={20} />
                  تصفح الكورسات
                </Link>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  marginTop: '40px',
                  fontSize: '0.9rem',
                  color: 'var(--text-dim)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--neon-green)' }} />
                  <span>اشتراك واحد لكل الكورسات</span>
                </div>
              </div>
            </div>

            <div className="hero-stats" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '420px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-24px',
                    right: '-24px',
                    width: '100px',
                    height: '100px',
                    background: 'rgba(0, 210, 255, 0.15)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-24px',
                    left: '-24px',
                    width: '120px',
                    height: '120px',
                    background: 'rgba(157, 78, 221, 0.15)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    background: 'var(--card-glass)',
                    border: '1px solid var(--border-plasma)',
                    borderRadius: '24px',
                    padding: '32px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '16px',
                    }}
                  >
                    {[
                      { label: 'معدل النجاح', val: '96%', icon: Trophy },
                      { label: 'ساعات تعليم', val: `${Math.floor(totalLessons * 0.7)}+`, icon: Play },
                      { label: 'تقييم الطلاب', val: '4.9', icon: Award },
                      { label: 'متفاعلون', val: String(studentCount), icon: Users },
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={i}
                          style={{
                            background: 'rgba(0, 210, 255, 0.06)',
                            borderRadius: '16px',
                            padding: '20px 12px',
                            textAlign: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            transition: 'all 0.3s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--neon-blue)';
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 210, 255, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <Icon size={24} style={{ color: 'var(--atom-gold)', margin: '0 auto 8px' }} />
                          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-pure)' }}>{item.val}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>{item.label}</div>
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

      <section
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          marginTop: '-40px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: 'var(--card-glass)',
            border: '1px solid var(--border-plasma)',
            borderRadius: '20px',
            padding: '28px',
            backdropFilter: 'blur(16px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
          }}
          className="stats-grid"
        >
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    background: `${s.color}18`,
                    border: `1px solid ${s.color}30`,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}
                >
                  <Icon size={26} style={{ color: s.color }} />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-pure)' }}>{s.value}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="features"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '80px 24px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(0, 210, 255, 0.1)',
              color: 'var(--neon-blue)',
              border: '1px solid var(--border-plasma)',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '6px 20px',
              borderRadius: '30px',
              marginBottom: '16px',
            }}
          >
            لماذا Tesla؟
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: 900,
              color: 'var(--text-pure)',
              marginBottom: '16px',
            }}
          >
            كل ما تحتاجه للتفوق في مكان واحد
          </h2>
          <p style={{ color: 'var(--text-dim)', maxWidth: '600px', margin: '0 auto' }}>
            نوفر لك بيئة تعليمية متكاملة تساعدك على المذاكرة بفاعلية والاستعداد للامتحانات بثقة
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
          className="features-grid"
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="glass-box"
                style={{
                  marginBottom: 0,
                  transition: 'all 0.3s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = f.color;
                  e.currentTarget.style.boxShadow = `0 0 24px ${f.color}30`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-plasma)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: `${f.color}18`,
                    border: `1px solid ${f.color}30`,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <Icon size={24} style={{ color: f.color }} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-pure)', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="courses"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '40px 24px 80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(157, 78, 221, 0.1)',
                color: 'var(--neon-purple)',
                border: '1px solid rgba(157, 78, 221, 0.3)',
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '6px 20px',
                borderRadius: '30px',
                marginBottom: '16px',
              }}
            >
              الكورسات
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: 900,
                color: 'var(--text-pure)',
              }}
            >
              أحدث الكورسات
            </h2>
            <p style={{ color: 'var(--text-dim)', marginTop: '8px' }}>ابدأ رحلتك التعليمية الآن مع أفضل الكورسات</p>
          </div>
          {user && (
            <Link
              href="/student/courses"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--neon-blue)',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'all 0.2s',
              }}
            >
              عرض كل الكورسات
              <ChevronLeft size={16} />
            </Link>
          )}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
          className="courses-grid"
        >
          {latestCourses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      <section
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px 80px',
        }}
      >
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.1) 0%, rgba(157, 78, 221, 0.1) 100%)',
            border: '1px solid var(--border-plasma)',
            borderRadius: '24px',
            padding: '64px 40px',
            textAlign: 'center',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 30% 20%, rgba(0, 210, 255, 0.1) 0%, transparent 50%)',
            }}
          />
          <div style={{ position: 'relative' }}>
            <Rocket size={56} style={{ color: 'var(--neon-blue)', margin: '0 auto 24px' }} />
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: 900,
                color: 'var(--text-pure)',
                marginBottom: '16px',
              }}
            >
              جاهز تبدأ رحلة التفوق؟
            </h2>
            <p
              style={{
                color: 'var(--text-dim)',
                maxWidth: '540px',
                margin: '0 auto 32px',
                fontSize: '1.05rem',
              }}
            >
              انضم لآلاف الطلاب الذين حققوا نتائج ممتازة مع Tesla وابدأ مجاناً
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
              <Link href="/register" className="btn-neon" style={{ textDecoration: 'none', fontSize: '1rem' }}>
                <GraduationCap size={20} />
                إنشاء حساب مجاني
              </Link>
              <Link
                href="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-plasma)',
                  borderRadius: '12px',
                  color: 'var(--text-pure)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                لدي حساب بالفعل
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings || undefined} />

      <style jsx global>{`
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-stats {
            display: none !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .courses-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
          .features-grid {
            grid-template-columns: 1fr !important;
          }
          .courses-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
