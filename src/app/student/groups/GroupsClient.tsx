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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row h-[calc(100vh-200px)] lg:h-[calc(100vh-220px)]">
      {/* Groups sidebar */}
      <div className="lg:w-72 border-b lg:border-b-0 lg:border-l border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-blue-600" />
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
                className={`w-full text-right p-3 rounded-xl transition ${
                  isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                  <span className="font-bold text-sm line-clamp-1">{g.name}</span>
                </div>
                {course && (
                  <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-slate-500'} line-clamp-1 mr-6`}>
                    {course.title}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeGroup ? (
          <>
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900">{activeGroup.name}</h3>
              <p className="text-xs text-slate-500">{groupMessages.length} رسالة</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {groupMessages.map((m) => {
                const isMe = m.senderId === currentUserId || (currentUserId === '' && m.senderName === currentUserName);
                const isTeacher = m.senderId === 'system';
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] ${isMe ? 'items-start' : 'items-end'} flex flex-col`}>
                      <div className={`text-xs mb-1 ${isMe ? 'text-blue-600 font-bold' : 'text-slate-600'}`}>
                        {m.senderName}
                        {isTeacher && ' (مدرس)'}
                      </div>
                      <div
                        className={`px-4 py-2.5 rounded-2xl ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-bl-md'
                            : isTeacher
                            ? 'bg-yellow-100 text-slate-900 rounded-br-md border border-yellow-200'
                            : 'bg-white border border-slate-200 text-slate-900 rounded-br-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{m.text}</p>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">{formatTime(m.timestamp)}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="اكتب رسالتك..."
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            اختر مجموعة لبدء النقاش
          </div>
        )}
      </div>
    </div>
  );
}
