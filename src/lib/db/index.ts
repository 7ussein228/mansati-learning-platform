import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

const DB_FILES: Record<string, string> = {
  users: 'users.json',
  courses: 'courses.json',
  quizzes: 'quizzes.json',
  enrollments: 'enrollments.json',
  certificates: 'certificates.json',
  groups: 'groups.json',
  messages: 'messages.json',
  subscriptions: 'subscriptions.json',
  attempts: 'attempts.json',
  settings: 'settings.json',
};

export async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function readDB<T = any>(key: keyof typeof DB_FILES): Promise<T[]> {
  await ensureDataDir();
  const file = path.join(DATA_DIR, DB_FILES[key]);
  try {
    const content = await fs.readFile(file, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function writeDB(key: keyof typeof DB_FILES, data: any[]): Promise<void> {
  await ensureDataDir();
  const file = path.join(DATA_DIR, DB_FILES[key]);
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
}

export async function readSingle<T = any>(key: keyof typeof DB_FILES): Promise<T | null> {
  await ensureDataDir();
  const file = path.join(DATA_DIR, DB_FILES[key]);
  try {
    const content = await fs.readFile(file, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function writeSingle(key: keyof typeof DB_FILES, data: any): Promise<void> {
  await ensureDataDir();
  const file = path.join(DATA_DIR, DB_FILES[key]);
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8');
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
