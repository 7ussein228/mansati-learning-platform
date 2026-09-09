import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import { comparePassword, createSession } from '@/lib/auth';
import { seedDatabase } from '@/lib/seed';
import type { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    await seedDatabase();

    const body = await request.json();
    const { email, password, remember } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'الإيميل وكلمة المرور مطلوبان' }, { status: 400 });
    }

    const users = await readDB<User>('users');
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

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
