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
  totalSavings: number;
  yearsToRetirement: number;
}

export const calculatePension = (formData: FormData): PensionResult => {
  const currentAge = parseInt(formData.currentAge);
  const monthlySalary = parseFloat(formData.currentSalary);
  const currentSalary = monthlySalary * 12;
  const retirementAge = parseInt(formData.retirementAge);
  const workStartYear = parseInt(formData.workStartYear);
  const currentYear = new Date().getFullYear();
  
  const yearsToRetirement = retirementAge - currentAge;
  const totalWorkingYears = retirementAge - (currentAge - (currentYear - workStartYear));
  
  // Calculate effective contribution years considering leave periods
  let effectiveContributionYears = yearsToRetirement;
  
  // Reduce contribution years if leave periods are considered
  if (formData.considerSickLeave) {
    // Assume average 1 month sick leave per year
    effectiveContributionYears -= yearsToRetirement * (1/12);
  }
  
  if (formData.hasChildren && formData.numberOfChildren && parseInt(formData.numberOfChildren) > 0) {
    // Calculate parental leave based on number of children
    const children = parseInt(formData.numberOfChildren);
    // Assume 6 months per child for women, 3 months per child for men
    const monthsPerChild = formData.gender === 'female' ? 6 : 3;
    const totalParentalLeaveYears = (children * monthsPerChild) / 12;
    effectiveContributionYears -= Math.min(totalParentalLeaveYears, yearsToRetirement);
  }
  
  // Ensure we don't go below 0
  effectiveContributionYears = Math.max(0, effectiveContributionYears);
  
  // Calculate future savings from contributions
  const annualContribution = currentSalary * 0.10; // 10% contribution rate
  const annualGrowthRate = 0.05; // 5% annual growth
  
  // Future value of annuity formula for new contributions
  const futureContributions = effectiveContributionYears > 0 ? 
    annualContribution * (((1 + annualGrowthRate) ** effectiveContributionYears - 1) / annualGrowthRate) : 0;
  
  // Add existing retirement account balance with growth
  const existingBalance = formData.hasRetirementAccount ? 
    parseFloat(formData.currentRetirementBalance || '0') : 0;
  const futureExistingBalance = existingBalance * ((1 + annualGrowthRate) ** yearsToRetirement);
  
  const totalSavings = futureContributions + futureExistingBalance;
  
  // Calculate monthly pension using 4% withdrawal rate
  const monthlyPension = (totalSavings * 0.04) / 12;
  
  return {
    monthlyPension,
    totalSavings,
    yearsToRetirement
  };
};