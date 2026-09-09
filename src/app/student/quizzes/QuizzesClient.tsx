'use client';

import { useMemo, useState } from 'react';
import QuizCard from '@/components/QuizCard';
import type { Quiz, Course } from '@/lib/types';
import { Search, X } from 'lucide-react';

interface Props {
  quizzes: Quiz[];
  courses: Course[];
}

export default function QuizzesClient({ quizzes, courses }: Props) {
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return quizzes.filter((q) => {
      const matchSearch =
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.description.toLowerCase().includes(search.toLowerCase());
      const matchCourse = courseFilter === 'all' || q.courseId === courseFilter;
      return matchSearch && matchCourse;
    });
  }, [quizzes, search, courseFilter]);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن اختبار..."
            className="w-full pr-10 pl-10 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCourseFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              courseFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            الكل
          </button>
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => setCourseFilter(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                courseFilter === c.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.title.length > 25 ? c.title.slice(0, 25) + '...' : c.title}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">لا توجد اختبارات مطابقة</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((q) => {
            const course = courses.find((c) => c.id === q.courseId);
            return <QuizCard key={q.id} quiz={q} courseName={course?.title} />;
          })}
        </div>
      )}
    </>
  );
}
