import { NextResponse } from 'next/server';
import { readDB, getSettings } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import type { User, Course, Quiz, Subscription } from '@/lib/types';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const users = await readDB<User>('users');
  const courses = await readDB<Course>('courses');
  const quizzes = await readDB<Quiz>('quizzes');
  const subscriptions = await readDB<Subscription>('subscriptions');
  const settings = await getSettings();

  const studentCount = users.filter((u) => u.role === 'student').length;
  const activeSubs = subscriptions.filter((s) => s.status === 'نشط').length;
  const totalRevenue = subscriptions.reduce((s, sub) => s + sub.amount, 0);

  return NextResponse.json({
    students: studentCount,
    courses: courses.length,
    quizzes: quizzes.length,
    subscriptions: activeSubs,
    revenue: totalRevenue,
    settings,
  });
}
