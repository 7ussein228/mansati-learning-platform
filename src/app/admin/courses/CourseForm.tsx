'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Course, Lesson, Category } from '@/lib/types';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Upload,
  BookOpen,
  Clock,
  DollarSign,
  FileText,
  Tag,
} from 'lucide-react';

interface Props {
  mode: 'new' | 'edit';
  course?: Course;
}

const CATEGORIES: Category[] = ['فيزياء', 'رياضيات', 'كيمياء', 'أحياء', 'إنجليزي'];

const defaultImages: Record<Category, string> = {
  'فيزياء': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
  'رياضيات': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
  'كيمياء': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
  'أحياء': 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80',
  'إنجليزي': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80',
};

interface LessonForm {
  id: string;
  title: string;
  description: string;
  duration: number;
  isFree: boolean;
}

export default function CourseForm({ mode, course }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [category, setCategory] = useState<Category>(course?.category || 'فيزياء');
  const [price, setPrice] = useState<number>(course?.price || 0);
  const [isFree, setIsFree] = useState(course?.isFree || false);
  const [image, setImage] = useState(course?.image || defaultImages['فيزياء']);
  const [lessons, setLessons] = useState<LessonForm[]>(
    course?.lessons.map((l) => ({ ...l })) || []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addLesson = () => {
    setLessons((prev) => [
      ...prev,
      {
        id: 'l' + Date.now(),
        title: '',
        description: '',
        duration: 30,
        isFree: false,
      },
    ]);
  };

  const removeLesson = (id: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLesson = (id: string, key: keyof LessonForm, val: any) => {
    setLessons((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: val } : l)));
  };

  const handleCategoryChange = (v: Category) => {
    setCategory(v);
    if (!course) setImage(defaultImages[v]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title || !description) {
      setError('العنوان والوصف مطلوبان');
      return;
    }
    setSaving(true);
    try {
      const lessonsData = lessons.map((l) => ({
        ...l,
        duration: l.duration || 30,
        isFree: !!l.isFree,
      }));

      const payload = { title, description, category, price, isFree, image, lessons: lessonsData };

      if (mode === 'new') {
        const res = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'حدث خطأ أثناء الحفظ');
      } else {
        const res = await fetch(`/api/courses/${course?.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'حدث خطأ أثناء الحفظ');
      }
      router.push('/admin/courses');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/courses"
          className="p-2 hover:bg-slate-200 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            {mode === 'new' ? 'إضافة كورس جديد' : 'تعديل الكورس'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {mode === 'new' ? 'أدخل بيانات الكورس والدروس' : 'حدّث بيانات الكورس'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              بيانات الكورس
            </h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">عنوان الكورس</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="مثال: أساسيات الفيزياء"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">وصف الكورس</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="اكتب وصفاً شاملاً للكورس..."
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <Tag className="w-4 h-4 inline ml-1" />
                  التصنيف
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as Category)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  <DollarSign className="w-4 h-4 inline ml-1" />
                  السعر (ج.م)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  disabled={isFree}
                  min={0}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFree}
                onChange={(e) => {
                  setIsFree(e.target.checked);
                  if (e.target.checked) setPrice(0);
                }}
                className="w-4 h-4 text-green-600 rounded border-slate-300 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-slate-700">هذا الكورس مجاني</span>
            </label>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                <Upload className="w-4 h-4 inline ml-1" />
                رابط صورة الغلاف
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                placeholder="https://..."
              />
              {image && (
                <div
                  className="mt-3 h-32 rounded-lg bg-cover bg-center border border-slate-200"
                  style={{ backgroundImage: `url(${image})` }}
                />
              )}
            </div>
          </div>

          {/* Lessons */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                الدروس ({lessons.length})
              </h2>
              <button
                type="button"
                onClick={addLesson}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                إضافة درس
              </button>
            </div>

            <div className="space-y-3">
              {lessons.map((l, idx) => (
                <div key={l.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-slate-700">الدرس {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeLesson(l.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={l.title}
                        onChange={(e) => updateLesson(l.id, 'title', e.target.value)}
                        placeholder="عنوان الدرس"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={l.description}
                        onChange={(e) => updateLesson(l.id, 'description', e.target.value)}
                        placeholder="وصف الدرس"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <div className="relative">
                        <Clock className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="number"
                          value={l.duration}
                          onChange={(e) => updateLesson(l.id, 'duration', Number(e.target.value))}
                          placeholder="المدة بالدقائق"
                          className="w-full pr-8 pl-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                          min={1}
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={l.isFree}
                          onChange={(e) => updateLesson(l.id, 'isFree', e.target.checked)}
                          className="w-4 h-4 text-green-600 rounded border-slate-300"
                        />
                        <span className="text-sm font-medium text-slate-700">درس مجاني (معاينة)</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              {lessons.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                  لم تتم إضافة دروس بعد. اضغط &quot;إضافة درس&quot; للبدء.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm sticky top-4">
            <h3 className="font-bold text-slate-900 mb-4">حفظ الكورس</h3>
            <p className="text-sm text-slate-600 mb-4">
              راجع البيانات جيداً قبل الحفظ. يمكنك تعديل الكورس لاحقاً.
            </p>
            <div className="space-y-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>جاري الحفظ...</>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {mode === 'new' ? 'حفظ الكورس' : 'حفظ التعديلات'}
                  </>
                )}
              </button>
              <Link
                href="/admin/courses"
                className="w-full block text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
              >
                إلغاء
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
