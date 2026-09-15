import { readDB } from '@/lib/db';
import type { Course, Category } from '@/lib/types';
import CoursesClient from './CoursesClient';

export const dynamic = 'force-dynamic';

export default async function StudentCourses() {
  const courses = await readDB<Course>('courses');
  const categories: Category[] = ['فيزياء', 'رياضيات', 'كيمياء', 'أحياء', 'إنجليزي'];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--text-pure)' }}>الكورسات</h1>
        <p className="mt-1" style={{ color: 'var(--text-dim)' }}>اختر الكورس المناسب لك وابدأ رحلتك التعليمية</p>
      </div>

      <CoursesClient courses={courses} categories={categories} />
    </div>
  );
}
