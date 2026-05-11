import express, { NextFunction, Response, Request } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'
import { AppError } from './utils/AppError'
import { clerkClient, clerkMiddleware, getAuth, requireAuth } from '@clerk/express'
import transactionRouter from './routes/transaction.routes'
import webhookRouter from './routes/webhooks.routes'

dotenv.config()

const app = express()

// Clerk trust
app.set('trust proxy', 1)

// Security
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

app.use('/webhooks', webhookRouter)

// Clerk
app.use(clerkMiddleware())

app.get('/protected', async (req, res) => {
  // Use `getAuth()` to get the user's `userId`
  const { userId } = getAuth(req)

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Use Clerk's JavaScript Backend SDK to get the user's User object
  const user = await clerkClient.users.getUser(userId)

  return res.json({ user })
})

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

// Routes 
app.use('/api/v1/transactions', transactionRouter)

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