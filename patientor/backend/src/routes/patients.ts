import express, { Request, Response, NextFunction } from 'express'
import { PublicPatient, NewPatient, Patient } from '../types'
import patientService from '../services/patientService'
import { newPatientSchema, toNewEntry } from '../utils'
import { z } from 'zod'

const router = express.Router()

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    newPatientSchema.parse(req.body)
    next()
  } catch (error: unknown) {
    next(error)
  }
}

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues })
  } else {
    next(error)
  }
}

router.get('/', (_req, res: Response<PublicPatient[]>): void => {
  res.send(patientService.getPatients())
})

router.get(
  '/:id',
  (
    req: Request<{ id: string }>,
    res: Response<Patient | { error: string }>
  ) => {
    const patient = patientService.getPatient(req.params.id)
    if (patient) {
      res.json(patient)
    } else {
      res.status(404).send({ error: 'Patient not found' })
    }
  }
)

router.post(
  '/',
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body)
    res.json(addedPatient)
  }
)

router.post(
  '/:id/entries',
  (
    req: Request<{ id: string }>,
    res: Response<Patient | { error: string }>
  ) => {
    try {
      const newEntry = toNewEntry(req.body)
      const addedEntry = patientService.addEntry(req.params.id, newEntry)

      if (!addedEntry) {
        return res.status(404).json({ error: 'Patient not found' })
      }

      return res.json(addedEntry)
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message })
      } else {
        return res.status(400).json({ error: 'Unknown error occurred' })
      }
    }
  }
)

router.use(errorMiddleware)

export default router
