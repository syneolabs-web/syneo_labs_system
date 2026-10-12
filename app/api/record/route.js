import { after } from 'next/server';
import { api } from '@/lib/auth';
import { saveRecord, generateGoogleMeetRoom } from '@/lib/db';
import { processJobs } from '@/lib/delivery';

export const POST = api(async ({ body, user }) => {
  if (body.action === 'generateMeetLink') {
    return generateGoogleMeetRoom(body.body, user);
  }
  const id = await saveRecord(body.kind, body.id, body.body, user);
  if (['leads', 'meetings', 'tasks', 'announcements'].includes(body.kind)) after(processJobs);
  return { id };
});

