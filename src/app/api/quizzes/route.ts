import { NextResponse } from 'next/server';
import { readDB, writeDB, generateId } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import type { Quiz } from '@/lib/types';

export async function GET() {
  const quizzes = await readDB<Quiz>('quizzes');
  return NextResponse.json({ quizzes });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, courseId, duration, passingScore, questions } = body;

  if (!title || !description || !courseId) {
    return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
  }

  if (!questions || questions.length === 0) {
    return NextResponse.json({ error: 'يجب إضافة سؤال واحد على الأقل' }, { status: 400 });
  }

  const quizzes = await readDB<Quiz>('quizzes');
  const newQuiz: Quiz = {
    id: generateId(),
    title,
    description,
    courseId,
    questions: questions.map((q: any, i: number) => ({
      id: `q${Date.now()}_${i}`,
      text: q.text,
      type: q.type || 'multiple',
      options: q.options,
      correctAnswer: q.correctAnswer,
      points: q.points || 10,
    })),
    duration: duration || 20,
    passingScore: passingScore || 60,
  };

  quizzes.push(newQuiz);
  await writeDB('quizzes', quizzes);

  return NextResponse.json({ success: true, quiz: newQuiz });
}
