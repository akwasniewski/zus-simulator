'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="bg-white rounded-lg shadow-lg p-8 border border-[var(--grey)]">
      <h2 className="text-2xl font-bold text-[black] text-center mb-2">
        Jakiej emerytury oczekujesz?
      </h2>
      <p className="text-[#000000] text-center mb-6">
        Wpisz kwotę, jaką chciałbyś otrzymywać na emeryturze
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#000000] mb-2">
            Oczekiwana miesięczna emerytura (zł)
          </label>
          <input
            type="number"
            value={localPension}
            onChange={(e) => handleLocalPensionChange(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F84D2] focus:border-transparent text-center text-2xl font-bold focus:ring-[var(--green)] focus:border-[var(--green)] focus-visible:border-[var(--green)] transition-all duration-300"
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
          className="w-full bg-[var(--green)] text-white py-3 px-6 rounded-md font-medium hover:opacity-80 focus:ring-2 focus:ring-[var(--green)] focus:ring-offset-2 transition-all duration-300"
        >
          Oblicz swoją emeryturę
        </button>
      </form>
    </div>
  );
}