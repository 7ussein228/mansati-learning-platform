import Link from 'next/link';
import { Globe, Play, Send, GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  settings?: {
    platformName?: string;
    email?: string;
    phone?: string;
    facebook?: string;
    youtube?: string;
    telegram?: string;
  };
}

export default function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 pt-12 pb-6 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">{settings?.platformName || 'منصتي'}</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              منصة تعليمية متكاملة للمرحلة الثانوية، نوفر لك أفضل الكورسات والاختبارات والشهادات المعتمدة.
            </p>
            <div className="flex gap-3">
              <a href={settings?.facebook || '#'} className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition">
                <Globe className="w-4 h-4" />
              </a>
              <a href={settings?.youtube || '#'} className="w-9 h-9 bg-slate-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition">
                <Play className="w-4 h-4" />
              </a>
              <a href={settings?.telegram || '#'} className="w-9 h-9 bg-slate-800 hover:bg-sky-500 rounded-lg flex items-center justify-center transition">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-blue-400 transition">الرئيسية</Link></li>
              <li><Link href="/#courses" className="hover:text-blue-400 transition">الكورسات</Link></li>
              <li><Link href="/login" className="hover:text-blue-400 transition">تسجيل الدخول</Link></li>
              <li><Link href="/register" className="hover:text-blue-400 transition">إنشاء حساب</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">التصنيفات</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/student/courses" className="hover:text-blue-400 transition">الفيزياء</Link></li>
              <li><Link href="/student/courses" className="hover:text-blue-400 transition">الرياضيات</Link></li>
              <li><Link href="/student/courses" className="hover:text-blue-400 transition">الكيمياء</Link></li>
              <li><Link href="/student/courses" className="hover:text-blue-400 transition">الأحياء</Link></li>
              <li><Link href="/student/courses" className="hover:text-blue-400 transition">الإنجليزي</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">تواصل معنا</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>{settings?.email || 'info@mansati.com'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>{settings?.phone || '01012345678'}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 mt-1" />
                <span>القاهرة، مصر</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm text-slate-500">
          © {year} {settings?.platformName || 'منصتي'}. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
