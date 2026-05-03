import app from './app'
import * as dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT ?? 5000

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`)
})