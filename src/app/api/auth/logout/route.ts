import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

export async function POST(request: Request) {
  await destroySession();
  const referer = request.headers.get('referer');
  let base = '/login';
  if (referer) {
    try {
      const url = new URL(referer);
      base = url.pathname.startsWith('/admin') || url.pathname.startsWith('/student') ? '/login' : '/';
    } catch {}
  }
  return NextResponse.redirect(new URL(base, request.url), { status: 303 });
}

export async function GET(request: Request) {
  await destroySession();
  return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
}
