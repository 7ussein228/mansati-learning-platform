'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  Users,
  Settings,
  GraduationCap,
  Award,
  MessageSquare,
  LogOut,
  DollarSign,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  role: 'student' | 'admin';
  name: string;
}

const studentLinks = [
  { href: '/student', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/student/courses', label: 'الكورسات', icon: BookOpen },
  { href: '/student/quizzes', label: 'الاختبارات', icon: FileQuestion },
  { href: '/student/groups', label: 'جروبات النقاش', icon: MessageSquare },
  { href: '/student/certs', label: 'الشهادات', icon: Award },
];

const adminLinks = [
  { href: '/admin', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/admin/courses', label: 'إدارة الكورسات', icon: BookOpen },
  { href: '/admin/quizzes', label: 'إدارة الاختبارات', icon: FileQuestion },
  { href: '/admin/students', label: 'إدارة الطلاب', icon: Users },
  { href: '/admin/subscriptions', label: 'الاشتراكات', icon: DollarSign },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings },
];

export default function Sidebar({ role, name }: SidebarProps) {
  const pathname = usePathname();
  const links = role === 'student' ? studentLinks : adminLinks;

  return (
    <aside
      className="hidden lg:flex lg:flex-col w-64 min-h-screen fixed right-0 top-0"
      style={{
        background: 'var(--card-glass)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderLeft: '1px solid var(--border-plasma)',
      }}
    >
      <div
        className="p-6"
        style={{ borderBottom: '1px solid var(--border-plasma)' }}
      >
        <Link
          href={role === 'student' ? '/student' : '/admin'}
          className="flex items-center gap-2"
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
            }}
          >
            <GraduationCap className="w-6 h-6" style={{ color: 'var(--text-pure)' }} />
          </div>
          <span
            className="text-2xl font-bold"
            style={{
              background: 'linear-gradient(90deg, var(--neon-blue), var(--neon-purple))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Tesla
          </span>
        </Link>
      </div>

      <div
        className="p-4"
        style={{ borderBottom: '1px solid var(--border-plasma)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(0, 210, 255, 0.15)',
              border: '1px solid var(--border-plasma)',
            }}
          >
            <span
              className="font-bold"
              style={{ color: 'var(--neon-blue)' }}
            >
              {name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate" style={{ color: 'var(--text-pure)' }}>
              {name}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
              {role === 'admin' ? 'مدرس / Admin' : 'طالب'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group"
              style={{
                background: isActive ? 'rgba(0, 210, 255, 0.12)' : 'rgba(13, 20, 36, 0.4)',
                borderRight: isActive ? '3px solid var(--neon-blue)' : '3px solid transparent',
                color: isActive ? 'var(--neon-blue)' : 'var(--text-dim)',
                boxShadow: isActive ? '0 0 12px rgba(0, 210, 255, 0.2)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(0, 210, 255, 0.06)';
                  e.currentTarget.style.color = 'var(--text-pure)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(13, 20, 36, 0.4)';
                  e.currentTarget.style.color = 'var(--text-dim)';
                }
              }}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className="w-5 h-5 transition-colors duration-300"
                  style={{ color: isActive ? 'var(--neon-blue)' : 'var(--text-dim)' }}
                />
                <span className="font-medium">{link.label}</span>
              </div>
              <ChevronRight
                className="w-4 h-4 rtl:rotate-180 transition-colors duration-300"
                style={{
                  color: isActive ? 'var(--neon-blue)' : 'var(--text-dim)',
                }}
              />
            </Link>
          );
        })}
      </nav>

      <div
        className="p-4"
        style={{ borderTop: '1px solid var(--border-plasma)' }}
      >
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 font-medium"
            style={{
              background: 'rgba(255, 0, 0, 0.06)',
              color: '#ff4444',
              border: '1px solid rgba(255, 68, 68, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 0, 0, 0.12)';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(255, 68, 68, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 0, 0, 0.06)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </form>
      </div>
    </aside>
  );
}
