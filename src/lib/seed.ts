import { db } from "@/lib/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { initialCourses, initialQuizzes, initialGroups, initialSettings, getSeedUsers } from "./data";
import type { Course, Quiz, Group, Settings, User } from "./types";

let seeded = false;

export async function seedDatabase() {
  if (seeded) return;

  // Users
  const existingUsers = await db.select().from(schema.users).limit(1);
  if (existingUsers.length === 0) {
    const users = await getSeedUsers();
    if (users.length > 0) {
      await db.insert(schema.users).values(users);
    }
  }

  // Courses
  const existingCourses = await db.select().from(schema.courses).limit(1);
  if (existingCourses.length === 0) {
    const coursesWithIds: Course[] = initialCourses.map((c, i) => ({
      ...c,
      id: `c${i + 1}`,
      lessons: c.lessons.map((l) => ({ ...l })),
    }));
    await db.insert(schema.courses).values(coursesWithIds);
  }

  // Quizzes
  const existingQuizzes = await db.select().from(schema.quizzes).limit(1);
  if (existingQuizzes.length === 0) {
    const quizzesWithIds: Quiz[] = initialQuizzes.map((q, i) => ({
      ...q,
      id: `q${i + 1}`,
    }));
    await db.insert(schema.quizzes).values(quizzesWithIds);
  }

  // Groups
  const existingGroups = await db.select().from(schema.groups).limit(1);
  if (existingGroups.length === 0) {
    const groupsWithIds: Group[] = initialGroups.map((g, i) => ({
      ...g,
      id: `g${i + 1}`,
    }));
    await db.insert(schema.groups).values(groupsWithIds);
  }

  // Settings
  const existingSettings = await db.select().from(schema.settings).limit(1);
  if (existingSettings.length === 0) {
    await db.insert(schema.settings).values({
      key: "main",
      value: initialSettings,
    });
  }

  seeded = true;
}
