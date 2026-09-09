import { NextResponse } from 'next/server';
import { readDB, writeDB, generateId } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import type { Course } from '@/lib/types';

export async function GET() {
  const courses = await readDB<Course>('courses');
  return NextResponse.json({ courses });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, category, price, isFree, image, lessons } = body;

  if (!title || !description) {
    return NextResponse.json({ error: 'العنوان والوصف مطلوبان' }, { status: 400 });
  }

  const courses = await readDB<Course>('courses');
  const totalDuration = (lessons || []).reduce((sum: number, l: any) => sum + (l.duration || 0), 0);

  const newCourse: Course = {
    id: generateId(),
    title,
    description,
    category: category || 'فيزياء',
    price: isFree ? 0 : (price || 0),
    isFree: !!isFree,
    image: image || '',
    lessons: lessons || [],
    rating: 0,
    studentsCount: 0,
    duration: totalDuration,
  };

  courses.push(newCourse);
  await writeDB('courses', courses);

  return NextResponse.json({ success: true, course: newCourse });
}
