import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { readDB } from './db';
import type { User } from './types';

const COOKIE_NAME = 'mansati_session';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string, remember: boolean = true) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days or 1 day
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(COOKIE_NAME)?.value;
  if (!userId) return null;
  try {
    const { seedDatabase } = await import('./seed');
    await seedDatabase();
  } catch {}
  const users = await readDB<User>('users');
  return users.find(u => u.id === userId) || null;
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Forbidden');
  }
  return user;
}
