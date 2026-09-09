import { readDB } from '@/lib/db';
import QuizCard from '@/components/QuizCard';
import type { Quiz, Course } from '@/lib/types';
import QuizzesClient from './QuizzesClient';

export const dynamic = 'force-dynamic';

export default async function StudentQuizzes() {
  const quizzes = await readDB<Quiz>('quizzes');
  const courses = await readDB<Course>('courses');

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">الاختبارات</h1>
        <p className="text-slate-500 mt-1">اختبر مستواك في مختلف المواد</p>
      </div>

      <QuizzesClient quizzes={quizzes} courses={courses} />
    </div>
  );
}
