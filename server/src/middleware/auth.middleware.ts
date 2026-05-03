import { getAuth } from '@clerk/express'
import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'

// Verifies the user is logged in
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = getAuth(req)
  if (!userId) {
    return next(new AppError('Unauthorized', 401))
  }
  next()
}

// Verifies the user has a specific role
export const hasRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { sessionClaims } = getAuth(req)
    const userRole = sessionClaims?.role as string
    if (!roles.includes(userRole)) {
      return next(new AppError('Forbidden', 403))
    }
    next()
  }
}