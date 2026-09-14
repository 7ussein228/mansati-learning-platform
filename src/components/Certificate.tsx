"use client";
import { useRef } from "react";

interface CertificateProps {
  studentName: string;
  courseName: string;
  score: number;
  date: string;
  onClose: () => void;
}

export default function Certificate({ studentName, courseName, score, date, onClose }: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = certRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>شهادة تقدير - ${studentName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Cairo', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0; }
            .cert {
              width: 800px; padding: 60px; background: white;
              border: 8px solid #00235b; border-radius: 20px;
              text-align: center; position: relative; overflow: hidden;
            }
            .cert::before {
              content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
              background: repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,35,91,0.03) 35px, rgba(0,35,91,0.03) 70px);
            }
            .logo { font-size: 48px; margin-bottom: 10px; }
            .title { font-size: 36px; font-weight: 900; color: #00235b; margin-bottom: 5px; }
            .subtitle { font-size: 16px; color: #666; margin-bottom: 30px; }
            .line { width: 200px; height: 3px; background: linear-gradient(90deg, #FFB800, #00235b); margin: 0 auto 30px; border-radius: 2px; }
            .presented { font-size: 14px; color: #888; margin-bottom: 10px; }
            .name { font-size: 32px; font-weight: 900; color: #00235b; margin-bottom: 10px; text-decoration: underline; text-decoration-color: #FFB800; text-underline-offset: 8px; }
            .course { font-size: 16px; color: #555; margin-bottom: 8px; }
            .score { font-size: 20px; font-weight: 800; color: #16a34a; margin-bottom: 5px; }
            .date { font-size: 13px; color: #999; margin-bottom: 30px; }
            .footer { display: flex; justify-content: space-between; align-items: end; margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; }
            .sig { text-align: center; }
            .sig-line { width: 150px; border-top: 1px solid #ccc; margin-top: 40px; padding-top: 8px; font-size: 12px; color: #666; font-weight: 700; }
            .badge { display: inline-block; background: linear-gradient(135deg, #FFB800, #f59e0b); color: #00235b; padding: 6px 20px; border-radius: 30px; font-weight: 800; font-size: 14px; margin-bottom: 20px; }
            @media print { body { background: white; } .cert { border: 4px solid #00235b; } }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-[850px] w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div ref={certRef}>
          <div className="cert" style={{ padding: "60px", textAlign: "center", position: "relative", overflow: "hidden", border: "8px solid #00235b", borderRadius: "20px" }}>
            {/* Decorative corners */}
            <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-[#FFB800] rounded-tr-lg" />
            <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-[#FFB800] rounded-tl-lg" />
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-[#FFB800] rounded-br-lg" />
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-[#FFB800] rounded-bl-lg" />

            <div className="text-5xl mb-3">🏆</div>
            <div className="inline-block bg-gradient-to-r from-[#FFB800] to-amber-400 text-[#00235b] px-6 py-2 rounded-full font-black text-sm mb-4">
              شهادة تقدير
            </div>
            <h1 className="text-4xl font-black text-[#00235b] mb-1">شهادة إتمام بنجاح</h1>
            <p className="text-gray-500 text-sm mb-6">منصة د. حسين علي للتعليم</p>

            <div className="w-48 h-1 bg-gradient-to-r from-[#FFB800] to-[#00235b] mx-auto rounded-full mb-6" />

            <p className="text-gray-600 text-sm mb-2">يُ证书 هذا لـ</p>
            <h2 className="text-3xl font-black text-[#00235b] mb-2" style={{ textDecoration: "underline", textDecorationColor: "#FFB800", textUnderlineOffset: "8px" }}>
              {studentName}
            </h2>
            <p className="text-gray-600 text-sm mb-2">لنجاحه في اجتياز اختبار</p>
            <p className="text-lg font-bold text-gray-800 mb-2">{courseName}</p>
            <div className="text-2xl font-black text-emerald-600 mb-1">بدرجة {score}%</div>
            <p className="text-xs text-gray-400 mb-8">{date}</p>

            <div className="flex justify-between items-end mt-10 pt-6 border-t-2 border-gray-100">
              <div className="text-center">
                <div className="w-32 border-t border-gray-300 mt-12 pt-2 text-xs text-gray-600 font-bold">د. حسين علي</div>
                <div className="text-[10px] text-gray-400">المدرس</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#00235b] text-white flex items-center justify-center text-3xl mx-auto">🧬</div>
                <div className="text-xs font-bold text-[#00235b] mt-2">منصة د. حسين علي</div>
              </div>
              <div className="text-center">
                <div className="w-32 border-t border-gray-300 mt-12 pt-2 text-xs text-gray-600 font-bold">{new Date().toLocaleDateString("ar-EG")}</div>
                <div className="text-[10px] text-gray-400">تاريخ الإصدار</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-100">
          <button onClick={handlePrint} className="flex-1 h-12 rounded-full bg-[#00235b] text-white font-black text-sm hover:bg-[#001a44] transition">
            🖨️ طباعة الشهادة
          </button>
          <button onClick={onClose} className="flex-1 h-12 rounded-full border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}