import { NextResponse } from 'next/server';
import { readDB, writeDB, generateId } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import type { Message } from '@/lib/types';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const messages = await readDB<Message>('messages');
  const groupMessages = messages
    .filter((m) => m.groupId === id)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  return NextResponse.json({ messages: groupMessages });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { text } = await request.json();
  if (!text?.trim()) return NextResponse.json({ error: 'Text required' }, { status: 400 });

  const messages = await readDB<Message>('messages');
  const newMessage: Message = {
    id: generateId(),
    groupId: id,
    senderId: user.id,
    senderName: user.name,
    text: text.trim(),
    timestamp: new Date().toISOString(),
  };
  messages.push(newMessage);
  await writeDB('messages', messages);
  return NextResponse.json({ message: newMessage });
}
