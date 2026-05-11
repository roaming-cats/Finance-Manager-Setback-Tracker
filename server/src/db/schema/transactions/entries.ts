import { uuid, timestamp, pgTable, bigint } from "drizzle-orm/pg-core";
import { entryTypeEnum, timestampEnum } from "./enums";
import { users } from "../users/users";

export const entries = pgTable('entries',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        userId: uuid('user_id')
            .references(() => users.id, { onDelete: 'cascade'}),
        amount: bigint('amount', {mode: 'bigint'}).notNull(),
        type: entryTypeEnum('type').default('credit').notNull(),
        timestamp: timestampEnum('timestamp').default('daily').notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),  
        updatedAt: timestamp('updated_at')
            .defaultNow()
            .$onUpdateFn(() => new Date())
            .notNull()
    }
)

export type Entry = typeof entries.$inferSelect
export type NewEntry = typeof entries.$inferInsert