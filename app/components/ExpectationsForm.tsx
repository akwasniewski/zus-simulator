'use client';
import { useState } from 'react';

export default function ExpectationsForm() {
  const [expectedPension, setExpectedPension] = useState(4000);
  const [showComparison, setShowComparison] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowComparison(true);
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
            value={expectedPension}
            onChange={(e) => setExpectedPension(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3F84D2] focus:border-transparent text-center text-2xl font-bold"
            min="1000"
            step="100"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Minimalna: 1 588 zł</span>
            <span>Średnia: 3 126 zł</span>
            <span>Wysoka: 6 000+ zł</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#007834] text-white py-3 px-6 rounded-lg font-semibold hover:bg-white hover:text-[#007834] border-2 border-[#007834] transition-all duration-300 shadow-lg"
        >
          Porównaj ze statystykami
        </button>
      </form>

      {!showComparison && (
        <div className="mt-6 p-4 bg-[#BEC3CE] rounded-lg">
          <p className="text-sm text-[#00416E] text-center">
            💡 Wpisz kwotę i zobacz, jak Twoje oczekiwania wypadają na tle innych emerytów
          </p>
        </div>
      )}
    </div>
  );
}