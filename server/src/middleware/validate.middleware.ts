import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ParsedQs } from 'qs'
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
    req.body = result.data
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
    req.query = result.data as ParsedQs
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
    req.params = result.data as ParamsDictionary
    next()
  }
}