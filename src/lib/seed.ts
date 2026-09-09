import { readDB, writeDB, writeSingle, readSingle, ensureDataDir } from './db';
import { initialCourses, initialQuizzes, initialGroups, initialSettings, getSeedUsers } from './data';
import type { Course, Quiz, Group, Settings, User } from './types';

let seeded = false;

export async function seedDatabase() {
  if (seeded) return;
  await ensureDataDir();

  // Users
  const existingUsers = await readDB<User>('users');
  if (existingUsers.length === 0) {
    const users = await getSeedUsers();
    await writeDB('users', users);
  }

  // Courses - assign IDs c1, c2, ...
  const existingCourses = await readDB<Course>('courses');
  if (existingCourses.length === 0) {
    const coursesWithIds: Course[] = initialCourses.map((c, i) => ({
      ...c,
      id: `c${i + 1}`,
      lessons: c.lessons.map(l => ({ ...l })),
    }));
    await writeDB('courses', coursesWithIds);
  }

  // Quizzes
  const existingQuizzes = await readDB<Quiz>('quizzes');
  if (existingQuizzes.length === 0) {
    const courses = await readDB<Course>('courses');
    const quizzesWithIds: Quiz[] = initialQuizzes.map((q, i) => {
      // Map courseId from 'c1' to actual course IDs if needed. initialQuizzes use c1,c2,c3 already.
      return { ...q, id: `q${i + 1}` };
    });
    await writeDB('quizzes', quizzesWithIds);
    void courses;
  }

  // Groups
  const existingGroups = await readDB<Group>('groups');
  if (existingGroups.length === 0) {
    const groupsWithIds: Group[] = initialGroups.map((g, i) => ({
      ...g,
      id: `g${i + 1}`,
    }));
    await writeDB('groups', groupsWithIds);
  }

  // Settings
  const existingSettings = await readSingle<Settings>('settings');
  if (!existingSettings) {
    await writeSingle('settings', initialSettings);
  }

  seeded = true;
}
