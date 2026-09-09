import { NextResponse } from 'next/server';
import { readSingle, writeSingle } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import type { Settings } from '@/lib/types';

export async function GET() {
  const settings = (await readSingle<Settings>('settings'));
  return NextResponse.json({ settings });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json();
  await writeSingle('settings', body);
  return NextResponse.json({ success: true, settings: body });
}
