import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/db/schema';
import { generateId } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import type { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password, confirmPassword, agree } = body;

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'كلمات المرور غير متطابقة' }, { status: 400 });
    }

    if (!agree) {
      return NextResponse.json({ error: 'يجب الموافقة على الشروط والأحكام' }, { status: 400 });
    }

    const existing = await db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase())).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'هذا الإيميل مسجل بالفعل' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: generateId(),
      name,
      email: email.toLowerCase(),
      phone: phone || null,
      password: hashedPassword,
      role: 'student' as const,
      points: 0,
      createdAt: new Date().toISOString(),
      status: 'active' as const,
    };

    await db.insert(schema.users).values(newUser);
    await createSession(newUser.id);

    return NextResponse.json({
      success: true,
      user: { id: newUser.id, name: newUser.name, role: newUser.role },
    });
  } catch (err: any) {
    console.error('Register error:', err);
    return NextResponse.json({ error: err?.message || 'حدث خطأ' }, { status: 500 });
  }
}
