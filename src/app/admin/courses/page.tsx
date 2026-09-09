import { readDB } from '@/lib/db';
import type { Course } from '@/lib/types';
import AdminCoursesClient from './AdminCoursesClient';

export const dynamic = 'force-dynamic';

export default async function AdminCourses() {
  const courses = await readDB<Course>('courses');
  return <AdminCoursesClient courses={courses} />;
}
