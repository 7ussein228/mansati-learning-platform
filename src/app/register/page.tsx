'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, Phone, Loader2, Rocket, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen grid lg:grid-cols-2" style={{ background: 'var(--bg-space)' }}>
      <div className="hidden lg:flex flex-col justify-center p-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0,210,255,0.15), rgba(157,78,221,0.2), rgba(0,245,212,0.1))' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 80%, rgba(0,210,255,0.12), transparent 50%), radial-gradient(circle at 80% 20%, rgba(157,78,221,0.12), transparent 50%)' }} />
        <div className="relative">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' }}>
              <Rocket className="w-8 h-8" style={{ color: 'var(--bg-space)' }} />
            </div>
            <span className="text-4xl font-extrabold" style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tesla</span>
          </Link>
          <h1 className="text-4xl font-extrabold mb-4 leading-tight" style={{ color: 'var(--text-pure)' }}>
            ابدأ رحلتك معنا!
          </h1>
          <p className="text-lg mb-8 leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            انضم لآلاف الطلاب الذين يثقون بTesla للمذاكرة والاستعداد للامتحانات.
          </p>
          <div className="space-y-4">
            {[
              'الوصول لكل الكورسات من أي مكان',
              'اختبارات بعد كل درس مع تصحيح فوري',
              'شهادات معتمدة بعد إتمام الكورس',
              'جروبات نقاش للتفاعل مع زملائك',
              'نقاط ومكافآت مع كل إنجاز',
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3" style={{ color: 'var(--text-pure)' }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,245,212,0.15)' }}>
                  <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--neon-green)' }} />
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
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' }}>
              <Rocket className="w-6 h-6" style={{ color: 'var(--bg-space)' }} />
            </div>
            <span className="text-2xl font-extrabold" style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tesla</span>
          </Link>

          <div className="glass-box p-8">
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-pure)' }}>إنشاء حساب جديد</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-dim)' }}>
              أدخل بياناتك لإنشاء حساب الطالب
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>
                  الاسم الكامل
                </label>
                <div className="relative">
                  <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-dim)' }} />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="أحمد محمد"
                    className="input-space w-full pr-10 pl-3 py-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-dim)' }} />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="example@email.com"
                    className="input-space w-full pr-10 pl-3 py-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>
                  رقم الموبايل
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-dim)' }} />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="01012345678"
                    className="input-space w-full pr-10 pl-3 py-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-dim)' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="••••••••"
                    className="input-space w-full pr-10 pl-10 py-2.5"
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

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-dim)' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={form.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className="input-space w-full pr-10 pl-3 py-2.5"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => handleChange('agree', e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded"
                  style={{ accentColor: 'var(--neon-blue)' }}
                />
                <span className="text-sm" style={{ color: 'var(--text-dim)' }}>
                  أوافق على{' '}
                  <a href="#" style={{ color: 'var(--neon-blue)' }} className="hover:underline">
                    الشروط والأحكام
                  </a>{' '}
                  وسياسة الخصوصية
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn-neon w-full py-3 font-bold rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                إنشاء الحساب
              </button>
            </form>

            <div className="mt-6 text-center text-sm" style={{ color: 'var(--text-dim)' }}>
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="font-bold hover:underline" style={{ color: 'var(--neon-blue)' }}>
                سجّل الدخول
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
