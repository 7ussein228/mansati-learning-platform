import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/db/schema';
import { getSeedUsers, initialCourses, initialGroups, initialSettings } from '@/lib/data';
import type { Course, Group } from '@/lib/types';

export async function POST() {
  try {
    await db.delete(schema.purchases);
    await db.delete(schema.attempts);
    await db.delete(schema.messages);
    await db.delete(schema.certificates);
    await db.delete(schema.enrollments);
    await db.delete(schema.subscriptions);
    await db.delete(schema.quizzes);
    await db.delete(schema.groups);
    await db.delete(schema.courses);
    await db.delete(schema.users);
    await db.delete(schema.settings);

    const users = await getSeedUsers();
    await db.insert(schema.users).values(users);

    const coursesWithIds: Course[] = initialCourses.map((c, i) => ({
      ...c,
      id: `c${i + 1}`,
      lessons: c.lessons.map((l) => ({ ...l })),
    }));
    await db.insert(schema.courses).values(coursesWithIds);

    const groupsWithIds: Group[] = initialGroups.map((g, i) => ({
      ...g,
      id: `g${i + 1}`,
    }));
    await db.insert(schema.groups).values(groupsWithIds);

    await db.insert(schema.settings).values({
      key: 'main',
      value: initialSettings,
    });

    return NextResponse.json({ success: true, message: 'تم إعادة تعيين الداتابيس بالكامل' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
