import express, { NextFunction, Response, Request } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'
import { AppError } from './utils/AppError'
import { clerkMiddleware } from '@clerk/express'

dotenv.config()

const app = express()

// Security
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

// Clerk
app.use(clerkMiddleware())

// Body parsing
app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())

// Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: 'error', message: 'Too many requests.' },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(globalLimiter)

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

// Routes go here
// app.use('/api/v1/...', router)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ status: 'error', message: `Route ${req.url} not found` })
})

// Global error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(err) // remove this later
  const statusCode = err instanceof AppError ? err.statusCode : 500
  const message = err instanceof AppError ? err.message : 'Something went wrong'
  res.status(statusCode).json({ status: 'error', message })
})

export default app 