import Link from 'next/link';
import { Star, Clock, Users, BookOpen } from 'lucide-react';
import type { Course } from '@/lib/types';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const totalHours = Math.round(course.duration / 60);
  return (
    <Link href={`/student/courses/${course.id}`} className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 block">
      <div className="relative h-44 overflow-hidden">
        {/* Use a colored gradient background with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(37,99,235,0.6), rgba(15,23,42,0.7)), url(${course.image})`,
          }}
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-blue-600">
          {course.category}
        </div>
        {course.isFree && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
            مجاني
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition">
          {course.title}
        </h3>
        <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {course.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {course.lessons.length} درس
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {totalHours} ساعة
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {course.studentsCount.toLocaleString('ar-EG')}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-slate-900 text-sm">{course.rating}</span>
          </div>
          <div className="text-left">
            {course.isFree ? (
              <span className="text-green-600 font-bold">مجاني</span>
            ) : (
              <span className="font-bold text-slate-900">
                {course.price} <span className="text-xs text-slate-500">ج.م</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
