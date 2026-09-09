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
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 text-sm mb-6"
        >
          <ChevronRight className="w-4 h-4" />
          العودة للاختبارات
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-l from-blue-600 to-indigo-700 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileQuestion className="w-8 h-8" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2">{quiz.title}</h1>
            <p className="text-blue-100">{quiz.description}</p>
            {courseName && (
              <span className="inline-block mt-3 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs">
                {courseName}
              </span>
            )}
          </div>

          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="font-extrabold text-slate-900">{quiz.duration}</div>
                <div className="text-xs text-slate-500">دقيقة</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <FileQuestion className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <div className="font-extrabold text-slate-900">{quiz.questions.length}</div>
                <div className="text-xs text-slate-500">سؤال</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <Award className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="font-extrabold text-slate-900">{totalPoints}</div>
                <div className="text-xs text-slate-500">مجموع النقاط</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="font-extrabold text-slate-900">{quiz.passingScore}%</div>
                <div className="text-xs text-slate-500">نسبة النجاح</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-blue-900 mb-2 text-sm">تعليمات الاختبار:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>تأكد من استقرار الاتصال بالإنترنت قبل البدء.</li>
                <li>لا يمكن إيقاف الاختبار بعد البدء.</li>
                <li>يمكنك التنقل بين الأسئلة باستخدام الأزرار أسفل الصفحة.</li>
                <li>راجع إجاباتك جيداً قبل التسليم النهائي.</li>
              </ul>
            </div>

            <button
              onClick={() => setState('taking')}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-lg"
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div
            className={`p-10 text-center ${
              result.passed
                ? 'bg-gradient-to-l from-green-500 to-emerald-600'
                : 'bg-gradient-to-l from-red-500 to-rose-600'
            } text-white`}
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {result.passed ? (
                <Trophy className="w-10 h-10" />
              ) : (
                <XIcon className="w-10 h-10" />
              )}
            </div>
            <h1 className="text-3xl font-extrabold mb-2">
              {result.passed ? 'مبروك! نجحت 🎉' : 'للأسف، لم تنجح'}
            </h1>
            <p className="text-white/90">
              {result.passed ? 'لقد أجبت على أغلب الأسئلة بشكل صحيح' : 'يمكنك إعادة المحاولة مرة أخرى'}
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-extrabold text-blue-600">{result.percentage}%</div>
                <div className="text-xs text-slate-600 mt-1">النسبة</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-extrabold text-green-600">
                  {result.score}/{result.total}
                </div>
                <div className="text-xs text-slate-600 mt-1">النقاط</div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-extrabold text-yellow-600">
                  {result.correctCount}/{quiz.questions.length}
                </div>
                <div className="text-xs text-slate-600 mt-1">إجابات صحيحة</div>
              </div>
            </div>

            {/* Review */}
            <div className="space-y-3 mb-6">
              <h3 className="font-bold text-slate-900 mb-2">مراجعة الإجابات:</h3>
              {quiz.questions.map((q, i) => {
                const isCorrect = answers[q.id] === q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border ${
                      isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <p className="font-medium text-slate-900 text-sm flex-1">{q.text}</p>
                    </div>
                    <div className="flex items-center gap-2 mr-8 text-xs">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-slate-700">
                        إجابتك: <strong>{answers[q.id] || 'لم تُجب'}</strong>
                      </span>
                      {!isCorrect && (
                        <span className="text-green-700">
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
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                إعادة الاختبار
              </button>
              <Link
                href="/student/quizzes"
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                العودة للاختبارات
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Taking state
  const currentAnswer = answers[current.id] || '';
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      {/* Top bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-bold text-slate-900 line-clamp-1">{quiz.title}</h1>
          <div className="flex items-center gap-2 text-sm font-bold text-blue-600">
            <Clock className="w-4 h-4" />
            <span>
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-bold text-slate-600">
            {currentIdx + 1}/{quiz.questions.length}
          </span>
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-4">
        <div className="mb-6">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full mb-3">
            السؤال {currentIdx + 1}
          </span>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed">
            {current.text}
          </h2>
          <div className="mt-2 text-xs text-slate-500">
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
                className={`w-full text-right p-4 rounded-xl border-2 transition flex items-center gap-3 ${
                  selected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}
                >
                  {selected && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <span className="font-medium text-slate-900">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between gap-3">
        <button
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx((i) => i - 1)}
          className="px-5 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition flex items-center gap-2"
        >
          <ChevronRight className="w-4 h-4" />
          السابق
        </button>

        {currentIdx === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={answeredCount < quiz.questions.length}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition flex items-center gap-2"
          >
            <CheckCheck className="w-5 h-5" />
            تسليم الاختبار ({answeredCount}/{quiz.questions.length})
          </button>
        ) : (
          <button
            disabled={!currentAnswer}
            onClick={() => setCurrentIdx((i) => i + 1)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition flex items-center gap-2"
          >
            التالي
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
