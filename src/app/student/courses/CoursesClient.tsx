'use client';

import { useMemo, useState } from 'react';
import CourseCard from '@/components/CourseCard';
import type { Course, Category } from '@/lib/types';
import { Search, X } from 'lucide-react';

interface Props {
  courses: Course[];
  categories: Category[];
}

export default function CoursesClient({ courses, categories }: Props) {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState<Category | 'all'>('all');

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCat === 'all' || c.category === activeCat;
      return matchSearch && matchCat;
    });
  }, [courses, search, activeCat]);

  return (
    <>
      <div
        className="p-4 space-y-4"
        style={{
          background: 'var(--card-glass)',
          border: '1px solid var(--border-plasma)',
          borderRadius: '20px',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-dim)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن كورس..."
            className="input-space w-full pr-10 pl-10 py-2.5 rounded-xl outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-plasma)',
              color: 'var(--text-pure)',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-dim)' }}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCat('all')}
            className="tab-btn px-4 py-2 rounded-full text-sm font-medium transition"
            style={{
              background: activeCat === 'all' ? 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' : 'rgba(255,255,255,0.06)',
              color: activeCat === 'all' ? 'white' : 'var(--text-dim)',
              border: activeCat === 'all' ? 'none' : '1px solid var(--border-plasma)',
            }}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className="tab-btn px-4 py-2 rounded-full text-sm font-medium transition"
              style={{
                background: activeCat === cat ? 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' : 'rgba(255,255,255,0.06)',
                color: activeCat === cat ? 'white' : 'var(--text-dim)',
                border: activeCat === cat ? 'none' : '1px solid var(--border-plasma)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className="p-12 text-center"
          style={{
            background: 'var(--card-glass)',
            border: '1px solid var(--border-plasma)',
            borderRadius: '20px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <p style={{ color: 'var(--text-dim)' }}>لا توجد كورسات تطابق البحث</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </>
  );
}
