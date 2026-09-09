import { notFound } from 'next/navigation';
import { readDB } from '@/lib/db';
import type { Quiz, Course } from '@/lib/types';
import QuizTaker from './QuizTaker';

export const dynamic = 'force-dynamic';

export default async function QuizDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quizzes = await readDB<Quiz>('quizzes');
  const courses = await readDB<Course>('courses');
  const quiz = quizzes.find((q) => q.id === id);
  if (!quiz) notFound();
  const course = courses.find((c) => c.id === quiz.courseId);

  return <QuizTaker quiz={quiz} courseName={course?.title} />;
}
