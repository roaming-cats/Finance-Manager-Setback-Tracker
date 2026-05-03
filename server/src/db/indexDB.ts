import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'
import * as schema from './schema/indexSchema'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection failed:', err.message)
    process.exit(1)
  }
  console.log('PostgreSQL connected.')
  release()
})

export const db = drizzle(pool, { schema })