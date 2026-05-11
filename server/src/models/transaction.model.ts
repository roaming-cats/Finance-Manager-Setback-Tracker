import { count, eq } from "drizzle-orm";
import { db } from "../db/indexDB";
import { entries, NewEntry } from "../db/schema/indexSchema";

export const dbCreateEntry = async (data: NewEntry) => {
    const [entry] = await db.insert(entries).values(data).returning()
    return entry ?? null
}

export const dbGetAllEntriesByUserID = async (userId: string, limit?: number, offset?: number) => {
    return db.select()
        .from(entries)
        .where(eq(entries.userId, userId))
        .limit(limit ?? 10)
        .offset(offset ?? 0)
}

export const dbGetAllEntriesByUserIDCount = async (userId: string) => {
    const [total] = await db.select({ count: count()})
        .from(entries)
        .where(eq(entries.userId, userId))
    
    return total?.count ?? 0
}

export const dbUpdateEntryById = async (id: string, data: Partial<NewEntry>) => {
    const [entry] = await db.update(entries).set(data).where(eq(entries.id, id)).returning()
    return entry ?? null
}

export const dbDeleteEntryById = async (id: string) => {
    await db.delete(entries).where(eq(entries.id, id))
}

