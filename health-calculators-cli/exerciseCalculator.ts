import { isNotNumber } from "./utils";

export interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export function calculateExercises(
  dailyHours: number[],
  target: number
): ExerciseResult {
  if (dailyHours.length === 0) {
    throw new Error("Daily exercises cannot be empty");
  }

  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter(h => h > 0).length;
  const totalHours = dailyHours.reduce((a, b) => a + b, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = "Great job! Target achieved.";
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = "Not too bad but could be better";
  } else {
    rating = 1;
    ratingDescription = "Bad";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
}

// CLI support
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    throw new Error("Provide target and daily exercise hours");
  }

  const target = Number(args[0]);
  const dailyHours = args.slice(1).map(Number);

  if (
    isNotNumber(target) ||
    target <= 0 ||
    dailyHours.some(h => isNotNumber(h) || h < 0)
  ) {
    throw new Error("Malformatted parameters");
  }

  console.log(calculateExercises(dailyHours, target));
}
