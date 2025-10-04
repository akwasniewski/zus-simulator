'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import RetirementCalculator from '../components/calculator';
export default function CalculatorPage() {
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    // Read URL params and populate formData
    setFormData({
      gender: searchParams.get('gender') || '',
      currentAge: searchParams.get('currentAge') || '',
      currentSalary: searchParams.get('currentSalary') || '',
      workStartYear: searchParams.get('workStartYear') || '',
      considerSickLeave: searchParams.get('considerSickLeave') === 'true',
      hasChildren: searchParams.get('hasChildren') === 'true',
      numberOfChildren: searchParams.get('numberOfChildren') || '',
      hasRetirementAccount: searchParams.get('hasRetirementAccount') === 'true',
      currentRetirementBalance: searchParams.get('currentRetirementBalance') || '',
      retirementAge: searchParams.get('retirementAge') || '',
      zipCode: searchParams.get('zipCode') || '',
    });
  }, [searchParams]);

  return <RetirementCalculator formData={formData} setFormData={setFormData} />;
}
