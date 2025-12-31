import express, { Request, Response, NextFunction } from 'express'
import diagnosesRouter from './routes/diagnoses'
import patientsRouter from './routes/patients'

const app = express()
const PORT = 3001

app.use(express.json())

app.use((req: Request, res: Response, next: NextFunction): void => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )

  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
    return
  }

  next()
})

app.get('/api/ping', (_req: Request, res: Response): void => {
  res.send('pong')
})

app.use('/api/diagnoses', diagnosesRouter)
app.use('/api/patients', patientsRouter)

// Global error handler
app.use(
  (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    console.error('Error:', error)
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'An unknown error occurred' })
    }
  }
)

// 404 handler for unknown routes
app.use((_req: Request, res: Response): void => {
  res.status(404).json({ error: 'Unknown endpoint' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
