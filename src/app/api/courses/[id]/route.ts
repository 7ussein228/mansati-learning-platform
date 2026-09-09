import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import type { Course } from '@/lib/types';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const courses = await readDB<Course>('courses');
  const course = courses.find((c) => c.id === id);
  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ course });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const courses = await readDB<Course>('courses');
  const idx = courses.findIndex((c) => c.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { title, description, category, price, isFree, image, lessons } = body;
  const totalDuration = (lessons || []).reduce((sum: number, l: any) => sum + (l.duration || 0), 0);

  courses[idx] = {
    ...courses[idx],
    ...(title && { title }),
    ...(description && { description }),
    ...(category && { category }),
    ...(price !== undefined && { price: isFree ? 0 : price }),
    ...(isFree !== undefined && { isFree }),
    ...(image && { image }),
    ...(lessons && { lessons }),
    ...(lessons && { duration: totalDuration }),
  };

  await writeDB('courses', courses);
  return NextResponse.json({ success: true, course: courses[idx] });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const courses = await readDB<Course>('courses');
  const filtered = courses.filter((c) => c.id !== id);
  if (filtered.length === courses.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await writeDB('courses', filtered);
  return NextResponse.json({ success: true });
}
