import { NewUsers } from "../db/schema/indexSchema";
import { dbCreateUser, dbUpdateUserByClerkId, dbDeleteUserByClerkId } from "../models/user.model";
import { AppError } from "../utils/AppError";

export const createUser = async (data: NewUsers) => {
    const user = await dbCreateUser(data)
    if(!user) throw new AppError("Failed to create user", 500)
    return user
}

export const updateUserByClerkId = async (clerkId: string, data: Partial<NewUsers>) => {
    const user = await dbUpdateUserByClerkId(clerkId, data)
    if(!user) throw new AppError("Failed to update user", 500)
    return user
}   

export const deleteUserByClerkId = async (clerkId: string) => {
    await dbDeleteUserByClerkId(clerkId)
}