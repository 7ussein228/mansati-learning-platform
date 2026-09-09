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
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-l border-slate-200 min-h-screen fixed right-0 top-0">
      <div className="p-6 border-b border-slate-200">
        <Link href={role === 'student' ? '/student' : '/admin'} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-blue-600">منصتي</span>
        </Link>
      </div>

      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold">
              {name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 truncate">{name}</p>
            <p className="text-xs text-slate-500">
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
              className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'} rtl:rotate-180`} />
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition font-medium"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </form>
      </div>
    </aside>
  );
}
