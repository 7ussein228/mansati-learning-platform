import { readDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await readDB('users');
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
