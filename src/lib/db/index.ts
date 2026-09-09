import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";

const globalForDb = globalThis as typeof globalThis & {
  __mansatiDb?: NodePgDatabase<typeof schema>;
};

function getDb(): NodePgDatabase<typeof schema> {
  if (globalForDb.__mansatiDb) return globalForDb.__mansatiDb;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required. Create a .env.local file with your PostgreSQL connection string."
    );
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const dbInstance = drizzle(pool, { schema });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__mansatiDb = dbInstance;
  }

  return dbInstance;
}

// Lazy db getter - only connects when actually used
export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    const database = getDb();
    const value = Reflect.get(database, prop, receiver);
    if (typeof value === "function") {
      return value.bind(database);
    }
    return value;
  },
});

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
  purchases: schema.purchases,
} as const;

type TableName = keyof typeof tableMap;

export async function readDB<T = any>(key: TableName): Promise<T[]> {
  const table = tableMap[key];
  if (!table) return [];
  const database = getDb();
  const rows = await database.select().from(table);
  return rows as T[];
}

export async function writeDB(key: TableName, data: any[]): Promise<void> {
  const table = tableMap[key];
  if (!table) return;
  const database = getDb();
  await database.delete(table);
  if (data.length > 0) {
    await database.insert(table).values(data);
  }
}

export async function readSingle<T = any>(key: TableName): Promise<T | null> {
  const table = tableMap[key];
  if (!table) return null;
  const database = getDb();
  const rows = await database.select().from(table).limit(1);
  return (rows[0] as T) || null;
}

export async function writeSingle(key: TableName, data: any): Promise<void> {
  const table = tableMap[key];
  if (!table) return;
  const database = getDb();
  await database.delete(table);
  await database.insert(table).values(data);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// Settings helper
export async function getSettings(): Promise<any> {
  const database = getDb();
  const rows = await database.select().from(schema.settings).limit(1);
  return rows[0]?.value || null;
}

export async function saveSettings(data: any): Promise<void> {
  const database = getDb();
  await database.delete(schema.settings);
  await database.insert(schema.settings).values({ key: "main", value: data });
}
