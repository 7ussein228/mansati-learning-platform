'use client';

import { useMemo, useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { Search, Users as UsersIcon, Mail, Calendar, Sparkles, ShieldCheck } from 'lucide-react';

export default function AdminStudents() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/students')
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.students || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">إدارة الطلاب</h1>
        <p className="text-slate-500 mt-1">جميع الطلاب المسجلين في المنصة ({filtered.length})</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو الإيميل..."
            className="w-full pr-10 pl-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-right text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold">الطالب</th>
                <th className="p-4 font-semibold">الإيميل</th>
                <th className="p-4 font-semibold">تاريخ التسجيل</th>
                <th className="p-4 font-semibold">النقاط</th>
                <th className="p-4 font-semibold">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1">
                          {u.name}
                          {u.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />}
                        </div>
                        {u.phone && <div className="text-xs text-slate-500">{u.phone}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <a href={`mailto:${u.email}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {u.email}
                    </a>
                  </td>
                  <td className="p-4 text-sm text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(u.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      {u.points}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                      u.status === 'blocked'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {u.status === 'blocked' ? 'محظور' : 'نشط'}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <UsersIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    {search ? 'لا توجد نتائج بحث' : 'لا يوجد طلاب مسجلين بعد.'}
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
