import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { readDB, writeDB, generateId } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { seedDatabase } from '@/lib/seed';
import type { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    await seedDatabase();
    const body = await request.json();
    const { idToken, phone, name } = body;

    if (!idToken || !name) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
    }

    const { adminAuth } = getFirebaseAdmin();

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json({ error: 'Token غير صالح' }, { status: 401 });
    }

    const phoneNumber = decodedToken.phone_number || phone;
    if (!phoneNumber) {
      return NextResponse.json({ error: 'رقم الموبايل غير موجود في التوكن' }, { status: 400 });
    }

    const users = await readDB<User>('users');

    const existingUser = users.find((u) => u.phone === phoneNumber);
    if (existingUser) {
      await createSession(existingUser.id);
      return NextResponse.json({
        success: true,
        user: { id: existingUser.id, name: existingUser.name, role: existingUser.role },
      });
    }

    const email = `otp_${Date.now()}@mansati.com`;

    const newUser: User = {
      id: generateId(),
      name: name.trim(),
      email,
      phone: phoneNumber,
      password: '',
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
    console.error('OTP Register error:', err);
    return NextResponse.json({ error: err?.message || 'حدث خطأ' }, { status: 500 });
  }
}
