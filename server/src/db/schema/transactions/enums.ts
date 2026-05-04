import { pgEnum } from "drizzle-orm/pg-core";

export const entryTypeEnum = pgEnum('entry_type_enum', [
    'credit', 'debit'
])

export const timestampEnum = pgEnum('timestamp_enum', [
    'daily', 'monthly', 'yearly'
])