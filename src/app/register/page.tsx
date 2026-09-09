'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, Phone, Loader2, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }
    if (!form.agree) {
      setError('يجب الموافقة على الشروط والأحكام');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'حدث خطأ');
      window.location.href = '/student';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-bl from-blue-600 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.2),transparent_50%)]" />
        <div className="relative">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <span className="text-3xl font-extrabold">منصتي</span>
          </Link>
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            ابدأ رحلتك معنا!
          </h1>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            انضم لآلاف الطلاب الذين يثقون بمنصتي للمذاكرة والاستعداد للامتحانات.
          </p>
          <div className="space-y-4">
            {[
              'الوصول لكل الكورسات من أي مكان',
              'اختبارات بعد كل درس مع تصحيح فوري',
              'شهادات معتمدة بعد إتمام الكورس',
              'جروبات نقاش للتفاعل مع زملائك',
              'نقاط ومكافآت مع كل إنجاز',
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-blue-50">
                <div className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </div>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-blue-600">منصتي</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">إنشاء حساب جديد</h2>
            <p className="text-slate-500 text-sm mb-6">
              أدخل بياناتك لإنشاء حساب الطالب
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="أحمد محمد"
                    className="w-full pr-10 pl-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="example@email.com"
                    className="w-full pr-10 pl-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  رقم الموبايل
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="01012345678"
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
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
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

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={form.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-10 pl-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => handleChange('agree', e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">
                  أوافق على{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    الشروط والأحكام
                  </a>{' '}
                  وسياسة الخصوصية
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                إنشاء الحساب
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold">
                سجّل الدخول
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
