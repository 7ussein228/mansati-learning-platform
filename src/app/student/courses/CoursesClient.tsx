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
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن كورس..."
            className="w-full pr-10 pl-10 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCat('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCat === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCat === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">لا توجد كورسات تطابق البحث</p>
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
