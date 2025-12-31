import { isNotNumber } from "./utils";

export function calculateBmi(heightCm: number, weightKg: number): string {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  if (bmi < 16) return "Underweight (Severe thinness)";
  if (bmi < 17) return "Underweight (Moderate thinness)";
  if (bmi < 18.5) return "Underweight (Mild thinness)";
  if (bmi < 25) return "Normal range";
  if (bmi < 30) return "Overweight (Pre-obese)";
  if (bmi < 35) return "Obese (Class I)";
  if (bmi < 40) return "Obese (Class II)";
  return "Obese (Class III)";
}

// CLI support
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    throw new Error("Please provide height (cm) and weight (kg)");
  }

  const height = Number(args[0]);
  const weight = Number(args[1]);

  if (
    isNotNumber(height) ||
    isNotNumber(weight) ||
    height <= 0 ||
    weight <= 0
  ) {
    throw new Error("Malformatted parameters");
  }

  console.log(calculateBmi(height, weight));
}