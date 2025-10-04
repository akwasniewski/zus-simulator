'use client';
import { useState } from 'react';
import ExpectationsForm from './components/ExpectationsForm';
import StatisticsComparison from './components/StatisticsComparison';

export default function SymulatorPage() {
  const [expectedPension, setExpectedPension] = useState(4000);
  const [showComparison, setShowComparison] = useState(false);

  const handlePensionChange = (pension: number) => {
    setExpectedPension(pension);
  };

  const handleShowComparison = () => {
    setShowComparison(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-grey to-blue">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Symulator Emerytalny
          </h1>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Sprawdź, jak Twoje oczekiwania emerytalne mają się do rzeczywistości
          </p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <ExpectationsForm 
            onPensionChange={handlePensionChange}
            onShowComparison={handleShowComparison}
          />
        </div>

        {/* Stats comparison - pokazuj tylko po kliknięciu przycisku */}
        {showComparison && (
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <StatisticsComparison expectedPension={expectedPension} />
          </div>
        )}
      </div>
    </div>
  );
}