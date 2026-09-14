"use client";
import { useState } from "react";

interface NameInputModalProps {
  onSave: (name: string) => void;
  onClose: () => void;
}

export default function NameInputModal({ onSave, onClose }: NameInputModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-br from-[#00235b] to-blue-800 p-6 text-center text-white">
          <div className="text-4xl mb-2">👋</div>
          <h2 className="text-xl font-black">مرحباً بك!</h2>
          <p className="text-white/70 text-sm mt-1">اكتب اسمك عشان يظهر على الشهادات والتكليفات</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">اسم الطالب</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: أحمد محمد"
            className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#00235b] focus:ring-2 focus:ring-[#00235b]/10 transition"
            autoFocus
          />

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 h-11 rounded-full bg-[#00235b] text-white font-black text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#001a44] transition"
            >
              حفظ الاسم
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-full border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition"
            >
              لاحقاً
            </button>
          </div>

          <p className="text-[10px] text-gray-400 text-center mt-3">
            الاسم محفوظ على جهازك فقط — يمكنك تغييره في أي وقت
          </p>
        </form>
      </div>
    </div>
  );
}