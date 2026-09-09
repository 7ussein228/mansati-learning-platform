'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, BookOpen, GraduationCap } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  user?: { name: string; role: string } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isStudent = pathname?.startsWith('/student');
  const isAdmin = pathname?.startsWith('/admin');

  if (isStudent || isAdmin) return null;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-600">منصتي</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-slate-700 hover:text-blue-600 transition font-medium">
              الرئيسية
            </Link>
            <Link href="#courses" className="text-slate-700 hover:text-blue-600 transition font-medium">
              الكورسات
            </Link>
            <Link href="#features" className="text-slate-700 hover:text-blue-600 transition font-medium">
              المميزات
            </Link>
            <Link href="#contact" className="text-slate-700 hover:text-blue-600 transition font-medium">
              تواصل معنا
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                href={user.role === 'admin' ? '/admin' : '/student'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                لوحة التحكم
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  سجل مجاناً
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-slate-700"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block py-2 text-slate-700 font-medium">
              الرئيسية
            </Link>
            <Link href="#courses" className="block py-2 text-slate-700 font-medium">
              الكورسات
            </Link>
            <Link href="#features" className="block py-2 text-slate-700 font-medium">
              المميزات
            </Link>
            <Link href="#contact" className="block py-2 text-slate-700 font-medium">
              تواصل معنا
            </Link>
            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <Link
                  href={user.role === 'admin' ? '/admin' : '/student'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center font-medium"
                >
                  لوحة التحكم
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg text-center font-medium"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center font-medium"
                  >
                    سجل مجاناً
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
