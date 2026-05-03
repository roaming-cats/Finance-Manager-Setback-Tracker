import { uuid, varchar, timestamp, pgTable, text, boolean } from "drizzle-orm/pg-core";
// Example data
export const jobPostings = pgTable('job_postings',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        title: varchar('title', { length: 255 }).notNull(),
        department: varchar('department', { length: 100 }).notNull(),
        location: varchar('location', { length: 255 }).notNull(),
        description: text('description').notNull(),
        isActive: boolean('is_active').default(true).notNull(),
        isArchived: boolean('is_archived').default(false).notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),  
        updatedAt: timestamp('updated_at')
            .defaultNow()
            .$onUpdateFn(() => new Date())
            .notNull()
    }
)

export type JobPost = typeof jobPostings.$inferSelect
export type NewJobPost = typeof jobPostings.$inferInsert