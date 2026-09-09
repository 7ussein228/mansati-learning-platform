export type Role = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: Role;
  points: number;
  createdAt: string;
  status?: 'active' | 'blocked';
}

export type Category = 'فيزياء' | 'رياضيات' | 'كيمياء' | 'أحياء' | 'إنجليزي';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  isFree: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: Category;
  price: number;
  isFree: boolean;
  image: string;
  lessons: Lesson[];
  rating: number;
  studentsCount: number;
  duration: number; // total minutes
}

export type QuestionType = 'multiple' | 'truefalse';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  questions: Question[];
  duration: number; // minutes
  passingScore: number; // percentage
}

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  date: string;
  grade: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  progress: number; // percentage
  completedLessons: string[];
  enrolledAt: string;
}

export interface Message {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Group {
  id: string;
  name: string;
  courseId?: string;
}

export type SubscriptionType = 'شهري' | 'سنوي';
export type SubscriptionStatus = 'نشط' | 'منتهي' | 'ملغي';

export interface Subscription {
  id: string;
  studentId: string;
  studentName: string;
  type: SubscriptionType;
  amount: number;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  answers: Record<string, string>;
}

export interface Settings {
  platformName: string;
  description: string;
  email: string;
  phone: string;
  facebook: string;
  youtube: string;
  telegram: string;
  monthlyPrice: number;
  yearlyPrice: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  newCourseAlerts: boolean;
}
