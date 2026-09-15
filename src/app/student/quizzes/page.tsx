import { readDB } from '@/lib/db';
import type { Quiz, Course } from '@/lib/types';
import QuizzesClient from './QuizzesClient';

export const dynamic = 'force-dynamic';

export default async function StudentQuizzes() {
  const quizzes = await readDB<Quiz>('quizzes');
  const courses = await readDB<Course>('courses');

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--text-pure)' }}>الاختبارات</h1>
        <p className="mt-1" style={{ color: 'var(--text-dim)' }}>اختبر مستواك في مختلف المواد</p>
      </div>

      <QuizzesClient quizzes={quizzes} courses={courses} />
    </div>
  );
}
