import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import type { Subscription } from '@/lib/types';

export async function GET() {
  const subscriptions = await readDB<Subscription>('subscriptions');
  return NextResponse.json({ subscriptions });
}
