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
      <div
        className="lg:hidden sticky top-0 z-40 px-4 h-14 flex items-center justify-between"
        style={{ background: 'rgba(5,8,19,0.9)', borderBottom: '1px solid var(--border-plasma)', backdropFilter: 'blur(20px)' }}
      >
        <Link href={role === 'student' ? '/student' : '/admin'} className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6" style={{ color: 'var(--neon-blue)' }} />
          <span
            className="text-xl font-bold"
            style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Tesla
          </span>
        </Link>
        <button onClick={() => setOpen(true)} className="p-2" style={{ color: 'var(--text-pure)' }}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div
            className="relative mr-auto w-72 max-w-[85%] h-full flex flex-col"
            style={{ background: 'rgba(5,8,19,0.98)', borderLeft: '1px solid var(--border-plasma)', backdropFilter: 'blur(24px)' }}
          >
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-plasma)' }}>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6" style={{ color: 'var(--neon-blue)' }} />
                <span
                  className="text-xl font-bold"
                  style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  Tesla
                </span>
              </div>
              <button onClick={() => setOpen(false)} style={{ color: 'var(--text-pure)' }} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4" style={{ borderBottom: '1px solid var(--border-plasma)' }}>
              <p className="font-semibold" style={{ color: 'var(--text-pure)' }}>{name}</p>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
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
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition"
                    style={{
                      background: isActive ? 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' : 'transparent',
                      color: isActive ? 'white' : 'var(--text-dim)',
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4" style={{ borderTop: '1px solid var(--border-plasma)' }}>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition"
                  style={{ color: '#ef4444' }}
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
