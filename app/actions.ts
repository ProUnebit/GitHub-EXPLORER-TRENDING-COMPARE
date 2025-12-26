// app/actions.ts
'use server'

import { db } from '@/db';
import { feedback } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export async function addFeedbackAction(formData: FormData) {
  const userName = formData.get('userName') as string;
  const content = formData.get('content') as string;

  if (!userName || !content) return;

  // 1. Вставляем данные в реальную базу данных через Drizzle
  await db.insert(feedback).values({
    userName,
    content,
  });

  // 2. ОЧЕНЬ ВАЖНО: говорим Next.js, что данные на странице "/" устарели.
  // Он заново загрузит данные из базы и обновит всех клиентов.
  revalidatePath('/');
}