import { z } from 'zod'

export const getByIdGlobal = z.object({
    id: z.uuid()
})

export const getByUserIdGlobal = z.object({
    userId: z.uuid()
})

export const getAllQueryGlobal = z.object({
    currentPageNum: z.string().optional().transform(val => {
        const parsed = parseInt(val || '1')
        return isNaN(parsed) ? 1 : parsed
    }),
    limit: z.string().optional().transform(val => {
        const parsed = parseInt(val ?? '10')
        return isNaN(parsed) ? 10 : parsed
    })
}).strict()

export type GetAllQuery = z.infer<typeof getAllQueryGlobal>

export type GetByUserId = z.infer<typeof getByUserIdGlobal>

export type GetById = z.infer<typeof getByIdGlobal>