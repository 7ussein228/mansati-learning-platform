'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  Award,
  MessageSquare,
  Users,
  Settings,
  GraduationCap,
  LogOut,
  Menu,
  X,
  DollarSign,
} from 'lucide-react';

const studentLinks = [
  { href: '/student', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/student/courses', label: 'الكورسات', icon: BookOpen },
  { href: '/student/quizzes', label: 'الاختبارات', icon: FileQuestion },
  { href: '/student/groups', label: 'جروبات النقاش', icon: MessageSquare },
  { href: '/student/certs', label: 'الشهادات', icon: Award },
];

const adminLinks = [
  { href: '/admin', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/admin/courses', label: 'الكورسات', icon: BookOpen },
  { href: '/admin/quizzes', label: 'الاختبارات', icon: FileQuestion },
  { href: '/admin/students', label: 'الطلاب', icon: Users },
  { href: '/admin/subscriptions', label: 'الاشتراكات', icon: DollarSign },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings },
];

export default function MobileTopBar({ role, name }: { role: 'student' | 'admin'; name: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = role === 'student' ? studentLinks : adminLinks;

  return (
    <>
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between">
        <Link href={role === 'student' ? '/student' : '/admin'} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-blue-600">منصتي</span>
        </Link>
        <button onClick={() => setOpen(true)} className="p-2 text-slate-700">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative mr-auto w-72 max-w-[85%] h-full bg-white flex flex-col shadow-xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-blue-600">منصتي</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-200">
              <p className="font-semibold text-slate-800">{name}</p>
              <p className="text-xs text-slate-500">
                {role === 'admin' ? 'مدرس / Admin' : 'طالب'}
              </p>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {links.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-200">
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  تسجيل الخروج
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
