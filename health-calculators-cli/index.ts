import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
import { isNotNumber } from './utils';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;
  
  if (!height || !weight) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const heightCm = Number(height);
  const weightKg = Number(weight);

  if (
    isNotNumber(heightCm) ||
    isNotNumber(weightKg) ||
    heightCm <= 0 ||
    weightKg <= 0
  ) {
    return res.status(400).json({ error: "malformatted parameters" });
  }


  const bmi = calculateBmi(heightCm, weightKg);

  return res.json({
    weight: weightKg,
    height: heightCm,
    bmi: bmi
  });
});


app.post("/exercises", (req, res) => {
  const body = req.body as unknown;

  if (
    typeof body !== "object" ||
    body === null ||
    !("daily_exercises" in body) ||
    !("target" in body)
  ) {
    return res.status(400).json({ error: "parameters missing" });
  }

  const { daily_exercises, target } = body as {
    daily_exercises: unknown;
    target: unknown;
  };

  if (!Array.isArray(daily_exercises)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const dailyHours = daily_exercises.map(Number);
  const targetNumber = Number(target);

  if (
    isNotNumber(targetNumber) ||
    targetNumber <= 0 ||
    dailyHours.length === 0 ||
    dailyHours.some(h => isNotNumber(h) || h < 0)
  ) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  return res.json(calculateExercises(dailyHours, targetNumber));
});
