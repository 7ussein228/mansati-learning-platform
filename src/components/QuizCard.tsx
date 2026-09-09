import Link from 'next/link';
import { Clock, FileQuestion, Award, Target } from 'lucide-react';
import type { Quiz } from '@/lib/types';

interface QuizCardProps {
  quiz: Quiz;
  courseName?: string;
}

export default function QuizCard({ quiz, courseName }: QuizCardProps) {
  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <Link
      href={`/student/quizzes/${quiz.id}`}
      className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-lg transition-all hover:-translate-y-1 block"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition">
          <FileQuestion className="w-6 h-6 text-blue-600 group-hover:text-white transition" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition line-clamp-1">
            {quiz.title}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 mb-3">
            {quiz.description}
          </p>
          {courseName && (
            <span className="inline-block text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full mb-3">
              {courseName}
            </span>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{quiz.duration} دقيقة</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <FileQuestion className="w-3.5 h-3.5 text-slate-400" />
              <span>{quiz.questions.length} سؤال</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Award className="w-3.5 h-3.5 text-slate-400" />
              <span>{totalPoints} نقطة</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Target className="w-3.5 h-3.5 text-slate-400" />
              <span>نجاح {quiz.passingScore}%</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
