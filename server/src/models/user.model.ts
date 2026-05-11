import { eq } from "drizzle-orm";
import { db } from "../db/indexDB";
import { NewUsers, users } from "../db/schema/indexSchema";

export const dbCreateUser = async (data: NewUsers) => {
    const [user] = await db.insert(users).values(data).returning()
    return user ?? null
}

export const dbUpdateUserByClerkId = async (clerkId: string, data: Partial<NewUsers>) => {
    const [updatedUser] = await db.update(users).set(data).where(eq(users.clerkId, clerkId)).returning()
    return updatedUser ?? null
}

export const dbDeleteUserByClerkId = async (clerkId: string) => {
    await db.delete(users).where(eq(users.clerkId, clerkId))
}