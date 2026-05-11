import { Request, Response, NextFunction } from "express"
import { createEntry, deleteEntryById, getAllEntriesByUserId, updateEntryById } from "../services/transaction.services"
import { ValidatedRequest } from "../types/request"
import { CreateEntryBody, UpdateEntryBody } from "../utils/validators/transaction.validator"
import { GetAllQuery, GetById, GetByUserId } from "../utils/validators/global.validator"

export const handleCreateEntry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as ValidatedRequest<unknown, CreateEntryBody>

        const body = request.validatedBody!

        const newEntry = await createEntry({
            ...body,
            amount: BigInt(body.amount)
        })

        res.status(201).json({status: 'success', data: newEntry})
    } catch (error) {
        next(error)
    }
}

export const handleGetAllEntriesByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // if (!req.user?.id) {
        //     res.status(401).json({status: 'error', message: "Unauthorized"})
        //     return
        // }????????

        const request = req as ValidatedRequest<GetAllQuery, unknown, GetByUserId>

        const { userId } = request.validatedParams!

        const { limit, currentPageNum } = request.validatedQuery!

        const entries = await getAllEntriesByUserId(userId, limit, currentPageNum)

        res.status(200).json({status: 'success', data: entries})
    } catch (error) {
        next(error)
    }
}

export const handleUpdateEntryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as ValidatedRequest<unknown, UpdateEntryBody, GetById>

        const { id } = request.validatedParams!

        const body = request.validatedBody!

        const updatedEntry = await updateEntryById(id, {
            ...body,
            amount: BigInt(body.amount!)
        })

        res.status(200).json({status: 'success', data: updatedEntry})
    } catch (error) {
        next(error)
    }
}

export const handleDeleteEntryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as ValidatedRequest<unknown, unknown, GetById>

        const { id } = request.validatedParams!

        await deleteEntryById(id)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
}