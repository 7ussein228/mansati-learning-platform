import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/db/schema';
import { comparePassword, createSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, remember } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'الإيميل وكلمة المرور مطلوبان' }, { status: 400 });
    }

    const rows = await db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase())).limit(1);
    const user = rows[0];

    if (!user) {
      return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
    }

    await createSession(user.id, remember !== false);

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role, email: user.email },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: err?.message || 'حدث خطأ' }, { status: 500 });
  }
}
