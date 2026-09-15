import { readDB } from '@/lib/db';
import type { Group, Message, Course } from '@/lib/types';
import GroupsClient from './GroupsClient';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function StudentGroups() {
  const user = await getCurrentUser();
  const groups = await readDB<Group>('groups');
  const messages = await readDB<Message>('messages');
  const courses = await readDB<Course>('courses');

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--text-pure)' }}>جروبات النقاش</h1>
        <p className="mt-1" style={{ color: 'var(--text-dim)' }}>تواصل مع زملائك واطرح أسئلتك</p>
      </div>
      <GroupsClient
        groups={groups}
        initialMessages={messages}
        courses={courses}
        currentUserName={user?.name || 'طالب'}
        currentUserId={user?.id || ''}
      />
    </div>
  );
}
