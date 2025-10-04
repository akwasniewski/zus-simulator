'use client';

import { useState } from 'react';
import { FormData, PensionResult, calculatePension } from '../utils/pensionCalculator';

export default function PensionCalculatorForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    gender: '',
    currentAge: '',
    currentSalary: '',
    workStartYear: '',
    considerSickLeave: false,
    hasChildren: false,
    numberOfChildren: '',
    hasRetirementAccount: false,
    currentRetirementBalance: '',
    retirementAge: '',
    zipCode: '',
  });

  const [result, setResult] = useState<PensionResult | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const totalSteps = 8;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: inputValue
      };
      
      // Auto-set retirement age when gender is selected
      if (name === 'gender' && !prev.retirementAge) {
        updated.retirementAge = value === 'female' ? '60' : '65';
      }
      
      // Clear retirement balance if hasRetirementAccount is unchecked
      if (name === 'hasRetirementAccount' && !checked) {
        updated.currentRetirementBalance = '';
      }
      
      // Clear number of children if hasChildren is unchecked
      if (name === 'hasChildren' && !checked) {
        updated.numberOfChildren = '';
      }
      
      return updated;
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};
    
    switch (step) {
      case 1:
        if (!formData.gender) {
          newErrors.gender = 'Please select your gender';
        }
        break;
      case 2:
        if (!formData.currentAge || parseInt(formData.currentAge) < 18 || parseInt(formData.currentAge) > 80) {
          newErrors.currentAge = 'Please enter a valid age between 18 and 80';
        }
        break;
      case 3:
        if (!formData.currentSalary || parseFloat(formData.currentSalary) < 0) {
          newErrors.currentSalary = 'Please enter a valid salary amount';
        }
        break;
      case 4:
        const currentYear = new Date().getFullYear();
        const workStartYear = parseInt(formData.workStartYear);
        if (!formData.workStartYear || workStartYear < 1950 || workStartYear > currentYear) {
          newErrors.workStartYear = `Please enter a valid year between 1950 and ${currentYear}`;
        }
        if (formData.currentAge && workStartYear) {
          const currentAge = parseInt(formData.currentAge);
          const expectedStartAge = currentAge - (currentYear - workStartYear);
          if (expectedStartAge < 14 || expectedStartAge > 70) {
            newErrors.workStartYear = 'Work start year seems inconsistent with your current age';
          }
        }
        break;
      case 5:
        if (formData.hasChildren && (!formData.numberOfChildren || parseInt(formData.numberOfChildren) < 0 || parseInt(formData.numberOfChildren) > 10)) {
          newErrors.numberOfChildren = 'Please enter a valid number of children (0-10)';
        }
        break;
      case 6:
        if (formData.hasRetirementAccount && (!formData.currentRetirementBalance || parseFloat(formData.currentRetirementBalance) < 0)) {
          newErrors.currentRetirementBalance = 'Please enter a valid retirement account balance';
        }
        break;
      case 7:
        if (!formData.retirementAge || parseInt(formData.retirementAge) < 55 || parseInt(formData.retirementAge) > 100) {
          newErrors.retirementAge = 'Please enter a valid retirement age between 55 and 100';
        }
        if (parseInt(formData.currentAge) >= parseInt(formData.retirementAge)) {
          newErrors.retirementAge = 'Retirement age must be greater than current age';
        }
        break;
      case 8:
        if (formData.zipCode) {
          const zipCodePattern = /^\d{2}-\d{3}$/;
          if (!zipCodePattern.test(formData.zipCode)) {
            newErrors.zipCode = 'Please enter a valid zip code in format 00-000';
          }
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    const currentYear = new Date().getFullYear();
    
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    
    if (!formData.currentAge || parseInt(formData.currentAge) < 18 || parseInt(formData.currentAge) > 80) {
      newErrors.currentAge = 'Please enter a valid age between 18 and 80';
    }
    
    if (!formData.currentSalary || parseFloat(formData.currentSalary) < 0) {
      newErrors.currentSalary = 'Please enter a valid salary amount';
    }
    
    const workStartYear = parseInt(formData.workStartYear);
    if (!formData.workStartYear || workStartYear < 1950 || workStartYear > currentYear) {
      newErrors.workStartYear = `Please enter a valid year between 1950 and ${currentYear}`;
    }
    
    if (formData.hasChildren && (!formData.numberOfChildren || parseInt(formData.numberOfChildren) < 0 || parseInt(formData.numberOfChildren) > 10)) {
      newErrors.numberOfChildren = 'Please enter a valid number of children (0-10)';
    }
    
    if (formData.hasRetirementAccount && (!formData.currentRetirementBalance || parseFloat(formData.currentRetirementBalance) < 0)) {
      newErrors.currentRetirementBalance = 'Please enter a valid retirement account balance';
    }
    
    if (!formData.retirementAge || parseInt(formData.retirementAge) < 55 || parseInt(formData.retirementAge) > 100) {
      newErrors.retirementAge = 'Please enter a valid retirement age between 55 and 100';
    }
    
    if (parseInt(formData.currentAge) >= parseInt(formData.retirementAge)) {
      newErrors.retirementAge = 'Retirement age must be greater than current age';
    }
    
    if (formData.zipCode) {
      const zipCodePattern = /^\d{2}-\d{3}$/;
      if (!zipCodePattern.test(formData.zipCode)) {
        newErrors.zipCode = 'Please enter a valid zip code in format 00-000';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < totalSteps) {
      handleNext();
    } else {
      if (validateForm()) {
        const calculatedResult = calculatePension(formData);
        setResult(calculatedResult);
      }
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(amount);
  };

  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1: return 'What is your gender?';
      case 2: return 'What is your current age?';
      case 3: return 'What is your current monthly salary?';
      case 4: return 'When did you start working?';
      case 5: return 'Do you want to consider leave periods?';
      case 6: return 'Do you have an existing retirement account?';
      case 7: return 'When do you plan to retire?';
      case 8: return 'What is your zip code?';
      default: return '';
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <label className="block text-sm font-medium text-[#000000] mb-4">
              Gender
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#3F84D2] bg-gray-100 border-gray-300 focus:ring-[#3F84D2] focus:ring-2"
                />
                <label htmlFor="female" className="ml-2 text-sm font-medium text-[#000000]">
                  Female
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#3F84D2] bg-gray-100 border-gray-300 focus:ring-[#3F84D2] focus:ring-2"
                />
                <label htmlFor="male" className="ml-2 text-sm font-medium text-[#000000]">
                  Male
                </label>
              </div>
            </div>
            {errors.gender && (
              <p className="mt-2 text-sm text-[#F05E5E]">{errors.gender}</p>
            )}
          </div>
        );
      case 2:
        return (
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
              autoFocus
            />
            {errors.currentAge && (
              <p className="mt-1 text-sm text-[#F05E5E]">{errors.currentAge}</p>
            )}
          </div>
        );
      case 3:
        return (
          <div>
            <label htmlFor="currentSalary" className="block text-sm font-medium text-[#000000] mb-2">
              Current Monthly Salary (PLN)
            </label>
            <input
              type="number"
              id="currentSalary"
              name="currentSalary"
              value={formData.currentSalary}
              onChange={handleInputChange}
              min="0"
              step="1"
              className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-[#3F84D2] focus:border-[#3F84D2] transition-colors text-[#000000] ${
                errors.currentSalary ? 'border-[#F05E5E]' : 'border-[#BEC3CE]'
              }`}
              placeholder="Enter your monthly salary"
              autoFocus
            />
            {errors.currentSalary && (
              <p className="mt-1 text-sm text-[#F05E5E]">{errors.currentSalary}</p>
            )}
          </div>
        );
      case 4:
        return (
          <div>
            <label htmlFor="workStartYear" className="block text-sm font-medium text-[#000000] mb-2">
              Year You Started Working
            </label>
            <input
              type="number"
              id="workStartYear"
              name="workStartYear"
              value={formData.workStartYear}
              onChange={handleInputChange}
              min="1950"
              max={new Date().getFullYear()}
              className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-[#3F84D2] focus:border-[#3F84D2] transition-colors text-[#000000] ${
                errors.workStartYear ? 'border-[#F05E5E]' : 'border-[#BEC3CE]'
              }`}
              placeholder="Enter the year you started working"
              autoFocus
            />
            {errors.workStartYear && (
              <p className="mt-1 text-sm text-[#F05E5E]">{errors.workStartYear}</p>
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <p className="text-sm text-[#00416E] mb-4">
              We can factor in leave periods to give you a more accurate pension calculation:
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="considerSickLeave"
                  name="considerSickLeave"
                  checked={formData.considerSickLeave}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#3F84D2] bg-gray-100 border-gray-300 rounded focus:ring-[#3F84D2] focus:ring-2"
                />
                <label htmlFor="considerSickLeave" className="ml-2 text-sm font-medium text-[#000000]">
                  Consider average sick leave periods
                </label>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasChildren"
                    name="hasChildren"
                    checked={formData.hasChildren}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#3F84D2] bg-gray-100 border-gray-300 rounded focus:ring-[#3F84D2] focus:ring-2"
                  />
                  <label htmlFor="hasChildren" className="ml-2 text-sm font-medium text-[#000000]">
                    I plan to have children
                  </label>
                </div>
                
                {formData.hasChildren && (
                  <div>
                    <label htmlFor="numberOfChildren" className="block text-sm font-medium text-[#000000] mb-2">
                      How many children do you plan to have?
                    </label>
                    <input
                      type="number"
                      id="numberOfChildren"
                      name="numberOfChildren"
                      value={formData.numberOfChildren}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-[#3F84D2] focus:border-[#3F84D2] transition-colors text-[#000000] ${
                        errors.numberOfChildren ? 'border-[#F05E5E]' : 'border-[#BEC3CE]'
                      }`}
                      placeholder="Enter number of children"
                      autoFocus
                    />
                    {errors.numberOfChildren && (
                      <p className="mt-1 text-sm text-[#F05E5E]">{errors.numberOfChildren}</p>
                    )}
                    <p className="text-xs text-[#BEC3CE] mt-1">
                      This helps calculate parental leave impact on your pension contributions
                    </p>
                  </div>
                )}
                
                {!formData.hasChildren && (
                  <p className="text-sm text-[#BEC3CE]">
                    No problem! We'll calculate your pension without considering parental leave.
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-[#BEC3CE] mt-3">
              These options will adjust your contribution periods and pension calculations accordingly.
            </p>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="hasRetirementAccount"
                name="hasRetirementAccount"
                checked={formData.hasRetirementAccount}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#3F84D2] bg-gray-100 border-gray-300 rounded focus:ring-[#3F84D2] focus:ring-2"
              />
              <label htmlFor="hasRetirementAccount" className="ml-2 text-sm font-medium text-[#000000]">
                I have an existing retirement account
              </label>
            </div>
            
            {formData.hasRetirementAccount && (
              <div>
                <label htmlFor="currentRetirementBalance" className="block text-sm font-medium text-[#000000] mb-2">
                  Current Retirement Account Balance (PLN)
                </label>
                <input
                  type="number"
                  id="currentRetirementBalance"
                  name="currentRetirementBalance"
                  value={formData.currentRetirementBalance}
                  onChange={handleInputChange}
                  min="0"
                  step="1000"
                  className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-[#3F84D2] focus:border-[#3F84D2] transition-colors text-[#000000] ${
                    errors.currentRetirementBalance ? 'border-[#F05E5E]' : 'border-[#BEC3CE]'
                  }`}
                  placeholder="Enter your current retirement account balance"
                  autoFocus
                />
                {errors.currentRetirementBalance && (
                  <p className="mt-1 text-sm text-[#F05E5E]">{errors.currentRetirementBalance}</p>
                )}
              </div>
            )}
            
            {!formData.hasRetirementAccount && (
              <p className="text-sm text-[#BEC3CE]">
                No worries! We'll calculate your pension based on future contributions only.
              </p>
            )}
          </div>
        );
      case 7:
        return (
          <div>
            <label htmlFor="retirementAge" className="block text-sm font-medium text-[#000000] mb-2">
              Planned Retirement Age
              {formData.gender && (
                <span className="text-sm text-[#3F84D2] ml-2">
                  (Default: {formData.gender === 'female' ? '60' : '65'} years)
                </span>
              )}
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
              placeholder={`Enter your planned retirement age (default: ${formData.gender === 'female' ? '60' : '65'})`}
              autoFocus
            />
            {errors.retirementAge && (
              <p className="mt-1 text-sm text-[#F05E5E]">{errors.retirementAge}</p>
            )}
          </div>
        );
      case 8:
        return (
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-[#000000] mb-2">
              Zip Code (optional)
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              maxLength={6}
              pattern="[0-9]{2}-[0-9]{3}"
              className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-[#3F84D2] focus:border-[#3F84D2] transition-colors text-[#000000] ${
                errors.zipCode ? 'border-[#F05E5E]' : 'border-[#BEC3CE]'
              }`}
              placeholder="00-000 (optional)"
              autoFocus
            />
            {errors.zipCode && (
              <p className="mt-1 text-sm text-[#F05E5E]">{errors.zipCode}</p>
            )}
            <p className="text-xs text-[#BEC3CE] mt-2">
              This information is collected for telemetrics purposes only and will not affect your pension calculation. You can leave this field empty if you prefer.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!result ? (
        <div className="space-y-6 bg-white p-8 rounded-lg shadow-lg border border-[#BEC3CE]">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-[#00416E]">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-[#BEC3CE]">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-[#BEC3CE] bg-opacity-30 rounded-full h-2">
              <div 
                className="bg-[#3F84D2] h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-[#00416E] text-center mb-6">
              {getStepTitle(currentStep)}
            </h2>
            
            {/* Current Step Content */}
            {renderCurrentStep()}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex-1 bg-[#BEC3CE] text-[#00416E] py-3 px-6 rounded-md font-medium hover:bg-[#BEC3CE] hover:bg-opacity-80 focus:ring-2 focus:ring-[#BEC3CE] focus:ring-offset-2 transition-colors"
                >
                  Previous
                </button>
              )}
              <button
                type="submit"
                className="flex-1 bg-[#3F84D2] text-white py-3 px-6 rounded-md font-medium hover:bg-[#00416E] focus:ring-2 focus:ring-[#3F84D2] focus:ring-offset-2 transition-colors"
              >
                {currentStep < totalSteps ? 'Next' : 'Calculate My Pension'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Results Display */
        <div className="space-y-6">
          <div className="bg-[#BEC3CE] bg-opacity-30 p-6 rounded-lg border border-[#00993F]">
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
          
          {/* Reset Button */}
          <button
            onClick={() => {
              setResult(null);
              setCurrentStep(1);
              setFormData({ 
              gender: '', 
              currentAge: '', 
              currentSalary: '', 
              workStartYear: '', 
              considerSickLeave: false,
              hasChildren: false,
              numberOfChildren: '',
              hasRetirementAccount: false,
              currentRetirementBalance: '',
              retirementAge: '',
              zipCode: ''
            });
              setErrors({});
            }}
            className="w-full bg-[#3F84D2] text-white py-3 px-6 rounded-md font-medium hover:bg-[#00416E] focus:ring-2 focus:ring-[#3F84D2] focus:ring-offset-2 transition-colors"
          >
            Calculate Again
          </button>
        </div>
      )}
    </div>
  );
}