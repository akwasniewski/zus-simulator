'use client';

import { useState, useEffect } from 'react';
import { FormData, PensionResult, calculatePension } from '../utils/pensionCalculator';
import { saveTelemetryData } from '../utils/telemetry';

export default function PensionCalculatorForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [expectedPension, setExpectedPension] = useState<number | null>(null);
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

  // Load expected pension from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('expectedPension');
    if (saved) {
      setExpectedPension(Number(saved));
    }
  }, []);

  const handleCalculatorRedirect = () => {
    const params = new URLSearchParams(formData as any).toString();
    window.location.href = `/kalkulator?${params}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: inputValue
      };

      // Auto-set retirement age when gender is selected
      if (name === 'gender') {
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
          newErrors.gender = 'Wybierz swoją płeć';
        }
        break;
      case 2:
        if (!formData.currentAge || parseInt(formData.currentAge) < 18 || parseInt(formData.currentAge) > 99) {
          newErrors.currentAge = 'Wpisz wiek pomiędzy 18 a 99 lat';
        }
        break;
      case 3:
        if (!formData.currentSalary || parseFloat(formData.currentSalary) < 0) {
          newErrors.currentSalary = 'Podaj poprawną wartość';
        }
        break;
      case 4:
        const currentYear = new Date().getFullYear();
        const workStartYear = parseInt(formData.workStartYear);
        if (!formData.workStartYear || workStartYear < 1950 || workStartYear > currentYear) {
          newErrors.workStartYear = `Wybierz rok pomiędzy 1950 a ${currentYear}`;
        }
        if (formData.currentAge && workStartYear) {
          const currentAge = parseInt(formData.currentAge);
          const expectedStartAge = currentAge - (currentYear - workStartYear);
          if (expectedStartAge < 14 || expectedStartAge > 70) {
            newErrors.workStartYear = 'Zbyt niski lub zbyt wysoki wiek rozpoczęcia pracy';
          }
        }
        break;
      case 5:
        if (formData.hasChildren && (!formData.numberOfChildren || parseInt(formData.numberOfChildren) < 0 || parseInt(formData.numberOfChildren) > 25)) {
          newErrors.numberOfChildren = 'Podaj liczbę z zakresu 0-25';
        }
        break;
      case 6:
        if (formData.hasRetirementAccount && (!formData.currentRetirementBalance || parseFloat(formData.currentRetirementBalance) < 0)) {
          newErrors.currentRetirementBalance = 'Podaj poprawną wartość';
        }
        break;
      case 7:
        if (!formData.retirementAge || parseInt(formData.retirementAge) < 55 || parseInt(formData.retirementAge) > 100) {
          newErrors.retirementAge = 'Podaj wiek z zakresu 55-100';
        }
        if (parseInt(formData.currentAge) >= parseInt(formData.retirementAge)) {
          newErrors.retirementAge = 'Wiek emerytalny musi być większy niż obecny';
        }
        break;
      case 8:
        if (formData.zipCode) {
          const zipCodePattern = /^\d{2}-\d{3}$/;
          if (!zipCodePattern.test(formData.zipCode)) {
            newErrors.zipCode = 'Podaj poprawny kod pocztowy w formaie 00-000';
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
      newErrors.gender = 'Wybierz swoją płeć';
    }

    if (!formData.currentAge || parseInt(formData.currentAge) < 18 || parseInt(formData.currentAge) > 99) {
      newErrors.currentAge = 'Wpisz wiek pomiędzy 18 a 99 lat';
    }

    if (!formData.currentSalary || parseFloat(formData.currentSalary) < 0) {
      newErrors.currentSalary = 'Podaj poprawną wartość';
    }

    const workStartYear = parseInt(formData.workStartYear);
    if (!formData.workStartYear || workStartYear < 1950 || workStartYear > currentYear) {
      newErrors.workStartYear = `Wybierz rok pomiędzy 1950 a ${currentYear}`;
    }

    if (formData.hasChildren && (!formData.numberOfChildren || parseInt(formData.numberOfChildren) < 0 || parseInt(formData.numberOfChildren) > 25)) {
      newErrors.numberOfChildren = 'Podaj liczbę z zakresu 0-25';
    }

    if (formData.hasRetirementAccount && (!formData.currentRetirementBalance || parseFloat(formData.currentRetirementBalance) < 0)) {
      newErrors.currentRetirementBalance = 'Podaj poprawną wartość';
    }

    if (!formData.retirementAge || parseInt(formData.retirementAge) < 55 || parseInt(formData.retirementAge) > 100) {
      newErrors.retirementAge = 'Podaj wiek z zakresu 55-100';
    }

    if (parseInt(formData.currentAge) >= parseInt(formData.retirementAge)) {
      newErrors.retirementAge = 'Wiek emerytalny musi być większy niż obecny';
    }

    if (formData.zipCode) {
      const zipCodePattern = /^\d{2}-\d{3}$/;
      if (!zipCodePattern.test(formData.zipCode)) {
        newErrors.zipCode = 'Podaj poprawny kod pocztowy w formaie 00-000';
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
        
        // Save telemetry data
        saveTelemetryData(formData, calculatedResult, expectedPension);
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
      case 1: return 'Jakiej jesteś płci?';
      case 2: return 'Ile masz lat?';
      case 3: return 'Jaka jest twoja obecna pensja (brutto)?';
      case 4: return 'Kiedy zacząłeś pracę (na UoP)?';
      case 5: return 'Uwzględniać okresy na zwolnieniach?';
      case 6: return 'Czy wiesz ile masz zgromadzone na koncie emerytalnym?';
      case 7: return 'Kiedy planujesz przejsć na emeryturę?';
      case 8: return 'Jaki masz kod pocztowy?';
      default: return '';
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  style={{ accentColor: "var(--green)" }}
                  checked={formData.gender === 'female'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[var(--green)] bg-gray-100 border-gray-300 focus:ring-[var(--green)] focus:ring-2"
                />
                <label htmlFor="female" className="ml-2 text-sm font-medium text-[#000000]">
                  Kobieta
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  style={{ accentColor: "var(--green)" }}
                  accent-color="red"
                  checked={formData.gender === 'male'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[var(--green)] bg-gray-100 border-gray-300 focus:ring-[var(--green)] focus:ring-2"
                />
                <label htmlFor="male" className="ml-2 text-sm font-medium text-[#000000]">
                  Mężczyzna
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
            <input
              type="number"
              id="currentAge"
              name="currentAge"
              value={formData.currentAge}
              onChange={handleInputChange}
              min="18"
              max="99"
              className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-[var(--green)] focus:border-[var(--green)] focus-visible:border-[var(--green)] transition-all duration-300 text-[#000000] focus:outline-none focus:ring-2 focus:ring-[var(--green)] ${
                errors.currentAge ? 'border-[#F05E5E]' : 'border-[var(--grey)]'
              }`}
              placeholder="Podaj swój wiek"
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
            <input
              type="number"
              id="currentSalary"
              name="currentSalary"
              value={formData.currentSalary}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-[var(--green)] focus:border-[var(--green)] focus-visible:border-[var(--green)] transition-all duration-300 text-[#000000] focus:outline-none focus:ring-2 focus:ring-[var(--green)] ${
                errors.currentSalary ? 'border-[#F05E5E]' : 'border-[var(--grey)]'
              }`}
              placeholder="Pensja"
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
            <input
              type="number"
              id="workStartYear"
              name="workStartYear"
              value={formData.workStartYear}
              onChange={handleInputChange}
              min="1950"
              max={new Date().getFullYear()}
              className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-[var(--green)] focus:border-[var(--green)] focus-visible:ring-[var(--green)] focus-visible:border-[var(--green)] transition-all duration-300 text-[#000000] focus:outline-none focus:ring-2 focus:ring-[var(--green)] ${
                errors.workStartYear ? 'border-[#F05E5E]' : 'border-[var(--grey)]'
              }`}
              placeholder="Rok rozpoczęcia pracy"
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
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="considerSickLeave"
                  name="considerSickLeave"
                  style={{ accentColor: "var(--green)" }}
                  checked={formData.considerSickLeave}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[var(--green)] bg-gray-100 border-gray-300 rounded focus:ring-[var(--green)] focus:ring-2"
                />
                <label htmlFor="considerSickLeave" className="ml-2 text-sm font-medium text-[#000000]">
                  Uwzględniaj przewidywane okresy na zwolnieniu chorobowym
                </label>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hasChildren"
                    name="hasChildren"
                    style={{ accentColor: "var(--green)" }}
                    checked={formData.hasChildren}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[var(--green)] bg-gray-100 border-gray-300 rounded focus:ring-[var(--green)] focus:ring-2"
                  />
                  <label htmlFor="hasChildren" className="ml-2 text-sm font-medium text-[#000000]">
                    Planuję mieć dzieci
                  </label>
                </div>

                {formData.hasChildren && (
                  <div>
                    <input
                      type="number"
                      id="numberOfChildren"
                      name="numberOfChildren"
                      value={formData.numberOfChildren}
                      onChange={handleInputChange}
                      min="1"
                      max="25"
                      className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-[var(--green)] focus:border-[var(--green)] focus-visible:ring-[var(--green)] focus-visible:border-[var(--green)] transition-all duration-300 text-[#000000] focus:outline-none focus:ring-2 focus:ring-[var(--green)] ${
                        errors.numberOfChildren ? 'border-[#F05E5E]' : 'border-[var(--grey)]'
                      }`}
                      placeholder="Podaj liczbę"
                      autoFocus
                    />
                    {errors.numberOfChildren && (
                      <p className="mt-1 text-sm text-[#F05E5E]">{errors.numberOfChildren}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-[var(--grey)] mt-3">
              Przeciętny Polak spędza na zwolnieniach chorobowych około 34 dni w roku.
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
                style={{ accentColor: "var(--green)" }}
                checked={formData.hasRetirementAccount}
                onChange={handleInputChange}
                className="w-4 h-4 text-[var(--green)] bg-gray-100 border-gray-300 rounded focus:ring-[var(--green)] focus:ring-2"
              />
              <label htmlFor="hasRetirementAccount" className="ml-2 text-sm font-medium text-[#000000]">
                Tak
              </label>
            </div>

            {formData.hasRetirementAccount && (
              <div>
                <input
                  type="number"
                  id="currentRetirementBalance"
                  name="currentRetirementBalance"
                  value={formData.currentRetirementBalance}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-[var(--green)] focus:border-[var(--green)] focus-visible:ring-[var(--green)] focus-visible:border-[var(--green)] transition-all duration-300 text-[#000000] focus:outline-none focus:ring-2 focus:ring-[var(--green)] ${
                    errors.currentRetirementBalance ? 'border-[#F05E5E]' : 'border-[var(--grey)]'
                  }`}
                  placeholder="Stan konta emerytalnego"
                  autoFocus
                />
                {errors.currentRetirementBalance && (
                  <p className="mt-1 text-sm text-[#F05E5E]">{errors.currentRetirementBalance}</p>
                )}
              </div>
            )}
            <p className="text-sm text-[var(--grey)]">
              Jeśli nie, spróbujemy to oszacować.
            </p>
          </div>
        );
      case 7:
        return (
          <div>
            <label htmlFor="retirementAge" className="block text-sm font-medium text-[#000000] mb-2">
              Planowany wiek emerytalny
              {formData.gender && (
                <span className="text-sm text-[var(--green)] ml-2">
                  (Domyślnie: {formData.gender === 'female' ? '60' : '65'} lat)
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
              className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-[var(--green)] focus:border-[var(--green)] focus-visible:ring-[var(--green)] focus-visible:border-[var(--green)] transition-all duration-300 text-[#000000] focus:outline-none focus:ring-2 focus:ring-[var(--green)] ${
                errors.retirementAge ? 'border-[#F05E5E]' : 'border-[var(--grey)]'
              }`}
              placeholder={`Wpisz planowany wiek emerytalny (domyślnie: ${formData.gender === 'female' ? '60' : '65'})`}
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
              Kod pocztowy (opcjonalnie)
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              maxLength={6}
              pattern="[0-9]{2}-[0-9]{3}"
              className={`w-full px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-[var(--green)] focus:border-[var(--green)] focus-visible:ring-[var(--green)] focus-visible:border-[var(--green)] transition-all duration-300 text-[#000000] focus:outline-none focus:ring-2 focus:ring-[var(--green)] ${
                errors.zipCode ? 'border-[#F05E5E]' : 'border-[var(--grey)]'
              }`}
              placeholder="00-000 (opcjonalne)"
              autoFocus
            />
            {errors.zipCode && (
              <p className="mt-1 text-sm text-[#F05E5E]">{errors.zipCode}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!result ? (
        <div className="space-y-6 bg-white p-8 rounded-lg shadow-lg border border-[var(--grey)]">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-[black]">
                Krok {currentStep} z {totalSteps}
              </span>
              {/* <span className="text-sm text-[var(--grey)]">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span> */}
            </div>
            <div className="w-full bg-[var(--grey)] bg-opacity-30 rounded-full h-2">
              <div 
                className="bg-[var(--green)] h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-4xl font-bold text-[black] text-center mb-6">
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
                  className="flex-1 bg-[var(--grey)] text-white py-3 px-6 rounded-md font-medium hover:opacity-80 focus:ring-2 focus:ring-[var(--grey)] focus:ring-offset-2 transition-all duration-300 cursor-pointer"
                >
                  Wstecz
                </button>
              )}
              <button
                type="submit"
                className="flex-1 bg-[var(--green)] text-white py-3 px-6 rounded-md font-medium hover:opacity-80 focus:ring-2 focus:ring-[#3F84D2] focus:ring-offset-2 transition-all duration-300 cursor-pointer"
              >
                {currentStep < totalSteps ? 'Dalej' : 'Oblicz moją emeryturę'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Results Display */
        <div className="space-y-6">
          <div className="bg-opacity-30 p-6 rounded-lg border border-[#00993F]">
            <h3 className="text-xl font-bold text-[black] mb-4">Przewidywana emerytura</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[black] font-medium">Lat do emerytury:</span>
                <span className="text-[#000000] font-bold">{result.yearsToRetirement} lat</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[black] font-medium">Całkowita odłożona kwota</span>
                <span className="text-[#000000] font-bold">{formatCurrency(result.totalSavings)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-[#00993F] pt-3">
                <span className="text-[black] font-medium">Przewidywana miesięczna emerytura:</span>
                <span className="text-[var(--green)] font-bold text-xl">{formatCurrency(result.monthlyPension)}</span>
              </div>
              {expectedPension && (
                <div className="flex justify-between items-center border-t border-gray-300 pt-3">
                  <span className="text-[black] font-medium">Oczekiwana emerytura (wprowadzona wcześniej):</span>
                  <span className="text-[#666666] font-bold text-lg">{formatCurrency(expectedPension)}</span>
                </div>
              )}
            </div>
            <p className="mt-4 text-sm text-[black]">
              To są wyłącznie przewidywania. Rzeczywista emerytura może być inna.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setResult(null);
                setCurrentStep(totalSteps);
              }}
              className="flex-1 bg-[var(--grey)] text-white py-3 px-6 rounded-md font-medium hover:opacity-80 focus:ring-2 focus:ring-[var(--grey)] focus:ring-offset-2 transition-all duration-300 cursor-pointer"
            >
              Wstecz
            </button>
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
              className="flex-1 bg-[var(--green)] text-white py-3 px-6 rounded-md font-medium hover:opacity-80 focus:ring-2 focus:ring-[#3F84D2] focus:ring-offset-2 transition-all duration-300 cursor-pointer"
              >
              Przelicz ponownie
            </button>
          </div>
          <div className="w-full">
            <button
              onClick={handleCalculatorRedirect}
              className="w-full bg-[var(--blue)]  text-white py-3 px-6 rounded-md font-medium  hover:opacity-80 focus:ring-2 focus:ring-[#00993F] focus:ring-offset-2 transition-all duration-300 cursor-pointer"
            >
              Przejdź do zaawansowanego kalkulatora
            </button>
          </div>
        </div >
      )
      }
    </div >
  );
}
