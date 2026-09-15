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
  platformName: 'Tesla',
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
      className="relative w-11 h-6 rounded-full transition-all duration-300"
      style={{
        background: checked
          ? 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))'
          : 'rgba(255,255,255,0.1)',
        border: '1px solid var(--border-plasma)',
      }}
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
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--text-pure)' }}>الإعدادات</h1>
        <p className="mt-1" style={{ color: 'var(--text-dim)' }}>إعدادات المنصة والاشتراكات والإشعارات</p>
      </div>

      {saved && (
        <div
          className="p-3 rounded-lg text-sm"
          style={{
            background: 'rgba(0,245,212,0.1)',
            border: '1px solid rgba(0,245,212,0.3)',
            color: 'var(--neon-green)',
          }}
        >
          تم الحفظ بنجاح ✓
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className="p-6 space-y-4"
          style={{
            background: 'var(--card-glass)',
            border: '1px solid var(--border-plasma)',
            borderRadius: '20px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-pure)' }}>
            <Building2 className="w-5 h-5" style={{ color: 'var(--neon-blue)' }} />
            معلومات المنصة
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>اسم المنصة</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => update('platformName', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>الوصف</label>
              <textarea
                value={settings.description}
                onChange={(e) => update('description', e.target.value)}
                rows={2}
                style={{ ...inputStyle, resize: 'none' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
                <Mail className="w-4 h-4" />
                الإيميل
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => update('email', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
                <Phone className="w-4 h-4" />
                الموبايل
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => update('phone', e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div
          className="p-6 space-y-4"
          style={{
            background: 'var(--card-glass)',
            border: '1px solid var(--border-plasma)',
            borderRadius: '20px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-pure)' }}>
            <LinkIcon className="w-5 h-5" style={{ color: 'var(--neon-purple)' }} />
            روابط التواصل الاجتماعي
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
                <Globe className="w-4 h-4" style={{ color: 'var(--neon-blue)' }} />
                فيسبوك
              </label>
              <input
                type="url"
                value={settings.facebook}
                onChange={(e) => update('facebook', e.target.value)}
                style={{ ...inputStyle, fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
                <Play className="w-4 h-4" style={{ color: '#ff5050' }} />
                يوتيوب
              </label>
              <input
                type="url"
                value={settings.youtube}
                onChange={(e) => update('youtube', e.target.value)}
                style={{ ...inputStyle, fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
                <Send className="w-4 h-4" style={{ color: 'var(--neon-blue)' }} />
                تيليجرام
              </label>
              <input
                type="url"
                value={settings.telegram}
                onChange={(e) => update('telegram', e.target.value)}
                style={{ ...inputStyle, fontSize: '0.875rem' }}
              />
            </div>
          </div>
        </div>

        <div
          className="p-6 space-y-4"
          style={{
            background: 'var(--card-glass)',
            border: '1px solid var(--border-plasma)',
            borderRadius: '20px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-pure)' }}>
            <DollarSign className="w-5 h-5" style={{ color: 'var(--neon-green)' }} />
            تسعير الاشتراكات
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>سعر الاشتراك الشهري (ج.م)</label>
              <input
                type="number"
                value={settings.monthlyPrice}
                onChange={(e) => update('monthlyPrice', Number(e.target.value))}
                min={0}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-dim)' }}>سعر الاشتراك السنوي (ج.م)</label>
              <input
                type="number"
                value={settings.yearlyPrice}
                onChange={(e) => update('yearlyPrice', Number(e.target.value))}
                min={0}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div
          className="p-6 space-y-4"
          style={{
            background: 'var(--card-glass)',
            border: '1px solid var(--border-plasma)',
            borderRadius: '20px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <h2 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-pure)' }}>
            <Bell className="w-5 h-5" style={{ color: 'var(--atom-gold)' }} />
            الإشعارات
          </h2>
          <div className="space-y-4">
            {[
              { key: 'emailNotifications' as const, label: 'إشعارات البريد الإلكتروني', desc: 'إرسال إشعارات عبر البريد عند نشر كورسات جديدة' },
              { key: 'pushNotifications' as const, label: 'الإشعارات الفورية', desc: 'إرسال إشعارات فورية للمتصفح' },
              { key: 'newCourseAlerts' as const, label: 'تنبيهات الكورسات الجديدة', desc: 'إشعار الطلاب عند إضافة كورس جديد' },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-plasma)',
                }}
              >
                <div>
                  <div className="font-bold text-sm" style={{ color: 'var(--text-pure)' }}>{item.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>{item.desc}</div>
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
          className="px-6 py-3 text-white font-bold rounded-xl transition-all duration-300 flex items-center gap-2 hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' }}
        >
          <Save className="w-5 h-5" />
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </form>
    </div>
  );
}
