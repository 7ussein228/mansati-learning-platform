'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, Lock, Loader2, GraduationCap, ShieldCheck, ArrowRight, Rocket, Sparkles, Zap } from 'lucide-react';
import { getFirebaseAuth, RecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebase';
import type { ConfirmationResult } from 'firebase/auth';

type Step = 'phone' | 'otp';

export default function OTPLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (step === 'otp') {
      otpInputRefs.current[0]?.focus();
    }
  }, [step]);

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(getFirebaseAuth(), 'recaptcha-container', {
        size: 'invisible',
      });
    }
    return (window as any).recaptchaVerifier;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formattedPhone = phone.startsWith('0') ? '+20' + phone.slice(1) : phone.startsWith('+20') ? phone : '+20' + phone;

      const appVerifier = setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(getFirebaseAuth(), formattedPhone, appVerifier);
      confirmationRef.current = confirmation;
      setStep('otp');
      setCountdown(60);
    } catch (err: any) {
      console.error('Send OTP error:', err);
      if (err.code === 'auth/invalid-phone-number') {
        setError('رقم الموبايل غير صحيح. تأكد من الرقم وأعد المحاولة');
      } else if (err.code === 'auth/too-many-requests') {
        setError('لقد أرسلنا الكود قبل كده. استنى شوية وجرّب تاني');
      } else {
        setError('فيه مشكلة حصلت. جرّب تاني después de un momento');
      }
      try {
        (window as any).recaptchaVerifier?.reset?.();
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setError('');
    setLoading(true);

    try {
      const formattedPhone = phone.startsWith('0') ? '+20' + phone.slice(1) : phone.startsWith('+20') ? phone : '+20' + phone;

      const appVerifier = setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(getFirebaseAuth(), formattedPhone, appVerifier);
      confirmationRef.current = confirmation;
      setCountdown(60);
    } catch (err: any) {
      setError('مقدرناش نبعت الكود تاني. جرّب بعد شوية');
      try {
        (window as any).recaptchaVerifier?.reset?.();
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const otpCode = otp.join('');
      if (otpCode.length !== 6) {
        setError('ادخل الكود الستة أرقام كلهم');
        setLoading(false);
        return;
      }

      const result = await confirmationRef.current?.confirm(otpCode);
      if (!result) {
        setError('فيه مشكلة حصلت. جرّب تاني');
        setLoading(false);
        return;
      }

      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      const res = await fetch('/api/auth/otp-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, phone: firebaseUser.phoneNumber }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'حدث خطأ');

      router.push(data.user.role === 'admin' ? '/admin' : '/student');
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      if (err.code === 'auth/invalid-verification-code') {
        setError('الكود غلط. تأكد من الكود وأعد المحاولة');
      } else if (err.code === 'auth/code-expired') {
        setError('الكود خلص صلاحيته. اطلب كود جديد');
      } else {
        setError(err.message || 'فيه مشكلة. جرّب تاني');
      }
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
            <span className="text-3xl font-extrabold">د. حسين علي</span>
          </Link>
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            رجعت تاني؟ يلا نكمّل! 🚀
          </h1>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            سجّل دخولك في ثانية واحدة وكمّل رحلتك العلمية. كل درس جديد = خطوة أقرب للنجاح!
          </p>
          <div className="space-y-4">
            {[
              { icon: Rocket, text: 'الدروس المستنية ليك كتير يلا نخلّيها!', color: 'text-yellow-400' },
              { icon: Zap, text: ' solved في انتظارك. ادخل وخلّصهم!', color: 'text-green-400' },
              { icon: Sparkles, text: 'مستقبلك بيستناك. الخطوة الجاية ليك!', color: 'text-purple-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-blue-50">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <span>{item.text}</span>
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
            <span className="text-2xl font-extrabold text-blue-600">د. حسين علي</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
              {step === 'phone' ? 'ادخل رقم موبايلك 📱' : 'الكود وصلك! 🔐'}
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              {step === 'phone'
                ? 'هنبعتلك كود تحقق على الموبايل. ادخل الرقم وأنتِ جاهز!'
                : `دخلنا الكود على ${phone}. تحقق من الرسالة وأدخل الكود`
              }
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div id="recaptcha-container" />

            {step === 'phone' ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    رقم الموبايل
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01012345678"
                      dir="ltr"
                      className="w-full pr-10 pl-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-left"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || phone.length < 10}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                  بعت الكود! يلا 🚀
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3 text-center">
                    اكتب الكود اللي وصلك
                  </label>
                  <div className="flex gap-2 justify-center" dir="ltr">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { otpInputRefs.current[index] = el; }}
                        type="tel"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  يلا ندخل! ✨
                </button>

                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-slate-500">
                      الكود هيتبعت تاني بعد <span className="font-bold text-blue-600">{countdown}</span> ثانية
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-sm text-blue-600 hover:text-blue-700 font-bold"
                    >
                      ابعت الكود تاني 🔄
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError(''); }}
                  className="w-full flex items-center justify-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition"
                >
                  <ArrowRight className="w-4 h-4" />
                  عايز أغير الرقم
                </button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-slate-600">
              معندكش حساب؟{' '}
              <Link href="/register/otp" className="text-blue-600 hover:text-blue-700 font-bold">
                اعمل حساب جديد 🚀
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <Link href="/login" className="text-sm text-slate-500 hover:text-blue-600 transition font-medium">
                تسجيل الدخول بالإيميل وكلمة المرور
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
