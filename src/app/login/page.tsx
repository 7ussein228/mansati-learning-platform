'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2, GraduationCap, ShieldCheck } from 'lucide-react';

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

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-bl from-blue-600 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.2),transparent_50%)]" />
        <div className="relative">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <span className="text-3xl font-extrabold">منصتي</span>
          </Link>
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            أهلاً بعودتك!
          </h1>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            سجّل دخولك لمتابعة رحلتك التعليمية، وشوف تقدمك، وحضر الدروس والاختبارات.
          </p>
          <div className="space-y-4">
            {[
              'تابع تقدمك في الكورسات',
              'حل الاختبارات واحصل على نتائج فورية',
              'تواصل مع زملائك في جروبات النقاش',
              'احصل على شهاداتك المعتمدة',
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-blue-50">
                <div className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-yellow-400" />
                </div>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-blue-600">منصتي</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">تسجيل الدخول</h2>
            <p className="text-slate-500 text-sm mb-6">
              أدخل بياناتك للدخول إلى حسابك
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full pr-10 pl-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-10 pl-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">تذكرني</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  نسيت كلمة المرور؟
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                تسجيل الدخول
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              ليس لديك حساب؟{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-bold">
                سجل الآن
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <Link href="/login?admin=1" className="text-sm text-slate-500 hover:text-blue-600 transition font-medium flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                دخول كـ Admin / مدرس
              </Link>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
            <strong>حساب المدير:</strong>
            <br />
            admin@mansati.com / admin123
            <br />
            <span className="text-blue-600">للطلاب: سجل حساب جديد من صفحة التسجيل</span>
          </div>
        </div>
      </div>
    </div>
  );
}
