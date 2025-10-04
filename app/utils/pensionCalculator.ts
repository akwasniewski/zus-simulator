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
  hasRetirementAccount: boolean;
  currentRetirementBalance: string;
  retirementAge: string;
  zipCode: string;
}

export interface PensionResult {
  monthlyPension: number;
  monthlyPensionAdjusted: number,
  FootOfReturn: number,
  totalSavings: number;
  yearsToRetirement: number;
}

export interface PensionYearRecord {
  year: number;
  savings: number;
}

export interface PensionFullResult {
  monthlyPension: number;
  totalSavings: number;
  yearlySavings: PensionYearRecord[];
}

export const calculatePension = (formData: FormData): PensionResult => {
  const currentAge = parseInt(formData.currentAge);
  const monthlySalary = parseFloat(formData.currentSalary);
  let annualSalary = monthlySalary * 12;
  const retirementAge = parseInt(formData.retirementAge);
  const workStartYear = parseInt(formData.workStartYear);

  const yearsToRetirement = retirementAge - currentAge;

  // Simulate valorization
  let estimatedSalary = 0;
    if (formData.considerSickLeave){
    annualSalary = annualSalary * 11/12;
  }
  if (formData.hasRetirementAccount){
    for (let year = new Date().getFullYear(); year < new Date().getFullYear() + yearsToRetirement; year++) {
      const row = params.find((r) =>  r.rok === year);
      estimatedSalary = parseInt(formData.currentRetirementBalance);
      if (row) {
        let valorization = parseFloat(row.waloryzacja.replace("%", "")) / 100;
        estimatedSalary = (estimatedSalary + annualSalary * 0.1952) * valorization;
      }
    }
  }
  else
  {
    for (let year = workStartYear; year < new Date().getFullYear() + yearsToRetirement; year++) {
      const row = params.find((r) =>  r.rok === year);
      if (row) {
        let valorization = parseFloat(row.waloryzacja.replace("%", "")) / 100;
        estimatedSalary = (estimatedSalary + annualSalary * 0.1952) * valorization;
      }
    }
  }
  const lifeRow = lifeTable.find(
    (r) => r.Age === retirementAge && r.Month === 6 
  );

  const divisor = lifeRow ? lifeRow.Value : 200; // fallback if not found
  const monthlyPension = estimatedSalary / divisor;
  const monthlyPensionAdjusted = monthlyPension / Math.pow(1 + 0.03, yearsToRetirement);
  const FuturePensionPrediction = monthlySalary *
  parseFloat(
    params.find((r) => r.rok === new Date().getFullYear() + yearsToRetirement)?.["przeciętne miesięczne wynagrodzenie w gospodarce narodowej**)"]?.toString() ?? "0"
  )/parseFloat(
    params.find((r) => r.rok === new Date().getFullYear())?.["przeciętne miesięczne wynagrodzenie w gospodarce narodowej**)"]?.toString() ?? "0"
  );
  const FootOfReturn = monthlyPension/FuturePensionPrediction;
  return {
    monthlyPension,
    monthlyPensionAdjusted,
    FootOfReturn,
    totalSavings: estimatedSalary,
    yearsToRetirement,
  };
};



export const calculateFullPension = (
  formData: FormData,
  salaryHistory: { year: number; salary: number }[]
): PensionFullResult => {
  const currentAge = parseInt(formData.currentAge);
  const retirementAge = parseInt(formData.retirementAge);
  const yearsToRetirement = retirementAge - currentAge;

  let estimatedSavings = formData.hasRetirementAccount
    ? parseInt(formData.currentRetirementBalance || "0")
    : 0;

  const sickLeaveFactor = formData.considerSickLeave ? 11 / 12 : 1;

  let PensionHistory: PensionYearRecord[] = [];

  // Determine start and end years
  const startYear = Math.min(...salaryHistory.map(s => s.year), new Date().getFullYear());
  const endYear = new Date().getFullYear() + yearsToRetirement;

  for (let year = startYear; year <= endYear; year++) {
    const salaryEntry = salaryHistory.find(s => s.year === year);
    const row = params.find((r) => r.rok === year);

    if (!row) continue;

    const valorization = parseFloat(row.waloryzacja.replace("%", "")) / 100;

    if (salaryEntry) {
      const contribution = salaryEntry.salary * sickLeaveFactor * 0.1952;
      estimatedSavings = (estimatedSavings + contribution) * valorization;
    } else {
      // No salary this year, just valorize
      estimatedSavings = estimatedSavings * valorization;
    }

    PensionHistory.push({
      year,
      savings: estimatedSavings,
    });
  }

  const lifeRow = lifeTable.find(
    (r) => r.Age === retirementAge && r.Month === 6
  );
  const divisor = lifeRow ? lifeRow.Value : 200;

  const monthlyPension = estimatedSavings / divisor;

  return {
    monthlyPension,
    totalSavings: estimatedSavings,
    yearlySavings: PensionHistory,
  };
};
