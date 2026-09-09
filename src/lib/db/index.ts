import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required. Create a .env.local file with your PostgreSQL connection string."
  );
}

const globalForDb = globalThis as typeof globalThis & {
  __mansatiDb?: ReturnType<typeof drizzle>;
};

export const db =
  globalForDb.__mansatiDb ??
  drizzle(new Pool({ connectionString: databaseUrl }));

if (process.env.NODE_ENV !== "production") {
  globalForDb.__mansatiDb = db;
}

// Table map for readDB/writeDB compatibility
const tableMap = {
  users: schema.users,
  courses: schema.courses,
  quizzes: schema.quizzes,
  enrollments: schema.enrollments,
  certificates: schema.certificates,
  groups: schema.groups,
  messages: schema.messages,
  subscriptions: schema.subscriptions,
  attempts: schema.attempts,
} as const;

type TableName = keyof typeof tableMap;

export async function readDB<T = any>(key: TableName): Promise<T[]> {
  const table = tableMap[key];
  if (!table) return [];
  const rows = await db.select().from(table);
  return rows as T[];
}

export async function writeDB(key: TableName, data: any[]): Promise<void> {
  const table = tableMap[key];
  if (!table) return;
  // Delete all existing rows then insert new ones
  await db.delete(table);
  if (data.length > 0) {
    await db.insert(table).values(data);
  }
}

export async function readSingle<T = any>(key: TableName): Promise<T | null> {
  const table = tableMap[key];
  if (!table) return null;
  const rows = await db.select().from(table).limit(1);
  return (rows[0] as T) || null;
}

export async function writeSingle(key: TableName, data: any): Promise<void> {
  const table = tableMap[key];
  if (!table) return;
  await db.delete(table);
  await db.insert(table).values(data);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// Settings helper - read/write the settings row
export async function getSettings(): Promise<any> {
  const rows = await db.select().from(schema.settings).limit(1);
  return rows[0]?.value || null;
}

export async function saveSettings(data: any): Promise<void> {
  await db.delete(schema.settings);
  await db.insert(schema.settings).values({ key: "main", value: data });
}
