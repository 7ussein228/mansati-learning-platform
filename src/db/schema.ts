import {
  pgTable,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  real,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"),
  points: integer("points").notNull().default(0),
  createdAt: text("created_at").notNull(),
  status: text("status").default("active"),
});

export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: real("price").notNull().default(0),
  isFree: boolean("is_free").notNull().default(false),
  image: text("image").notNull().default(""),
  lessons: jsonb("lessons").notNull().default([]),
  rating: real("rating").notNull().default(0),
  studentsCount: integer("students_count").notNull().default(0),
  duration: integer("duration").notNull().default(0),
});

export const quizzes = pgTable("quizzes", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  courseId: text("course_id").notNull(),
  questions: jsonb("questions").notNull().default([]),
  duration: integer("duration").notNull().default(20),
  passingScore: integer("passing_score").notNull().default(60),
});

export const enrollments = pgTable("enrollments", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull(),
  courseId: text("course_id").notNull(),
  progress: integer("progress").notNull().default(0),
  completedLessons: jsonb("completed_lessons").notNull().default([]),
  enrolledAt: text("enrolled_at").notNull(),
});

export const certificates = pgTable("certificates", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull(),
  studentName: text("student_name").notNull(),
  courseId: text("course_id").notNull(),
  courseName: text("course_name").notNull(),
  date: text("date").notNull(),
  grade: text("grade").notNull(),
});

export const groups = pgTable("groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  courseId: text("course_id"),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  groupId: text("group_id").notNull(),
  senderId: text("sender_id").notNull(),
  senderName: text("sender_name").notNull(),
  text: text("text").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull(),
  studentName: text("student_name").notNull(),
  type: text("type").notNull(),
  amount: real("amount").notNull().default(0),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  status: text("status").notNull().default("نشط"),
});

export const attempts = pgTable("attempts", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull(),
  quizId: text("quiz_id").notNull(),
  score: integer("score").notNull().default(0),
  totalPoints: integer("total_points").notNull().default(0),
  percentage: integer("percentage").notNull().default(0),
  passed: boolean("passed").notNull().default(false),
  completedAt: text("completed_at").notNull(),
  answers: jsonb("answers").notNull().default({}),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
});
