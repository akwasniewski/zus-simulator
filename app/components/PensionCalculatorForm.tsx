'use client';

import { useState } from 'react';

interface FormData {
  currentAge: string;
  currentSalary: string;
  retirementAge: string;
}

interface PensionResult {
  monthlyPension: number;
  totalSavings: number;
  yearsToRetirement: number;
}

export default function PensionCalculatorForm() {
  const [formData, setFormData] = useState<FormData>({
    currentAge: '',
    currentSalary: '',
    retirementAge: '',
  });

  const [result, setResult] = useState<PensionResult | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.currentAge || parseInt(formData.currentAge) < 18 || parseInt(formData.currentAge) > 80) {
      newErrors.currentAge = 'Please enter a valid age between 18 and 80';
    }
    
    if (!formData.currentSalary || parseFloat(formData.currentSalary) < 0) {
      newErrors.currentSalary = 'Please enter a valid salary amount';
    }
    
    if (!formData.retirementAge || parseInt(formData.retirementAge) < 55 || parseInt(formData.retirementAge) > 100) {
      newErrors.retirementAge = 'Please enter a valid retirement age between 55 and 100';
    }
    
    if (parseInt(formData.currentAge) >= parseInt(formData.retirementAge)) {
      newErrors.retirementAge = 'Retirement age must be greater than current age';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePension = (): PensionResult => {
    const currentAge = parseInt(formData.currentAge);
    const currentSalary = parseFloat(formData.currentSalary);
    const retirementAge = parseInt(formData.retirementAge);
    
    const yearsToRetirement = retirementAge - currentAge;
    
    // Simple pension calculation (this can be made more sophisticated)
    // Assumes 10% annual contribution with 5% annual growth
    const annualContribution = currentSalary * 0.10;
    const annualGrowthRate = 0.05;
    
    // Future value of annuity formula
    const totalSavings = annualContribution * 
      (((1 + annualGrowthRate) ** yearsToRetirement - 1) / annualGrowthRate);
    
    // Assuming 4% withdrawal rate in retirement
    const monthlyPension = (totalSavings * 0.04) / 12;
    
    return {
      monthlyPension,
      totalSavings,
      yearsToRetirement
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const calculatedResult = calculatePension();
      setResult(calculatedResult);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg border border-[#BEC3CE]">
        <h2 className="text-2xl font-bold text-[#00416E] text-center mb-6">
          Calculate Your Pension
        </h2>
        
        {/* Current Age */}
        <div>
          <label htmlFor="currentAge" className="block text-sm font-medium text-[#000000] mb-2">
            Current Age
          </label>
          <input
            type="number"
            id="currentAge"
            name="currentAge"
            value={formData.currentAge}
            onChange={handleInputChange}
            min="18"
            max="80"
            className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-[#3F84D2] focus:border-[#3F84D2] transition-colors text-[#000000] ${
              errors.currentAge ? 'border-[#F05E5E]' : 'border-[#BEC3CE]'
            }`}
            placeholder="Enter your current age"
          />
          {errors.currentAge && (
            <p className="mt-1 text-sm text-[#F05E5E]">{errors.currentAge}</p>
          )}
        </div>

        {/* Current Salary */}
        <div>
          <label htmlFor="currentSalary" className="block text-sm font-medium text-[#000000] mb-2">
            Current Annual Salary ($)
          </label>
          <input
            type="number"
            id="currentSalary"
            name="currentSalary"
            value={formData.currentSalary}
            onChange={handleInputChange}
            min="0"
            step="1000"
            className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-[#3F84D2] focus:border-[#3F84D2] transition-colors text-[#000000] ${
              errors.currentSalary ? 'border-[#F05E5E]' : 'border-[#BEC3CE]'
            }`}
            placeholder="Enter your annual salary"
          />
          {errors.currentSalary && (
            <p className="mt-1 text-sm text-[#F05E5E]">{errors.currentSalary}</p>
          )}
        </div>

        {/* Planned Retirement Age */}
        <div>
          <label htmlFor="retirementAge" className="block text-sm font-medium text-[#000000] mb-2">
            Planned Retirement Age
          </label>
          <input
            type="number"
            id="retirementAge"
            name="retirementAge"
            value={formData.retirementAge}
            onChange={handleInputChange}
            min="55"
            max="100"
            className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-[#3F84D2] focus:border-[#3F84D2] transition-colors text-[#000000] ${
              errors.retirementAge ? 'border-[#F05E5E]' : 'border-[#BEC3CE]'
            }`}
            placeholder="Enter your planned retirement age"
          />
          {errors.retirementAge && (
            <p className="mt-1 text-sm text-[#F05E5E]">{errors.retirementAge}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#3F84D2] text-white py-3 px-6 rounded-md font-medium hover:bg-[#00416E] focus:ring-2 focus:ring-[#3F84D2] focus:ring-offset-2 transition-colors"
        >
          Calculate My Pension
        </button>
      </form>

      {/* Results Display */}
      {result && (
        <div className="mt-8 bg-[#BEC3CE] bg-opacity-30 p-6 rounded-lg border border-[#00993F]">
          <h3 className="text-xl font-bold text-[#00416E] mb-4">Your Pension Projection</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#00416E] font-medium">Years to retirement:</span>
              <span className="text-[#000000] font-bold">{result.yearsToRetirement} years</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#00416E] font-medium">Total retirement savings:</span>
              <span className="text-[#000000] font-bold">{formatCurrency(result.totalSavings)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-[#00993F] pt-3">
              <span className="text-[#00416E] font-medium">Estimated monthly pension:</span>
              <span className="text-[#FFB34F] font-bold text-xl">{formatCurrency(result.monthlyPension)}</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-[#00416E]">
            * This is a simplified calculation based on 10% annual contribution and 5% growth rate. 
            Actual results may vary based on market conditions and your specific retirement plan.
          </p>
        </div>
      )}
    </div>
  );
}