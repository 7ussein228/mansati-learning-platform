'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, BookOpen, GraduationCap, LogOut, User } from 'lucide-react';
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
    <>
      <style>{`
        .navbar-desktop-nav { display: none; }
        .navbar-desktop-actions { display: none; }
        .navbar-hamburger { display: block; }
        .navbar-mobile-menu { display: flex; }
        @media (min-width: 768px) {
          .navbar-desktop-nav { display: flex; }
          .navbar-desktop-actions { display: flex; }
          .navbar-hamburger { display: none; }
          .navbar-mobile-menu { display: none !important; }
        }
      `}</style>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(5, 8, 19, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-plasma)',
        }}
      >
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-green))',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(0, 210, 255, 0.3)',
                }}
              >
                <GraduationCap style={{ width: '1.5rem', height: '1.5rem', color: 'var(--bg-space)' }} />
              </div>
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-green))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Tesla
              </span>
            </Link>

            <div className="navbar-desktop-nav" style={{ alignItems: 'center', gap: '2rem' }}>
              {[
                { href: '/', label: 'الرئيسية' },
                { href: '#courses', label: 'الكورسات' },
                { href: '#features', label: 'المميزات' },
                { href: '#contact', label: 'تواصل معنا' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: 'var(--text-dim)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    padding: '0.25rem 0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--neon-blue)';
                    e.currentTarget.style.textShadow = '0 0 15px rgba(0, 210, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-dim)';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="navbar-desktop-actions" style={{ alignItems: 'center', gap: '0.75rem' }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Link
                    href={user.role === 'admin' ? '/admin' : '/student'}
                    className="btn-neon"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: 'var(--card-glass)',
                      border: '1px solid var(--border-plasma)',
                      borderRadius: '0.75rem',
                      color: 'var(--neon-blue)',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      fontSize: '0.875rem',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--neon-blue)';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 210, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-plasma)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <User style={{ width: '1rem', height: '1rem' }} />
                    لوحة التحكم
                  </Link>
                  <Link
                    href="/"
                    style={{
                      padding: '0.5rem',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-dim)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--neon-blue)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-dim)';
                    }}
                  >
                    <LogOut style={{ width: '1.125rem', height: '1.125rem' }} />
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Link
                    href="/login"
                    style={{
                      padding: '0.5rem 1.25rem',
                      color: 'var(--neon-blue)',
                      border: '1px solid var(--border-plasma)',
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      background: 'transparent',
                      fontSize: '0.875rem',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--neon-blue)';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 210, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-plasma)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/register"
                    className="btn-neon"
                    style={{
                      padding: '0.5rem 1.25rem',
                      background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
                      color: 'var(--text-pure)',
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 210, 255, 0.4)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <BookOpen style={{ width: '1rem', height: '1rem' }} />
                    سجل مجاناً
                  </Link>
                </div>
              )}
            </div>

            <button
              className="navbar-hamburger"
              style={{
                padding: '0.5rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
              }}
              onClick={() => setOpen(!open)}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--neon-blue)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-dim)';
              }}
            >
              {open ? <X style={{ width: '1.5rem', height: '1.5rem' }} /> : <Menu style={{ width: '1.5rem', height: '1.5rem' }} />}
            </button>
          </div>

          {open && (
            <div
              className="navbar-mobile-menu"
              style={{
                padding: '1rem',
                background: 'rgba(5, 8, 19, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderTop: '1px solid var(--border-plasma)',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {[
                { href: '/', label: 'الرئيسية' },
                { href: '#courses', label: 'الكورسات' },
                { href: '#features', label: 'المميزات' },
                { href: '#contact', label: 'تواصل معنا' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-dim)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    borderRadius: '0.5rem',
                    transition: 'all 0.3s ease',
                    background: 'transparent',
                  }}
                  onClick={() => setOpen(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--neon-blue)';
                    e.currentTarget.style.background = 'rgba(0, 210, 255, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-dim)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div
                style={{
                  marginTop: '0.5rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-plasma)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {user ? (
                  <Link
                    href={user.role === 'admin' ? '/admin' : '/student'}
                    className="btn-neon"
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
                      color: 'var(--text-pure)',
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      fontWeight: 600,
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                    onClick={() => setOpen(false)}
                  >
                    <User style={{ width: '1rem', height: '1rem' }} />
                    لوحة التحكم
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      style={{
                        padding: '0.75rem 1rem',
                        color: 'var(--neon-blue)',
                        border: '1px solid var(--border-plasma)',
                        borderRadius: '0.75rem',
                        textDecoration: 'none',
                        fontWeight: 600,
                        textAlign: 'center',
                        background: 'transparent',
                      }}
                      onClick={() => setOpen(false)}
                    >
                      تسجيل الدخول
                    </Link>
                    <Link
                      href="/register"
                      className="btn-neon"
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
                        color: 'var(--text-pure)',
                        borderRadius: '0.75rem',
                        textDecoration: 'none',
                        fontWeight: 600,
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                      }}
                      onClick={() => setOpen(false)}
                    >
                      <BookOpen style={{ width: '1rem', height: '1rem' }} />
                      سجل مجاناً
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
