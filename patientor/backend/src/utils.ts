import { EntryWithoutId, Gender } from './types'
import { z } from 'zod'

export const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  ssn: z.string(),
  gender: z.enum([Gender.Male, Gender.Female, Gender.Other]),
  occupation: z.string(),
})

const baseEntrySchema = z.object({
  description: z.string(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
})

export const dischargeSchema = z.object({
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid discharge date',
  }),
  criteria: z.string(),
})

export const sickLeaveSchema = z.object({
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid sickLeave startDate',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid sickLeave endDate',
  }),
})

const hospitalEntrySchema = baseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: dischargeSchema,
})

const occupationalHealthcareEntrySchema = baseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: sickLeaveSchema.optional(),
})

const healthCheckEntrySchema = baseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.number().int().min(0).max(3),
})

export const entrySchema = z.discriminatedUnion('type', [
  hospitalEntrySchema,
  occupationalHealthcareEntrySchema,
  healthCheckEntrySchema,
])

export const toNewEntry = (object: unknown): EntryWithoutId => {
  const parsed = entrySchema.parse(object)
  return parsed
}
