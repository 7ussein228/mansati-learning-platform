import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json();
  await saveSettings(body);
  return NextResponse.json({ success: true, settings: body });
}
