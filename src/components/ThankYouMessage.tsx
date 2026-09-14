"use client";

interface ThankYouMessageProps {
  studentName: string;
  taskTitle: string;
  courseName: string;
  onClose: () => void;
}

export default function ThankYouMessage({ studentName, taskTitle, courseName, onClose }: ThankYouMessageProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="text-6xl mb-3">💌</div>
          <h2 className="text-2xl font-black">شكراً لك يا {studentName}!</h2>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4">
            ✓
          </div>
          <h3 className="font-black text-lg text-[#00235b] mb-2">تم تسليم الواجب بنجاح</h3>
          <p className="text-gray-600 text-sm leading-6 mb-4">
            أحسنت يا <span className="font-black text-[#00235b]">{studentName}</span>! تم تسليم واجب
            <span className="font-bold"> ({taskTitle})</span> في كورس
            <span className="font-bold"> ({courseName})</span> بنجاح.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 justify-center">
              <span className="text-amber-500 text-lg">⏳</span>
              <span className="text-sm text-amber-800 font-bold">بانتظار مراجعة المدرس</span>
            </div>
            <p className="text-xs text-amber-600 mt-1">المدرس هيراجع التسليم وي communicates النتيجة</p>
          </div>

          <div className="bg-gradient-to-r from-[#00235b] to-blue-800 text-white rounded-2xl p-4 mb-4">
            <div className="text-sm font-bold mb-1">💡 نصيحة</div>
            <p className="text-xs text-white/80 leading-5">
              استمر في المتابعة وتسليم الواجبات في الوقت — التحدي والإصرار هو السر في النجاح!
            </p>
          </div>

          <div className="text-xs text-gray-400 mb-4">
            📧 سيتم إشعارك عند مراجعة المدرس للواجب
          </div>

          <button
            onClick={onClose}
            className="w-full h-12 rounded-full bg-[#00235b] text-white font-black text-sm hover:bg-[#001a44] transition"
          >
            متابعة التعلم ←
          </button>
        </div>
      </div>
    </div>
  );
}