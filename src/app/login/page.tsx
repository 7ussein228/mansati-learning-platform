'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2, GraduationCap, ShieldCheck, Zap, BookOpen, Trophy, Users } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'حدث خطأ');
      router.push(data.user.role === 'admin' ? '/admin' : '/student');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: BookOpen, text: 'تابع تقدمك في الكورسات', color: 'var(--neon-blue)' },
    { icon: Zap, text: 'حل الاختبارات واحصل على نتائج فورية', color: 'var(--neon-green)' },
    { icon: Users, text: 'تواصل مع زملائك في جروبات النقاش', color: 'var(--neon-purple)' },
    { icon: Trophy, text: 'احصل على شهاداتك المعتمدة', color: 'var(--atom-gold)' },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ background: 'var(--bg-space)' }}>
      <div className="hidden lg:flex flex-col justify-center items-center p-12 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(157,78,221,0.25) 0%, rgba(0,210,255,0.15) 50%, rgba(0,245,212,0.1) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 30% 40%, rgba(0,210,255,0.2) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(157,78,221,0.2) 0%, transparent 50%)',
          }}
        />
        <div className="relative z-10 w-full max-w-md">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
                boxShadow: '0 0 30px rgba(0,210,255,0.4)',
              }}
            >
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span
              className="text-4xl font-extrabold"
              style={{
                background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple), var(--neon-green))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Tesla
            </span>
          </Link>

          <h1
            className="text-4xl font-extrabold mb-4 leading-tight"
            style={{ color: 'var(--text-pure)' }}
          >
            أهلاً بعودتك!
          </h1>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            سجّل دخولك لمتابعة رحلتك التعليمية، وشوف تقدمك، وحضر الدروس والاختبارات.
          </p>

          <div className="space-y-4">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{
                  background: 'var(--card-glass)',
                  border: '1px solid var(--border-plasma)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${b.color}20`, border: `1px solid ${b.color}40` }}
                >
                  <b.icon className="w-5 h-5" style={{ color: b.color }} />
                </div>
                <span className="font-medium" style={{ color: 'var(--text-pure)' }}>
                  {b.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
                boxShadow: '0 0 20px rgba(0,210,255,0.3)',
              }}
            >
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span
              className="text-2xl font-extrabold"
              style={{
                background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Tesla
            </span>
          </Link>

          <div className="glass-box animate-fadeIn">
            <div className="text-center mb-8">
              <h2
                className="text-2xl font-extrabold mb-2"
                style={{ color: 'var(--text-pure)' }}
              >
                تسجيل الدخول
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                أدخل بياناتك للدخول إلى حسابك
              </p>
            </div>

            {error && (
              <div
                className="mb-4 p-3 rounded-xl text-sm font-medium text-center"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#fca5a5',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dim)' }}>
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: 'var(--text-dim)' }}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="input-space pr-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-dim)' }}>
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: 'var(--text-dim)' }}
                  />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-space pr-10 pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-dim)' }}
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{
                      accentColor: 'var(--neon-blue)',
                    }}
                  />
                  <span className="text-sm" style={{ color: 'var(--text-dim)' }}>
                    تذكرني
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm font-medium hover:underline"
                  style={{ color: 'var(--neon-blue)' }}
                >
                  نسيت كلمة المرور؟
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-neon w-full justify-center py-3 text-base"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                تسجيل الدخول
              </button>
            </form>

            <div className="mt-6 text-center text-sm" style={{ color: 'var(--text-dim)' }}>
              ليس لديك حساب؟{' '}
              <Link
                href="/register"
                className="font-bold hover:underline"
                style={{
                  background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                سجل الآن
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
