import { Request, Response, NextFunction } from 'express'
import { ZodType } from 'zod'

export const validateBody = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({
        status: 'error',
        errors: result.error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message
            }))
      })
      return
    }
    req.validatedBody = result.data
    next()
  }
}

export const validateQuery = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      res.status(400).json({
        status: 'error',
        errors: result.error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message
            }))
      })
      return
    }
    req.validatedQuery = result.data
    next()
  }
}

export const validateParams = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params)
    if (!result.success) {
      res.status(400).json({
        status: 'error',
        errors: result.error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message
            }))
      })
      return
    }
    req.validatedParams = result.data  
    next()
  }
}