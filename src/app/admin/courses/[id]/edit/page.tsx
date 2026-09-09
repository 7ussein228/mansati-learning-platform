import { notFound } from 'next/navigation';
import { readDB } from '@/lib/db';
import type { Course } from '@/lib/types';
import CourseForm from '../../CourseForm';

export const dynamic = 'force-dynamic';

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const courses = await readDB<Course>('courses');
  const course = courses.find((c) => c.id === id);
  if (!course) notFound();
  return <CourseForm mode="edit" course={course} />;
}
