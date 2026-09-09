import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { seedDatabase } from '@/lib/seed';

export const metadata: Metadata = {
  title: 'منصتي - منصة تعليمية متكاملة',
  description: 'منصة تعليمية للمرحلة الثانوية مع الأستاذ أحمد محمد',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  await seedDatabase();
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased font-[family-name:var(--font-cairo)]">
        {children}
      </body>
    </html>
  );
}
