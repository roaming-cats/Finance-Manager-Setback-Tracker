import { z } from 'zod'

export const createEntrySchema = z.object({
    amount: z.string().optional().transform(val => {
        const parsed = parseInt(val || '1')
        return isNaN(parsed) ? 1 : parsed
    }),
    type: z.enum(['credit', 'debit']),
    timestamp: z.enum(['daily', 'monthly', 'yearly'])
}).strict()



export const updateEntrySchema = createEntrySchema.partial().strict().refine(data => Object.keys(data).length > 0, { message: "At least one field is needed." })

export type CreateEntryBody = z.infer<typeof createEntrySchema>

export type UpdateEntryBody = z.infer<typeof updateEntrySchema>