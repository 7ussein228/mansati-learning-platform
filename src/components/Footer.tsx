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
    <footer
      id="contact"
      className="relative pt-12 pb-6 mt-20"
      style={{
        backgroundColor: 'var(--bg-space)',
        color: 'var(--text-dim)',
        borderTop: '1px solid var(--border-plasma)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' }}
              >
                <GraduationCap className="w-6 h-6" style={{ color: 'var(--text-pure)' }} />
              </div>
              <span
                className="text-2xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {settings?.platformName || 'Tesla'}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-dim)' }}>
              منصة تعليمية متكاملة للمرحلة الثانوية، نوفر لك أفضل الكورسات والاختبارات والشهادات المعتمدة.
            </p>
            <div className="flex gap-3">
              <a
                href={settings?.facebook || '#'}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  background: 'var(--card-glass)',
                  border: '1px solid var(--border-plasma)',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 210, 255, 0.4)';
                  e.currentTarget.style.borderColor = 'var(--neon-blue)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--border-plasma)';
                }}
              >
                <Globe className="w-4 h-4" style={{ color: 'var(--text-pure)' }} />
              </a>
              <a
                href={settings?.youtube || '#'}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  background: 'var(--card-glass)',
                  border: '1px solid var(--border-plasma)',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 210, 255, 0.4)';
                  e.currentTarget.style.borderColor = 'var(--neon-blue)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--border-plasma)';
                }}
              >
                <Play className="w-4 h-4" style={{ color: 'var(--text-pure)' }} />
              </a>
              <a
                href={settings?.telegram || '#'}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  background: 'var(--card-glass)',
                  border: '1px solid var(--border-plasma)',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 210, 255, 0.4)';
                  e.currentTarget.style.borderColor = 'var(--neon-blue)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--border-plasma)';
                }}
              >
                <Send className="w-4 h-4" style={{ color: 'var(--text-pure)' }} />
              </a>
            </div>
          </div>

          <div>
            <h3
              className="font-bold text-lg mb-4"
              style={{ color: 'var(--text-pure)' }}
            >
              روابط سريعة
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="transition-all duration-300"
                  style={{ color: 'var(--text-dim)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--neon-blue)';
                    e.currentTarget.style.textShadow = '0 0 10px rgba(0, 210, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-dim)';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/#courses"
                  className="transition-all duration-300"
                  style={{ color: 'var(--text-dim)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--neon-blue)';
                    e.currentTarget.style.textShadow = '0 0 10px rgba(0, 210, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-dim)';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  الكورسات
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="transition-all duration-300"
                  style={{ color: 'var(--text-dim)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--neon-blue)';
                    e.currentTarget.style.textShadow = '0 0 10px rgba(0, 210, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-dim)';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  تسجيل الدخول
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="transition-all duration-300"
                  style={{ color: 'var(--text-dim)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--neon-blue)';
                    e.currentTarget.style.textShadow = '0 0 10px rgba(0, 210, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-dim)';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  إنشاء حساب
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3
              className="font-bold text-lg mb-4"
              style={{ color: 'var(--text-pure)' }}
            >
              التصنيفات
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/student/courses"
                  className="transition-all duration-300"
                  style={{ color: 'var(--text-dim)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--neon-blue)';
                    e.currentTarget.style.textShadow = '0 0 10px rgba(0, 210, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-dim)';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  الفيزياء
                </Link>
              </li>
              <li>
                <Link
                  href="/student/courses"
                  className="transition-all duration-300"
                  style={{ color: 'var(--text-dim)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--neon-blue)';
                    e.currentTarget.style.textShadow = '0 0 10px rgba(0, 210, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-dim)';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  الرياضيات
                </Link>
              </li>
              <li>
                <Link
                  href="/student/courses"
                  className="transition-all duration-300"
                  style={{ color: 'var(--text-dim)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--neon-blue)';
                    e.currentTarget.style.textShadow = '0 0 10px rgba(0, 210, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-dim)';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  الكيمياء
                </Link>
              </li>
              <li>
                <Link
                  href="/student/courses"
                  className="transition-all duration-300"
                  style={{ color: 'var(--text-dim)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--neon-blue)';
                    e.currentTarget.style.textShadow = '0 0 10px rgba(0, 210, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-dim)';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  الأحياء
                </Link>
              </li>
              <li>
                <Link
                  href="/student/courses"
                  className="transition-all duration-300"
                  style={{ color: 'var(--text-dim)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--neon-blue)';
                    e.currentTarget.style.textShadow = '0 0 10px rgba(0, 210, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-dim)';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  الإنجليزي
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3
              className="font-bold text-lg mb-4"
              style={{ color: 'var(--text-pure)' }}
            >
              تواصل معنا
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" style={{ color: 'var(--neon-blue)' }} />
                <span>{settings?.email || 'info@mansati.com'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" style={{ color: 'var(--neon-blue)' }} />
                <span>{settings?.phone || '01012345678'}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" style={{ color: 'var(--neon-blue)' }} />
                <span>القاهرة، مصر</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 text-center text-sm"
          style={{ color: 'var(--text-dim)', borderTop: '1px solid var(--border-plasma)' }}
        >
          © {year} {settings?.platformName || 'Tesla'}. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
