import { NewEntry } from "../db/schema/indexSchema";
import { dbCreateEntry, dbDeleteEntryById, dbGetAllEntriesByUserID, dbGetAllEntriesByUserIDCount, dbUpdateEntryById } from "../models/transaction.model";
import { AppError } from "../utils/AppError";

export const createEntry = async (data: NewEntry) => {
    const entry = await dbCreateEntry(data)
    
    if(!entry) throw new AppError("Failed to create new entry", 500)

    return entry
}

export const getAllEntriesByUserId = async (userId: string, limit?: number, currentPageNum?: number) => {
    const limitValue = limit || 10

    const currentPageValue = currentPageNum || 1

    const offset = (currentPageValue - 1) * limitValue

    const getDatas = await dbGetAllEntriesByUserID(userId, limit, offset)

    const dataCount = await dbGetAllEntriesByUserIDCount(userId)

    return {
        data: getDatas,
        searchCount: dataCount,
        page: currentPageValue,
        limit: limitValue, 
        totalPages: Math.ceil(dataCount / limitValue) || 1
    }
}

export const updateEntryById = async (id: string, data: Partial<NewEntry>) => {
    const entry = await dbUpdateEntryById(id, data)

    if(!entry) throw new AppError("Failed to update an entry", 500)

    return entry
}

export const deleteEntryById = async (id: string) => {
    await dbDeleteEntryById(id)
}