import { NextResponse } from 'next/server';
import { readDB, writeDB, generateId } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';
import { seedDatabase } from '@/lib/seed';
import type { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    await seedDatabase();
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

    const users = await readDB<User>('users');
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ error: 'هذا الإيميل مسجل بالفعل' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const newUser: User = {
      id: generateId(),
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: 'student',
      points: 0,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    users.push(newUser);
    await writeDB('users', users);
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
