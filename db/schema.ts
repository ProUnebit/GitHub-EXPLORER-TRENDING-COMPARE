import { pgTable, serial, text, timestamp, boolean, numeric } from 'drizzle-orm/pg-core';

export const feedback = pgTable('feedback', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  userName: text('user_name').notNull(),
  content: text('content').notNull(),
  
  // ✅ ИЗМЕНЯЕМ: с INTEGER на NUMERIC(2,1)
  // NUMERIC(2,1) = 2 цифры всего, 1 после запятой (1.0 - 5.0)
  rating: numeric('rating', { precision: 2, scale: 1 }).notNull(),
  
  edited: boolean('edited').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
});

// ============================================
// TYPESCRIPT TYPES
// ============================================
export type NewFeedback = typeof feedback.$inferInsert;
export type Feedback = typeof feedback.$inferSelect;

// ✅ ОБНОВЛЯЕМ TYPE для рейтинга
export type Rating = 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;