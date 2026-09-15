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
        <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--text-pure)' }}>إدارة الطلاب</h1>
        <p className="mt-1" style={{ color: 'var(--text-dim)' }}>جميع الطلاب المسجلين في المنصة ({filtered.length})</p>
      </div>

      <div
        className="p-4"
        style={{
          background: 'var(--card-glass)',
          border: '1px solid var(--border-plasma)',
          borderRadius: '20px',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-dim)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو الإيميل..."
            className="w-full pr-10 pl-3 py-2.5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-plasma)',
              borderRadius: '12px',
              color: 'var(--text-pure)',
              outline: 'none',
            }}
          />
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-right text-xs" style={{ background: 'rgba(0,210,255,0.08)' }}>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>الطالب</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>الإيميل</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>تاريخ التسجيل</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>النقاط</th>
                <th className="p-4 font-semibold" style={{ color: 'var(--neon-blue)' }}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr
                  key={u.id}
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
                        style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))', color: '#fff' }}
                      >
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm flex items-center gap-1" style={{ color: 'var(--text-pure)' }}>
                          {u.name}
                          {u.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5" style={{ color: 'var(--neon-blue)' }} />}
                        </div>
                        {u.phone && <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{u.phone}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <a href={`mailto:${u.email}`} className="text-sm flex items-center gap-1 transition-all duration-300" style={{ color: 'var(--neon-blue)' }}>
                      <Mail className="w-3.5 h-3.5" />
                      {u.email}
                    </a>
                  </td>
                  <td className="p-4 text-sm flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(u.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="p-4">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(255,190,11,0.15)', color: 'var(--atom-gold)' }}
                    >
                      <Sparkles className="w-3 h-3" />
                      {u.points}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className="inline-block text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: u.status === 'blocked' ? 'rgba(255,80,80,0.15)' : 'rgba(0,245,212,0.15)',
                        color: u.status === 'blocked' ? '#ff5050' : 'var(--neon-green)',
                      }}
                    >
                      {u.status === 'blocked' ? 'محظور' : 'نشط'}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="p-12 text-center" style={{ color: 'var(--text-dim)' }}>
                    <UsersIcon className="w-12 h-12 mx-auto mb-2" style={{ color: 'rgba(148,163,184,0.3)' }} />
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
