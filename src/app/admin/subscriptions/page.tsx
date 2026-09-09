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
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">الاشتراكات</h1>
        <p className="text-slate-500 mt-1">إدارة اشتراكات الطلاب والإيرادات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-l from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-bold">إجمالي</span>
          </div>
          <div className="text-3xl font-extrabold">{stats.totalRevenue.toLocaleString('ar-EG')} ج.م</div>
          <div className="text-sm text-green-100 mt-1">إجمالي الإيرادات</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="flex items-center gap-1 text-xs text-green-600 font-bold">
              <TrendingUp className="w-3 h-3" />
              نشط
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.active}</div>
          <div className="text-sm text-slate-500 mt-1">اشتراك نشط</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <CreditCard className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{subs.length}</div>
          <div className="text-sm text-slate-500 mt-1">إجمالي الاشتراكات</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-bold text-slate-900">جميع الاشتراكات</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-right text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold">الطالب</th>
                <th className="p-4 font-semibold">النوع</th>
                <th className="p-4 font-semibold">المبلغ</th>
                <th className="p-4 font-semibold">تاريخ البدء</th>
                <th className="p-4 font-semibold">تاريخ الانتهاء</th>
                <th className="p-4 font-semibold">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subs.length > 0 ? (
                subs.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                          {s.studentName.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900 text-sm">{s.studentName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                        s.type === 'سنوي' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {s.type}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900 text-sm">{s.amount} ج.م</td>
                    <td className="p-4 text-sm text-slate-600 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(s.startDate).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-4 text-sm text-slate-600 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(s.endDate).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        s.status === 'نشط' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {s.status === 'نشط' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-2" />
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
