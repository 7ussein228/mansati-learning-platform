'use client';

import { useState, useMemo } from 'react';
import type { Quiz } from '@/lib/types';
import {
  Clock,
  FileQuestion,
  Award,
  Target,
  PlayCircle,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  CheckCheck,
  Trophy,
  X as XIcon,
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  quiz: Quiz;
  courseName?: string;
}

type QuizState = 'intro' | 'taking' | 'result';

export default function QuizTaker({ quiz, courseName }: Props) {
  const [state, setState] = useState<QuizState>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60);

  const totalPoints = useMemo(
    () => quiz.questions.reduce((sum, q) => sum + q.points, 0),
    [quiz]
  );

  const result = useMemo(() => {
    let score = 0;
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score += q.points;
        correctCount++;
      }
    });
    const percentage = Math.round((score / totalPoints) * 100);
    return {
      score,
      total: totalPoints,
      percentage,
      passed: percentage >= quiz.passingScore,
      correctCount,
    };
  }, [answers, quiz, totalPoints]);

  const current = quiz.questions[currentIdx];
  const progressPercent = state === 'taking'
    ? Math.round(((currentIdx + 1) / quiz.questions.length) * 100)
    : 0;

  const handleAnswer = (val: string) => {
    setAnswers((a) => ({ ...a, [current.id]: val }));
  };

  const handleSubmit = async () => {
    try {
      await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
    } catch {}
    setState('result');
  };

  const reset = () => {
    setState('intro');
    setCurrentIdx(0);
    setAnswers({});
    setTimeLeft(quiz.duration * 60);
  };

  if (state === 'intro') {
    return (
      <div className="max-w-3xl mx-auto animate-fadeIn">
        <Link
          href="/student/quizzes"
          className="inline-flex items-center gap-2 text-sm mb-6"
          style={{ color: 'var(--neon-blue)' }}
        >
          <ChevronRight className="w-4 h-4" />
          العودة للاختبارات
        </Link>

        <div
          className="overflow-hidden"
          style={{
            background: 'var(--card-glass)',
            border: '1px solid var(--border-plasma)',
            borderRadius: '20px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div
            className="p-8 text-center"
            style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
            >
              <FileQuestion className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2 text-white">{quiz.title}</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>{quiz.description}</p>
            {courseName && (
              <span
                className="inline-block mt-3 px-3 py-1 rounded-full text-xs"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: 'white' }}
              >
                {courseName}
              </span>
            )}
          </div>

          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Clock, value: quiz.duration, label: 'دقيقة', color: 'var(--neon-blue)' },
                { icon: FileQuestion, value: quiz.questions.length, label: 'سؤال', color: 'var(--atom-gold)' },
                { icon: Award, value: totalPoints, label: 'مجموع النقاط', color: 'var(--neon-green)' },
                { icon: Target, value: `${quiz.passingScore}%`, label: 'نسبة النجاح', color: 'var(--neon-purple)' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="rounded-xl p-4 text-center"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-plasma)' }}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: item.color }} />
                    <div className="font-extrabold" style={{ color: 'var(--text-pure)' }}>{item.value}</div>
                    <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{item.label}</div>
                  </div>
                );
              })}
            </div>

            <div
              className="rounded-xl p-4 mb-6"
              style={{ background: 'rgba(0,210,255,0.08)', border: '1px solid rgba(0,210,255,0.2)' }}
            >
              <h3 className="font-bold mb-2 text-sm" style={{ color: 'var(--neon-blue)' }}>تعليمات الاختبار:</h3>
              <ul className="text-sm space-y-1 list-disc list-inside" style={{ color: 'rgba(0,210,255,0.7)' }}>
                <li>تأكد من استقرار الاتصال بالإنترنت قبل البدء.</li>
                <li>لا يمكن إيقاف الاختبار بعد البدء.</li>
                <li>يمكنك التنقل بين الأسئلة باستخدام الأزرار أسفل الصفحة.</li>
                <li>راجع إجاباتك جيداً قبل التسليم النهائي.</li>
              </ul>
            </div>

            <button
              onClick={() => setState('taking')}
              className="w-full py-3.5 font-bold rounded-xl transition flex items-center justify-center gap-2 text-lg"
              style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))', color: 'white' }}
            >
              <PlayCircle className="w-6 h-6" />
              ابدأ الاختبار
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'result') {
    return (
      <div className="max-w-3xl mx-auto animate-fadeIn">
        <div
          className="overflow-hidden"
          style={{
            background: 'var(--card-glass)',
            border: '1px solid var(--border-plasma)',
            borderRadius: '20px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div
            className="p-10 text-center"
            style={{
              background: result.passed
                ? 'linear-gradient(135deg, var(--neon-green), #00c9a7)'
                : 'linear-gradient(135deg, #ff416c, #ff4b2b)',
            }}
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.2)' }}>
              {result.passed ? (
                <Trophy className="w-10 h-10 text-white" />
              ) : (
                <XIcon className="w-10 h-10 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-extrabold mb-2 text-white">
              {result.passed ? 'مبروك! نجحت' : 'للأسف، لم تنجح'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)' }}>
              {result.passed ? 'لقد أجبت على أغلب الأسئلة بشكل صحيح' : 'يمكنك إعادة المحاولة مرة أخرى'}
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { value: `${result.percentage}%`, label: 'النسبة', color: 'var(--neon-blue)' },
                { value: `${result.score}/${result.total}`, label: 'النقاط', color: 'var(--neon-green)' },
                { value: `${result.correctCount}/${quiz.questions.length}`, label: 'إجابات صحيحة', color: 'var(--atom-gold)' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 text-center"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
                >
                  <div className="text-3xl font-extrabold" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <h3 className="font-bold mb-2" style={{ color: 'var(--text-pure)' }}>مراجعة الإجابات:</h3>
              {quiz.questions.map((q, i) => {
                const isCorrect = answers[q.id] === q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl"
                    style={{
                      border: `1px solid ${isCorrect ? 'var(--neon-green)' : '#ff416c'}`,
                      background: isCorrect ? 'rgba(0,245,212,0.08)' : 'rgba(255,65,108,0.08)',
                    }}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                        style={{ background: isCorrect ? 'var(--neon-green)' : '#ff416c' }}
                      >
                        {i + 1}
                      </span>
                      <p className="font-medium text-sm flex-1" style={{ color: 'var(--text-pure)' }}>{q.text}</p>
                    </div>
                    <div className="flex items-center gap-2 mr-8 text-xs">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--neon-green)' }} />
                      ) : (
                        <XCircle className="w-4 h-4" style={{ color: '#ff416c' }} />
                      )}
                      <span style={{ color: 'var(--text-dim)' }}>
                        إجابتك: <strong style={{ color: 'var(--text-pure)' }}>{answers[q.id] || 'لم تُجب'}</strong>
                      </span>
                      {!isCorrect && (
                        <span style={{ color: 'var(--neon-green)' }}>
                          - الإجابة الصحيحة: <strong>{q.correctAnswer}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 py-3 font-bold rounded-xl transition flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))', color: 'white' }}
              >
                <RotateCcw className="w-5 h-5" />
                إعادة الاختبار
              </button>
              <Link
                href="/student/quizzes"
                className="flex-1 py-3 font-bold rounded-xl transition flex items-center justify-center gap-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-plasma)', color: 'var(--text-pure)' }}
              >
                العودة للاختبارات
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentAnswer = answers[current.id] || '';
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      <div
        className="p-4 mb-4"
        style={{
          background: 'var(--card-glass)',
          border: '1px solid var(--border-plasma)',
          borderRadius: '20px',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-bold line-clamp-1" style={{ color: 'var(--text-pure)' }}>{quiz.title}</h1>
          <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--neon-blue)' }}>
            <Clock className="w-4 h-4" />
            <span>
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="quantum-bar flex-1" style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              className="quantum-fill h-full rounded-full transition-all"
              style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, var(--neon-blue), var(--neon-purple))' }}
            />
          </div>
          <span className="text-sm font-bold" style={{ color: 'var(--text-dim)' }}>
            {currentIdx + 1}/{quiz.questions.length}
          </span>
        </div>
      </div>

      <div
        className="p-6 md:p-8 mb-4"
        style={{
          background: 'var(--card-glass)',
          border: '1px solid var(--border-plasma)',
          borderRadius: '20px',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="mb-6">
          <span
            className="inline-block text-xs font-bold px-2 py-1 rounded-full mb-3"
            style={{ background: 'rgba(0,210,255,0.15)', color: 'var(--neon-blue)' }}
          >
            السؤال {currentIdx + 1}
          </span>
          <h2 className="text-lg md:text-xl font-bold leading-relaxed" style={{ color: 'var(--text-pure)' }}>
            {current.text}
          </h2>
          <div className="mt-2 text-xs" style={{ color: 'var(--text-dim)' }}>
            {current.type === 'multiple' ? 'اختيار من متعدد' : 'صواب أو خطأ'} • {current.points} نقطة
          </div>
        </div>

        <div className="space-y-2">
          {current.options.map((opt, i) => {
            const selected = currentAnswer === opt;
            return (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="w-full text-right p-4 rounded-xl transition flex items-center gap-3"
                style={{
                  border: `2px solid ${selected ? 'var(--neon-blue)' : 'var(--border-plasma)'}`,
                  background: selected ? 'rgba(0,210,255,0.1)' : 'rgba(255,255,255,0.03)',
                  boxShadow: selected ? '0 0 20px rgba(0,210,255,0.2)' : 'none',
                  color: 'var(--text-pure)',
                }}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{
                    borderColor: selected ? 'var(--neon-blue)' : 'var(--text-dim)',
                    background: selected ? 'var(--neon-blue)' : 'transparent',
                  }}
                >
                  {selected && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <span className="font-medium">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx((i) => i - 1)}
          className="px-5 py-2.5 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--border-plasma)',
            color: 'var(--text-pure)',
          }}
        >
          <ChevronRight className="w-4 h-4" />
          السابق
        </button>

        {currentIdx === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={answeredCount < quiz.questions.length}
            className="px-6 py-2.5 font-bold rounded-xl transition flex items-center gap-2 disabled:opacity-40"
            style={{ background: 'var(--neon-green)', color: 'white' }}
          >
            <CheckCheck className="w-5 h-5" />
            تسليم الاختبار ({answeredCount}/{quiz.questions.length})
          </button>
        ) : (
          <button
            disabled={!currentAnswer}
            onClick={() => setCurrentIdx((i) => i + 1)}
            className="px-5 py-2.5 font-bold rounded-xl transition flex items-center gap-2 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))', color: 'white' }}
          >
            التالي
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
