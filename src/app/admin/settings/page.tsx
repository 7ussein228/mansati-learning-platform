'use client';

import { useState, useEffect } from 'react';
import type { Settings } from '@/lib/types';
import {
  Save,
  Building2,
  Link as LinkIcon,
  DollarSign,
  Bell,
  Mail,
  Phone,
  Globe,
  Play,
  Send,
} from 'lucide-react';

const defaultSettings: Settings = {
  platformName: 'منصتي',
  description: 'منصة تعليمية متكاملة للطالب المصري',
  email: 'info@mansati.com',
  phone: '01012345678',
  facebook: 'https://facebook.com/mansati',
  youtube: 'https://youtube.com/@mansati',
  telegram: 'https://t.me/mansati',
  monthlyPrice: 49,
  yearlyPrice: 449,
  emailNotifications: true,
  pushNotifications: true,
  newCourseAlerts: true,
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition ${checked ? 'bg-blue-600' : 'bg-slate-300'}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
          checked ? 'right-0.5' : 'right-[calc(100%-22px)]'
        }`}
      />
    </button>
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">الإعدادات</h1>
        <p className="text-slate-500 mt-1">إعدادات المنصة والاشتراكات والإشعارات</p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm">
          تم الحفظ بنجاح ✓
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Platform info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            معلومات المنصة
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">اسم المنصة</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => update('platformName', e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">الوصف</label>
              <textarea
                value={settings.description}
                onChange={(e) => update('description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Mail className="w-4 h-4" />
                الإيميل
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Phone className="w-4 h-4" />
                الموبايل
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-blue-600" />
            روابط التواصل الاجتماعي
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Globe className="w-4 h-4 text-blue-600" />
                فيسبوك
              </label>
              <input
                type="url"
                value={settings.facebook}
                onChange={(e) => update('facebook', e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Play className="w-4 h-4 text-red-600" />
                يوتيوب
              </label>
              <input
                type="url"
                value={settings.youtube}
                onChange={(e) => update('youtube', e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Send className="w-4 h-4 text-sky-500" />
                تيليجرام
              </label>
              <input
                type="url"
                value={settings.telegram}
                onChange={(e) => update('telegram', e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            تسعير الاشتراكات
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">سعر الاشتراك الشهري (ج.م)</label>
              <input
                type="number"
                value={settings.monthlyPrice}
                onChange={(e) => update('monthlyPrice', Number(e.target.value))}
                min={0}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">سعر الاشتراك السنوي (ج.م)</label>
              <input
                type="number"
                value={settings.yearlyPrice}
                onChange={(e) => update('yearlyPrice', Number(e.target.value))}
                min={0}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-600" />
            الإشعارات
          </h2>
          <div className="space-y-4">
            {[
              { key: 'emailNotifications' as const, label: 'إشعارات البريد الإلكتروني', desc: 'إرسال إشعارات عبر البريد عند نشر كورسات جديدة' },
              { key: 'pushNotifications' as const, label: 'الإشعارات الفورية', desc: 'إرسال إشعارات فورية للمتصفح' },
              { key: 'newCourseAlerts' as const, label: 'تنبيهات الكورسات الجديدة', desc: 'إشعار الطلاب عند إضافة كورس جديد' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{item.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                </div>
                <Toggle
                  checked={settings[item.key] as boolean}
                  onChange={(v) => update(item.key, v)}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </form>
    </div>
  );
}
