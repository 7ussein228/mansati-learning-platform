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
            placeholder="ابحث عن اختبار..."
            className="input-space w-full pr-10 pl-10 py-2.5 rounded-xl outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-plasma)',
              color: 'var(--text-pure)',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }}>
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCourseFilter('all')}
            className="tab-btn px-4 py-2 rounded-full text-sm font-medium transition"
            style={{
              background: courseFilter === 'all' ? 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' : 'rgba(255,255,255,0.06)',
              color: courseFilter === 'all' ? 'white' : 'var(--text-dim)',
              border: courseFilter === 'all' ? 'none' : '1px solid var(--border-plasma)',
            }}
          >
            الكل
          </button>
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => setCourseFilter(c.id)}
              className="tab-btn px-4 py-2 rounded-full text-sm font-medium transition"
              style={{
                background: courseFilter === c.id ? 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' : 'rgba(255,255,255,0.06)',
                color: courseFilter === c.id ? 'white' : 'var(--text-dim)',
                border: courseFilter === c.id ? 'none' : '1px solid var(--border-plasma)',
              }}
            >
              {c.title.length > 25 ? c.title.slice(0, 25) + '...' : c.title}
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
          <p style={{ color: 'var(--text-dim)' }}>لا توجد اختبارات مطابقة</p>
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
