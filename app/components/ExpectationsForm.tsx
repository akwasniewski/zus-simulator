'use client';
import { useState } from 'react';

interface ExpectationsFormProps {
  onPensionChange?: (pension: number) => void;
  onShowComparison?: () => void;
}

export default function ExpectationsForm({ onPensionChange, onShowComparison }: ExpectationsFormProps) {
  const [expectedPension, setExpectedPension] = useState(4000);
  const [localPension, setLocalPension] = useState(4000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setExpectedPension(localPension);
    onPensionChange?.(localPension);
    onShowComparison?.();
  };

  const handleLocalPensionChange = (value: number) => {
    setLocalPension(value);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-[#00416E] mb-2">
        Jakiej emerytury oczekujesz?
      </h2>
      <p className="text-[#000000] mb-6">
        Wpisz kwotę, jaką chciałbyś otrzymywać na emeryturze
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-[#00416E] mb-2">
            Oczekiwana miesięczna emerytura (zł)
          </label>
          <input
            type="number"
            value={localPension}
            onChange={(e) => handleLocalPensionChange(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3F84D2] focus:border-transparent text-center text-2xl font-bold"
            min="1000"
            step="100"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Minimalna: 1 878 zł</span>
            <span>Średnia: 4 045 zł</span>
            <span>Największa: 51 400 zł</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#007834] text-white py-3 px-6 rounded-lg font-semibold hover:bg-white hover:text-[#007834] border-2 border-[#007834] transition-all duration-300 shadow-lg"
        >
          Porównaj ze statystykami
        </button>
      </form>
    </div>
  );
}