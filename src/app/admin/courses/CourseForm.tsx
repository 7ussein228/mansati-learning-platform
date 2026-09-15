'use client';

import { useState, useRef } from 'react';
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
  Image as ImageIcon,
  X,
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [category, setCategory] = useState<Category>(course?.category || 'فيزياء');
  const [price, setPrice] = useState<number>(course?.price || 0);
  const [isFree, setIsFree] = useState(course?.isFree || false);
  const [image, setImage] = useState(course?.image || defaultImages['فيزياء']);
  const [uploading, setUploading] = useState(false);
  const [lessons, setLessons] = useState<LessonForm[]>(
    course?.lessons.map((l) => ({ ...l })) || []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('يجب أن تكون الصورة من نوع JPEG, PNG, WebP أو GIF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'حدث خطأ أثناء الرفع');

      setImage(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

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
          href="/admin/courses"
          className="p-2 rounded-lg transition-all duration-300"
          style={{ border: '1px solid var(--border-plasma)', color: 'var(--text-dim)' }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--text-pure)' }}>
            {mode === 'new' ? 'إضافة كورس جديد' : 'تعديل الكورس'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>
            {mode === 'new' ? 'أدخل بيانات الكورس والدروس' : 'حدّث بيانات الكورس'}
          </p>
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
              <BookOpen className="w-5 h-5" style={{ color: 'var(--neon-blue)' }} />
              بيانات الكورس
            </h2>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>عنوان الكورس</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
                placeholder="مثال: أساسيات الفيزياء"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>وصف الكورس</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                style={{ ...inputStyle, resize: 'none' }}
                placeholder="اكتب وصفاً شاملاً للكورس..."
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>
                  <Tag className="w-4 h-4 inline ml-1" />
                  التصنيف
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as Category)}
                  style={{ ...inputStyle, background: 'rgba(255,255,255,0.04)' }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} style={{ background: '#0d1424', color: 'var(--text-pure)' }}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>
                  <DollarSign className="w-4 h-4 inline ml-1" />
                  السعر (ج.م)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  disabled={isFree}
                  min={0}
                  style={{ ...inputStyle, opacity: isFree ? 0.5 : 1 }}
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
                className="w-4 h-4 rounded"
                style={{ accentColor: 'var(--neon-green)' }}
              />
              <span className="text-sm font-medium" style={{ color: 'var(--text-dim)' }}>هذا الكورس مجاني</span>
            </label>
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
            <h2 className="font-bold flex items-center gap-2 mb-4" style={{ color: 'var(--text-pure)' }}>
              <ImageIcon className="w-5 h-5" style={{ color: 'var(--neon-blue)' }} />
              صورة الغلاف
            </h2>

            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300"
                style={{
                  borderColor: uploading ? 'var(--neon-blue)' : 'var(--border-plasma)',
                  background: uploading ? 'rgba(0,210,255,0.05)' : 'transparent',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--neon-blue)'; e.currentTarget.style.background = 'rgba(0,210,255,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = uploading ? 'var(--neon-blue)' : 'var(--border-plasma)'; e.currentTarget.style.background = uploading ? 'rgba(0,210,255,0.05)' : 'transparent'; }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin w-8 h-8 border-4 rounded-full" style={{ borderColor: 'var(--neon-blue)', borderTopColor: 'transparent' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--neon-blue)' }}>جاري رفع الصورة...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8" style={{ color: 'var(--text-dim)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-dim)' }}>
                      اضغط لاختيار صورة من جهازك
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-dim)', opacity: 0.6 }}>
                      JPEG, PNG, WebP, GIF - حد أقصى 5 ميجابايت
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>
                  أو أدخل رابط الصورة
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  style={{ ...inputStyle, fontSize: '0.875rem' }}
                  placeholder="https://..."
                />
              </div>

              {image && (
                <div className="relative">
                  <div
                    className="h-40 rounded-xl bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${image})`,
                      border: '1px solid var(--border-plasma)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="absolute top-2 left-2 p-1.5 rounded-lg transition-all duration-300"
                    style={{ background: '#ff5050', color: '#fff' }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-pure)' }}>
                <FileText className="w-5 h-5" style={{ color: 'var(--neon-blue)' }} />
                الدروس ({lessons.length})
              </h2>
              <button
                type="button"
                onClick={addLesson}
                className="text-sm text-white px-3 py-1.5 rounded-lg font-bold transition-all duration-300 flex items-center gap-1 hover:shadow-[0_0_20px_rgba(0,210,255,0.3)]"
                style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' }}
              >
                <Plus className="w-4 h-4" />
                إضافة درس
              </button>
            </div>

            <div className="space-y-3">
              {lessons.map((l, idx) => (
                <div
                  key={l.id}
                  className="rounded-xl p-4"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-plasma)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold" style={{ color: 'var(--text-dim)' }}>الدرس {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeLesson(l.id)}
                      className="p-1.5 rounded-lg transition-all duration-300"
                      style={{ color: '#ff5050' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,80,80,0.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
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
                        style={{ ...inputStyle, fontSize: '0.875rem' }}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={l.description}
                        onChange={(e) => updateLesson(l.id, 'description', e.target.value)}
                        placeholder="وصف الدرس"
                        style={{ ...inputStyle, fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <div className="relative">
                        <Clock className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-dim)' }} />
                        <input
                          type="number"
                          value={l.duration}
                          onChange={(e) => updateLesson(l.id, 'duration', Number(e.target.value))}
                          placeholder="المدة بالدقائق"
                          style={{ ...inputStyle, fontSize: '0.875rem', paddingRight: '2rem' }}
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
                          className="w-4 h-4 rounded"
                          style={{ accentColor: 'var(--neon-green)' }}
                        />
                        <span className="text-sm font-medium" style={{ color: 'var(--text-dim)' }}>درس مجاني (معاينة)</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              {lessons.length === 0 && (
                <div
                  className="text-center py-8 text-sm border-2 border-dashed rounded-xl"
                  style={{ color: 'var(--text-dim)', borderColor: 'var(--border-plasma)' }}
                >
                  لم تتم إضافة دروس بعد. اضغط &quot;إضافة درس&quot; للبدء.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="p-5 sticky top-4"
            style={{
              background: 'var(--card-glass)',
              border: '1px solid var(--border-plasma)',
              borderRadius: '20px',
              backdropFilter: 'blur(16px)',
            }}
          >
            <h3 className="font-bold mb-4" style={{ color: 'var(--text-pure)' }}>حفظ الكورس</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-dim)' }}>
              راجع البيانات جيداً قبل الحفظ. يمكنك تعديل الكورس لاحقاً.
            </p>
            <div className="space-y-2">
              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full py-2.5 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' }}
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
        </div>
      </form>
    </div>
  );
}
