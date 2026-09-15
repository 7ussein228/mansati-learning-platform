'use client';

import { useState, useEffect, useRef } from 'react';
import type { Group, Message, Course } from '@/lib/types';
import { Send, MessageSquare, Users as UsersIcon } from 'lucide-react';

interface Props {
  groups: Group[];
  initialMessages: Message[];
  courses: Course[];
  currentUserName: string;
  currentUserId: string;
}

export default function GroupsClient({ groups, initialMessages, courses, currentUserName, currentUserId }: Props) {
  const [activeGroup, setActiveGroup] = useState<Group>(groups[0]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMsg, setNewMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const groupMessages = messages
    .filter((m) => m.groupId === activeGroup?.id)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => {
    if (activeGroup && groupMessages.length === 0) {
      const demoMsgs: Message[] = [
        {
          id: 'demo1-' + activeGroup.id,
          groupId: activeGroup.id,
          senderId: 'system',
          senderName: 'الأستاذ أحمد',
          text: `أهلاً بكم في مجموعة "${activeGroup.name}"، نرجو الالتزام بالأسئلة المتعلقة بالمادة.`,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'demo2-' + activeGroup.id,
          groupId: activeGroup.id,
          senderId: 'student2',
          senderName: 'سارة أحمد',
          text: 'السلام عليكم، ممكن شرح النقطة دي في الدرس الأول؟',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
        },
        {
          id: 'demo3-' + activeGroup.id,
          groupId: activeGroup.id,
          senderId: 'student3',
          senderName: 'محمد علي',
          text: 'وعليكم السلام، راجع الفيديو من الدقيقة 25 فيه شرح وافي جداً',
          timestamp: new Date(Date.now() - 900000).toISOString(),
        },
      ];
      setMessages((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const toAdd = demoMsgs.filter((dm) => !existingIds.has(dm.id));
        return [...prev, ...toAdd];
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGroup?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      groupId: activeGroup.id,
      senderId: currentUserId || 'me',
      senderName: currentUserName || 'أنا',
      text: newMsg.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMsg('');
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className="overflow-hidden flex flex-col lg:flex-row h-[calc(100vh-200px)] lg:h-[calc(100vh-220px)]"
      style={{
        background: 'var(--card-glass)',
        border: '1px solid var(--border-plasma)',
        borderRadius: '20px',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="lg:w-72 flex flex-col" style={{ borderBottom: '1px solid var(--border-plasma)' }}>
        <div className="p-4" style={{ borderBottom: '1px solid var(--border-plasma)' }}>
          <h2 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-pure)' }}>
            <UsersIcon className="w-5 h-5" style={{ color: 'var(--neon-blue)' }} />
            الجروبات
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {groups.map((g) => {
            const course = courses.find((c) => c.id === g.courseId);
            const isActive = activeGroup?.id === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setActiveGroup(g)}
                className="w-full text-right p-3 rounded-xl transition"
                style={{
                  background: isActive ? 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-dim)',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-4 h-4" style={{ color: isActive ? 'white' : 'var(--neon-blue)' }} />
                  <span className="font-bold text-sm line-clamp-1">{g.name}</span>
                </div>
                {course && (
                  <div className="text-xs line-clamp-1 mr-6" style={{ color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--text-dim)' }}>
                    {course.title}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {activeGroup ? (
          <>
            <div className="p-4" style={{ borderBottom: '1px solid var(--border-plasma)', background: 'rgba(255,255,255,0.03)' }}>
              <h3 className="font-bold" style={{ color: 'var(--text-pure)' }}>{activeGroup.name}</h3>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{groupMessages.length} رسالة</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
              {groupMessages.map((m) => {
                const isMe = m.senderId === currentUserId || (currentUserId === '' && m.senderName === currentUserName);
                const isTeacher = m.senderId === 'system';
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] ${isMe ? 'items-start' : 'items-end'} flex flex-col`}>
                      <div className="text-xs mb-1 font-bold" style={{ color: isMe ? 'var(--neon-blue)' : 'var(--text-dim)' }}>
                        {m.senderName}
                        {isTeacher && ' (مدرس)'}
                      </div>
                      <div
                        className="px-4 py-2.5 rounded-2xl"
                        style={{
                          background: isMe
                            ? 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))'
                            : isTeacher
                            ? 'rgba(255,190,11,0.15)'
                            : 'rgba(255,255,255,0.06)',
                          color: 'var(--text-pure)',
                          border: isTeacher ? '1px solid rgba(255,190,11,0.3)' : isMe ? 'none' : '1px solid var(--border-plasma)',
                          borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        }}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{m.text}</p>
                      </div>
                      <div className="text-[10px] mt-1" style={{ color: 'var(--text-dim)' }}>{formatTime(m.timestamp)}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 flex gap-2" style={{ borderTop: '1px solid var(--border-plasma)' }}>
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="اكتب رسالتك..."
                className="input-space flex-1 px-4 py-2.5 rounded-xl outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-plasma)',
                  color: 'var(--text-pure)',
                }}
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))', color: 'white' }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center" style={{ color: 'var(--text-dim)' }}>
            اختر مجموعة لبدء النقاش
          </div>
        )}
      </div>
    </div>
  );
}
