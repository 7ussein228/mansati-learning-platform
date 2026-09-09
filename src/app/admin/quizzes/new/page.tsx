'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Course, Question, QuestionType } from '@/lib/types';
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
import { useEffect } from 'react';

export default function NewQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [duration, setDuration] = useState(20);
  const [passingScore, setPassingScore] = useState(60);
  const [questions, setQuestions] = useState<Omit<Question, 'id'>[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load courses from API or just use the ones in seed (in real app this would fetch)
    fetch('/api/courses')
      .then((r) => r.json())
      .then((data) => {
        setCourses(data.courses || []);
        if (data.courses?.[0]) setCourseId(data.courses[0].id);
      })
      .catch(() => {});
  }, []);

  const addQuestion = (type: QuestionType = 'multiple') => {
    setQuestions((prev) => [
      ...prev,
      {
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

  const updateQuestion = (idx: number, key: keyof Omit<Question, 'id'>, val: any) => {
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
      const res = await fetch('/api/quizzes', {
        method: 'POST',
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

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3">
        <Link href="/admin/quizzes" className="p-2 hover:bg-slate-200 rounded-lg transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">إضافة اختبار جديد</h1>
          <p className="text-slate-500 text-sm mt-1">أدخل بيانات الاختبار والأسئلة</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-blue-600" />
              بيانات الاختبار
            </h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">عنوان الاختبار</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">وصف الاختبار</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                required
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <BookOpen className="w-4 h-4 inline ml-1" />
                  الكورس
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  required
                >
                  <option value="">اختر كورس</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <Clock className="w-4 h-4 inline ml-1" />
                  المدة (دقيقة)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <Target className="w-4 h-4 inline ml-1" />
                  نسبة النجاح %
                </label>
                <input
                  type="number"
                  value={passingScore}
                  onChange={(e) => setPassingScore(Number(e.target.value))}
                  min={0}
                  max={100}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                الأسئلة ({questions.length})
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addQuestion('multiple')}
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  اختيار من متعدد
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion('truefalse')}
                  className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  صواب/خطأ
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-slate-700 text-sm">
                      السؤال {qIdx + 1} ({q.type === 'multiple' ? 'اختيار من متعدد' : 'صواب/خطأ'})
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIdx)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      required
                    />

                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-2 block">
                        الخيارات (اختر الإجابة الصحيحة بالضغط على الدائرة):
                      </label>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQuestion(qIdx, 'correctAnswer', opt)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                q.correctAnswer === opt
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-slate-300 hover:border-blue-400'
                              }`}
                            >
                              {q.correctAnswer === opt && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </button>
                            {q.type === 'truefalse' ? (
                              <input
                                type="text"
                                value={opt}
                                disabled
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium"
                              />
                            ) : (
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                placeholder={`الخيار ${oIdx + 1}`}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                required
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">نقاط السؤال:</label>
                      <input
                        type="number"
                        value={q.points}
                        onChange={(e) => updateQuestion(qIdx, 'points', Number(e.target.value))}
                        min={1}
                        className="w-24 px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {questions.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                  لم تتم إضافة أسئلة بعد.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm sticky top-4">
            <h3 className="font-bold text-slate-900 mb-4">حفظ الاختبار</h3>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 mb-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'جاري الحفظ...' : 'حفظ الاختبار'}
            </button>
            <Link
              href="/admin/quizzes"
              className="w-full block text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
            >
              إلغاء
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
