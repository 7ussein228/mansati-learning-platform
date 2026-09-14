import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { readDB } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { seedDatabase } from '@/lib/seed';
import type { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    await seedDatabase();
    const body = await request.json();
    const { idToken, phone } = body;

    if (!idToken) {
      return NextResponse.json({ error: 'Token مطلوب' }, { status: 400 });
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
    const user = users.find((u) => u.phone === phoneNumber);

    if (!user) {
      return NextResponse.json({ error: 'لا يوجد حساب بهذا الرقم. سجّل حساب جديد أولاً' }, { status: 404 });
    }

    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role, email: user.email },
    });
  } catch (err: any) {
    console.error('OTP Login error:', err);
    return NextResponse.json({ error: err?.message || 'حدث خطأ' }, { status: 500 });
  }
}
