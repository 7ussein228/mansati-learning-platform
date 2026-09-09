import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import type { Quiz } from '@/lib/types';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quizzes = await readDB<Quiz>('quizzes');
  const quiz = quizzes.find((q) => q.id === id);
  if (!quiz) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ quiz });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const quizzes = await readDB<Quiz>('quizzes');
  const idx = quizzes.findIndex((q) => q.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { title, description, courseId, duration, passingScore, questions } = body;

  quizzes[idx] = {
    ...quizzes[idx],
    ...(title && { title }),
    ...(description && { description }),
    ...(courseId && { courseId }),
    ...(duration && { duration }),
    ...(passingScore !== undefined && { passingScore }),
    ...(questions && {
      questions: questions.map((q: any, i: number) => ({
        id: q.id || `q${Date.now()}_${i}`,
        text: q.text,
        type: q.type || 'multiple',
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points || 10,
      })),
    }),
  };

  await writeDB('quizzes', quizzes);
  return NextResponse.json({ success: true, quiz: quizzes[idx] });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const quizzes = await readDB<Quiz>('quizzes');
  const filtered = quizzes.filter((q) => q.id !== id);
  if (filtered.length === quizzes.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await writeDB('quizzes', filtered);
  return NextResponse.json({ success: true });
}
