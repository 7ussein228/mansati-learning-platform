'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Course, Question, QuestionType, Quiz } from '@/lib/types';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  FileQuestion,
  Clock,
  Target,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

export default function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [duration, setDuration] = useState(20);
  const [passingScore, setPassingScore] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`/api/quizzes/${id}`).then((r) => r.json()),
      fetch('/api/courses').then((r) => r.json()),
    ])
      .then(([quizData, coursesData]) => {
        if (quizData.quiz) {
          const q = quizData.quiz;
          setQuiz(q);
          setTitle(q.title);
          setDescription(q.description);
          setCourseId(q.courseId);
          setDuration(q.duration);
          setPassingScore(q.passingScore);
          setQuestions(q.questions.map((question: any) => ({
            id: question.id || '',
            text: question.text,
            type: question.type || 'multiple',
            options: question.options,
            correctAnswer: question.correctAnswer,
            points: question.points,
          })));
        }
        setCourses(coursesData.courses || []);
      })
      .catch(() => setError('حدث خطأ في تحميل البيانات'))
      .finally(() => setLoading(false));
  }, [id]);

  const addQuestion = (type: QuestionType = 'multiple') => {
    setQuestions((prev) => [
      ...prev,
      {
        id: '',
        text: '',
        type,
        options: type === 'truefalse' ? ['صواب', 'خطأ'] : ['', '', '', ''],
        correctAnswer: type === 'truefalse' ? 'صواب' : '',
        points: 10,
      },
    ]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, key: keyof Question, val: any) => {
    setQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, [key]: val } : q)));
  };

  const updateOption = (qIdx: number, oIdx: number, val: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const newOpts = [...q.options];
        newOpts[oIdx] = val;
        return { ...q, options: newOpts };
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title || !description || !courseId) {
      setError('املأ الحقول الأساسية');
      return;
    }
    if (questions.length === 0) {
      setError('أضف سؤالاً واحداً على الأقل');
      return;
    }
    for (const q of questions) {
      if (!q.text || !q.correctAnswer) {
        setError('تأكد من إكمال جميع الأسئلة وتحديد الإجابة الصحيحة');
        return;
      }
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/quizzes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, courseId, duration, passingScore, questions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'حدث خطأ أثناء الحفظ');
      router.push('/admin/quizzes');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 rounded-full" style={{ borderColor: 'var(--neon-blue)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-20" style={{ color: 'var(--text-dim)' }}>
        <p>الاختبار غير موجود.</p>
        <Link href="/admin/quizzes" className="mt-2 inline-block" style={{ color: 'var(--neon-blue)' }}>العودة</Link>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border-plasma)',
    borderRadius: '12px',
    color: 'var(--text-pure)',
    outline: 'none',
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/quizzes"
          className="p-2 rounded-lg transition-all duration-300"
          style={{ border: '1px solid var(--border-plasma)', color: 'var(--text-dim)' }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--text-pure)' }}>تعديل الاختبار</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>تعديل بيانات الاختبار والأسئلة</p>
        </div>
      </div>

      {error && (
        <div
          className="p-3 rounded-lg text-sm"
          style={{
            background: 'rgba(255,80,80,0.1)',
            border: '1px solid rgba(255,80,80,0.3)',
            color: '#ff5050',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div
            className="p-6 space-y-4"
            style={{
              background: 'var(--card-glass)',
              border: '1px solid var(--border-plasma)',
              borderRadius: '20px',
              backdropFilter: 'blur(16px)',
            }}
          >
            <h2 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-pure)' }}>
              <FileQuestion className="w-5 h-5" style={{ color: 'var(--neon-blue)' }} />
              بيانات الاختبار
            </h2>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>عنوان الاختبار</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>وصف الاختبار</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: 'none' }}
                required
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>
                  <BookOpen className="w-4 h-4 inline ml-1" />
                  الكورس
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  style={{ ...inputStyle, background: 'rgba(255,255,255,0.04)' }}
                  required
                >
                  <option value="" style={{ background: '#0d1424' }}>اختر كورس</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id} style={{ background: '#0d1424', color: 'var(--text-pure)' }}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>
                  <Clock className="w-4 h-4 inline ml-1" />
                  المدة (دقيقة)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={1}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>
                  <Target className="w-4 h-4 inline ml-1" />
                  نسبة النجاح %
                </label>
                <input
                  type="number"
                  value={passingScore}
                  onChange={(e) => setPassingScore(Number(e.target.value))}
                  min={0}
                  max={100}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>

          <div
            className="p-6"
            style={{
              background: 'var(--card-glass)',
              border: '1px solid var(--border-plasma)',
              borderRadius: '20px',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-pure)' }}>
                الأسئلة ({questions.length})
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addQuestion('multiple')}
                  className="text-sm text-white px-3 py-1.5 rounded-lg font-bold transition-all duration-300 flex items-center gap-1 hover:shadow-[0_0_20px_rgba(0,210,255,0.3)]"
                  style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' }}
                >
                  <Plus className="w-4 h-4" />
                  اختيار من متعدد
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion('truefalse')}
                  className="text-sm text-white px-3 py-1.5 rounded-lg font-bold transition-all duration-300 flex items-center gap-1 hover:shadow-[0_0_20px_rgba(255,190,11,0.3)]"
                  style={{ background: 'var(--atom-gold)', color: '#000' }}
                >
                  <Plus className="w-4 h-4" />
                  صواب/خطأ
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  className="rounded-xl p-4"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-plasma)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm" style={{ color: 'var(--text-dim)' }}>
                      السؤال {qIdx + 1} ({q.type === 'multiple' ? 'اختيار من متعدد' : 'صواب/خطأ'})
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIdx)}
                      className="p-1.5 rounded-lg transition-all duration-300"
                      style={{ color: '#ff5050' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,80,80,0.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)}
                      placeholder="نص السؤال..."
                      style={{ ...inputStyle, fontSize: '0.875rem' }}
                      required
                    />

                    <div>
                      <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--text-dim)' }}>
                        الخيارات (اختر الإجابة الصحيحة بالضغط على الدائرة):
                      </label>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQuestion(qIdx, 'correctAnswer', opt)}
                              className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300"
                              style={{
                                borderColor: q.correctAnswer === opt ? 'var(--neon-green)' : 'var(--border-plasma)',
                                background: q.correctAnswer === opt ? 'var(--neon-green)' : 'transparent',
                              }}
                            >
                              {q.correctAnswer === opt && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </button>
                            {q.type === 'truefalse' ? (
                              <input
                                type="text"
                                value={opt}
                                disabled
                                className="flex-1 px-3 py-2 rounded-lg text-sm font-medium"
                                style={{
                                  background: 'rgba(255,255,255,0.06)',
                                  border: '1px solid var(--border-plasma)',
                                  color: 'var(--text-dim)',
                                }}
                              />
                            ) : (
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                placeholder={`الخيار ${oIdx + 1}`}
                                style={{ ...inputStyle, flex: 1, fontSize: '0.875rem' }}
                                required
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--text-dim)' }}>نقاط السؤال:</label>
                      <input
                        type="number"
                        value={q.points}
                        onChange={(e) => updateQuestion(qIdx, 'points', Number(e.target.value))}
                        min={1}
                        style={{ ...inputStyle, width: '6rem', fontSize: '0.875rem' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div
            className="p-5 sticky top-4"
            style={{
              background: 'var(--card-glass)',
              border: '1px solid var(--border-plasma)',
              borderRadius: '20px',
              backdropFilter: 'blur(16px)',
            }}
          >
            <h3 className="font-bold mb-4" style={{ color: 'var(--text-pure)' }}>حفظ التعديلات</h3>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mb-2 hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' }}
            >
              <Save className="w-4 h-4" />
              {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
            <Link
              href="/admin/quizzes"
              className="w-full block text-center py-2.5 font-bold rounded-xl transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-plasma)',
                color: 'var(--text-dim)',
              }}
            >
              إلغاء
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
