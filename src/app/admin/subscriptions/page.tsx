'use client';

import { TrendingUp, Users, DollarSign, CreditCard, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import type { Subscription } from '@/lib/types';

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/subscriptions')
      .then((r) => r.json())
      .then((data) => {
        setSubs(data.subscriptions || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = subs.reduce((s, x) => s + x.amount, 0);
    const active = subs.filter((x) => x.status === 'نشط').length;
    return { totalRevenue, active };
  }, [subs]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--text-pure)' }}>الاشتراكات</h1>
        <p className="mt-1" style={{ color: 'var(--text-dim)' }}>إدارة اشتراكات الطلاب والإيرادات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="p-6"
          style={{
            background: 'linear-gradient(135deg, var(--neon-green), var(--neon-blue))',
            borderRadius: '20px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background: 'rgba(255,255,255,0.2)' }}>إجمالي</span>
          </div>
          <div className="text-3xl font-extrabold">{stats.totalRevenue.toLocaleString('ar-EG')} ج.م</div>
          <div className="text-sm mt-1" style={{ opacity: 0.8 }}>إجمالي الإيرادات</div>
        </div>
        <div
          className="p-6"
          style={{
            background: 'var(--card-glass)',
            border: '1px solid var(--border-plasma)',
            borderRadius: '20px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8" style={{ color: 'var(--neon-blue)' }} />
            <span className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--neon-green)' }}>
              <TrendingUp className="w-3 h-3" />
              نشط
            </span>
          </div>
          <div className="text-3xl font-extrabold" style={{ color: 'var(--text-pure)' }}>{stats.active}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>اشتراك نشط</div>
        </div>
        <div
          className="p-6"
          style={{
            background: 'var(--card-glass)',
            border: '1px solid var(--border-plasma)',
            borderRadius: '20px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <CreditCard className="w-8 h-8" style={{ color: 'var(--atom-gold)' }} />
          </div>
          <div className="text-3xl font-extrabold" style={{ color: 'var(--text-pure)' }}>{subs.length}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>إجمالي الاشتراكات</div>
        </div>
      </div>

      <div
        style={{
          background: 'var(--card-glass)',
          border: '1px solid var(--border-plasma)',
          borderRadius: '20px',
          backdropFilter: 'blur(16px)',
        }}
        className="overflow-hidden"
      >
        <div className="p-5" style={{ borderBottom: '1px solid var(--border-plasma)' }}>
          <h2 className="font-bold" style={{ color: 'var(--text-pure)' }}>جميع الاشتراكات</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-right text-xs" style={{ background: 'rgba(0,210,255,0.08)' }}>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>الطالب</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>النوع</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>المبلغ</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>تاريخ البدء</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>تاريخ الانتهاء</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {subs.length > 0 ? (
                subs.map((s, i) => (
                  <tr
                    key={s.id}
                    className="hover:shadow-[inset_0_0_20px_rgba(0,210,255,0.05)] transition-all"
                    style={{
                      background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                      borderTop: '1px solid var(--border-plasma)',
                    }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{ background: 'rgba(0,210,255,0.15)', color: 'var(--neon-blue)' }}
                        >
                          {s.studentName.charAt(0)}
                        </div>
                        <span className="font-medium text-sm" style={{ color: 'var(--text-pure)' }}>{s.studentName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className="inline-block text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{
                          background: s.type === 'سنوي' ? 'rgba(157,78,221,0.15)' : 'rgba(0,210,255,0.15)',
                          color: s.type === 'سنوي' ? 'var(--neon-purple)' : 'var(--neon-blue)',
                        }}
                      >
                        {s.type}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-sm" style={{ color: 'var(--text-pure)' }}>{s.amount} ج.م</td>
                    <td className="p-4 text-sm flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(s.startDate).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-4 text-sm flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(s.endDate).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-4">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{
                          background: s.status === 'نشط' ? 'rgba(0,245,212,0.15)' : 'rgba(255,80,80,0.15)',
                          color: s.status === 'نشط' ? 'var(--neon-green)' : '#ff5050',
                        }}
                      >
                        {s.status === 'نشط' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center" style={{ color: 'var(--text-dim)' }}>
                    <CreditCard className="w-12 h-12 mx-auto mb-2" style={{ color: 'rgba(148,163,184,0.3)' }} />
                    {loading ? 'جاري التحميل...' : 'لا توجد اشتراكات بعد.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
