'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ExpectationsForm() {
  const [expectedPension, setExpectedPension] = useState(4000);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save expected pension to localStorage
    localStorage.setItem('expectedPension', expectedPension.toString());
    // Redirect to basic form
    router.push('/basic-form');
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
            value={expectedPension}
            onChange={(e) => setExpectedPension(Number(e.target.value))}
            className="w-full px-4 py-3 border border-[var(--grey)] rounded-md shadow-sm focus:ring-2 focus:ring-[var(--green)] focus:border-[var(--green)] focus:outline-none transition-all duration-300 text-center text-2xl font-bold text-[#000000]"
            min="1000"
            step="100"
          />
          <div className="flex justify-between text-xs text-[var(--grey)] mt-2">
            <span>Minimalna: 1 588 zł</span>
            <span>Średnia: 3 126 zł</span>
            <span>Wysoka: 6 000+ zł</span>
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