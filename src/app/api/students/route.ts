import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import type { User } from '@/lib/types';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const users = await readDB<User>('users');
  const students = users.filter((u) => u.role === 'student').map((s) => ({
    ...s,
    password: undefined,
  }));
  return NextResponse.json({ students });
}
