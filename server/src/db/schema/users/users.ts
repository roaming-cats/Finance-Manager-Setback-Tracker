import { uuid, pgTable, varchar, timestamp, bigint } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 120 }).notNull().unique(),
    currentBalance: bigint('current_balance', { mode: 'number' }).default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdateFn(() => new Date())
        .notNull()
})

export type Users = typeof users.$inferSelect
export type NewUsers = typeof users.$inferInsert