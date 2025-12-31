import { v1 as uuid } from 'uuid'
import patientsData from '../../data/patients'
import { PublicPatient, Patient, NewPatient, EntryWithoutId } from '../types'

const getPatients = (): PublicPatient[] => {
  return patientsData.map(({ ...publicPatient }) => publicPatient)
}

const getPatient = (id: string): Patient | undefined => {
  return patientsData.find((patient) => patient.id === id)
}

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry,
    entries: [],
  }
  patientsData.push(newPatient)
  return newPatient
}

const addEntry = (
  patientId: string,
  entry: EntryWithoutId
): Patient | undefined => {
  const patient = patientsData.find((p) => p.id === patientId)
  if (!patient) {
    return undefined
  }

  const newEntry = {
    id: uuid(),
    ...entry,
  }

  patient.entries.push(newEntry)
  return patient
}

export default {
  getPatients,
  getPatient,
  addPatient,
  addEntry,
}
