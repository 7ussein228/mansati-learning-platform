import { NextResponse } from 'next/server';
import { readDB, writeDB, generateId } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import type { Quiz, QuizAttempt } from '@/lib/types';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { answers } = await request.json();
  const quizzes = await readDB<Quiz>('quizzes');
  const quiz = quizzes.find((q) => q.id === id);
  if (!quiz) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  let score = 0;
  quiz.questions.forEach((q) => {
    if (answers[q.id] === q.correctAnswer) score += q.points;
  });
  const totalPoints = quiz.questions.reduce((s, q) => s + q.points, 0);
  const percentage = Math.round((score / totalPoints) * 100);
  const passed = percentage >= quiz.passingScore;

  const attempts = await readDB<QuizAttempt>('attempts');
  const attempt: QuizAttempt = {
    id: generateId(),
    studentId: user.id,
    quizId: quiz.id,
    score,
    totalPoints,
    percentage,
    passed,
    completedAt: new Date().toISOString(),
    answers,
  };
  attempts.push(attempt);
  await writeDB('attempts', attempts);

  return NextResponse.json({ success: true, attempt });
}
