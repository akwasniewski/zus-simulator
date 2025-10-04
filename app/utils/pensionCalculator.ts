import params from "./data/params.json";
import lifeTable from "./data/life_expectancy_table.json";

export interface FormData {
  gender: string;
  currentAge: string;
  currentSalary: string;
  workStartYear: string;
  considerSickLeave: boolean;
  hasChildren: boolean;
  numberOfChildren: string;
  currentRetirementBalance: string;
  retirementAge: string;
  zipCode: string;
}

export interface PensionResult {
  monthlyPension: number;
  totalSavings: number;
  yearsToRetirement: number;
}

export const calculatePension = (formData: FormData): PensionResult => {
  const currentAge = parseInt(formData.currentAge);
  const monthlySalary = parseFloat(formData.currentSalary);
  const annualSalary = monthlySalary * 12;
  const retirementAge = parseInt(formData.retirementAge);
  const workStartYear = parseInt(formData.workStartYear);

  const yearsToRetirement = retirementAge - currentAge;

  // Simulate valorization
  let estimatedSalary = 0;
  for (let year = workStartYear; year < new Date().getFullYear() + yearsToRetirement; year++) {
    const row = params.find((r) =>  r.rok === year);
    if (row) {
      let valorization = parseFloat(row.waloryzacja.replace("%", "")) / 100;
      estimatedSalary = (estimatedSalary + annualSalary * 0.1952) * valorization;
    }
  }

  const lifeRow = lifeTable.find(
    (r) => r.Age === retirementAge && r.Month === 6 
  );

  const divisor = lifeRow ? lifeRow.Value : 200; // fallback if not found
  const monthlyPension = estimatedSalary / divisor;

  return {
    monthlyPension,
    totalSavings: estimatedSalary,
    yearsToRetirement,
  };
};
