import { readDB } from '@/lib/db';
import type { Quiz, Course } from '@/lib/types';
import AdminQuizzesClient from './AdminQuizzesClient';

export const dynamic = 'force-dynamic';

export default async function AdminQuizzes() {
  const quizzes = await readDB<Quiz>('quizzes');
  const courses = await readDB<Course>('courses');
  return <AdminQuizzesClient quizzes={quizzes} courses={courses} />;
}
