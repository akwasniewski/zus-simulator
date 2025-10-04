'use client';
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Calendar, PiggyBank } from 'lucide-react';

export default function RetirementCalculator({ formData, setFormData }) {
  const currentYear = new Date().getFullYear();

  // Initialize state variables FIRST
  const [currentAge, setCurrentAge] = useState(parseInt(formData?.currentAge) || 35);
  const [predictedPension, setPredictedPension] = useState(0);
  const [retirementAge, setRetirementAge] = useState(parseInt(formData?.retirementAge) || (formData?.gender === 'female' ? 60 : 65));
  const [pastEarnings, setPastEarnings] = useState([{
    year: currentYear,
    age: parseInt(formData?.currentAge) || 35,
    salary: parseInt(formData?.currentSalary) * 12 || 0,
    pregnancy: false
  }]);
  const [periods, setPeriods] = useState([]);

  const [bulkPastYears, setBulkPastYears] = useState({
    startYear: currentYear - 10,
    endYear: currentYear - 1,
    startingSalary: 50000,
    annualRaise: 3
  });

  // Then use them in derived values
  const gender = formData?.gender || 'male';
  const currentSalary = parseInt(formData?.currentSalary) || 0;

  React.useEffect(() => {
    // Add theme variables
    const style = document.createElement('style');
    style.textContent = `
    :root {
      --background: #ffffff;
      --foreground: #171717;
      --green: #007834;
      --orange: #ffb34f;
      --grey: #bec3ce;
      --blue: #3f84d2;
      --lightblue: #0084d2;
      --red: #f05e5e;
      --black: #000000;
    }
  `;
    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, []);

  React.useEffect(() => {
    // Update current year's pastEarnings entry
    const currentSalary =
      formData?.currentSalary && formData.currentSalary !== ''
        ? parseFloat(formData.currentSalary)
        : 0;
    setPastEarnings(prev => {
      // Remove existing entry for currentYear (if any)
      const withoutCurrentYear = prev.filter(e => e.year !== currentYear);

      // Add new or updated entry
      return [
        ...withoutCurrentYear,
        {
          year: currentYear,
          age: currentAge,
          salary: currentSalary * 12,
          pregnancy: false,
        },
      ];
    });

  }, [formData?.currentSalary, currentAge, currentYear]);

  const calculateProjections = () => {
    const projections = [];

    const sortedPeriods = [...periods].sort((a, b) => a.startYear - b.startYear);

    sortedPeriods.forEach((period) => {
      let salary = period.startingSalary;
      const periodStartYear = period.startYear;
      const periodEndYear = Math.min(period.endYear, currentYear + (retirementAge - currentAge));

      for (let year = periodStartYear; year <= periodEndYear; year++) {
        const age = currentAge + (year - currentYear);
        if (age > retirementAge) break;

        projections.push({
          year,
          age,
          salary: Math.round(salary),
          periodName: period.name
        });

        salary = salary * (1 + period.annualRaise / 100);
      }
    });

    return projections;
  };

  const projections = calculateProjections();

  // Calculate total and average for both past and future earnings
  const pastTotal = pastEarnings.reduce((sum, p) => sum + (parseFloat(p.salary) || 0), 0);
  const futureTotal = projections.reduce((sum, p) => sum + p.salary, 0);
  const totalEarnings = pastTotal + futureTotal;

  const totalYears = pastEarnings.length + projections.length;
  const avgSalary = totalYears > 0 ? Math.round(totalEarnings / totalYears) : 0;

  const allData = [...pastEarnings.map(p => ({ ...p, salary: parseFloat(p.salary) || 0, type: 'past' })), ...projections.map(p => ({ ...p, type: 'future' }))];

  const addBulkPastYears = () => {
    const start = Math.max(currentYear - 50, bulkPastYears.startYear);
    const end = Math.min(currentYear, bulkPastYears.endYear);

    if (start >= end) {
      alert('Rok końcowy musi być późniejszy niż początkowy');
      return;
    }

    const newYears = [];
    let salary = bulkPastYears.startingSalary;

    for (let year = start; year <= end; year++) {
      newYears.push({
        year: year,
        age: currentAge - (currentYear - year),
        salary: Math.round(salary)
      });
      salary = salary * (1 + bulkPastYears.annualRaise / 100);
    }

    const existingYears = pastEarnings.filter(e => e.year < start || e.year > end);
    const allYears = [...existingYears, ...newYears].sort((a, b) => a.year - b.year);

    setPastEarnings(allYears);
  };

  const addPeriod = () => {
    const lastPeriod = periods.length > 0 ? periods[periods.length - 1] : null;
    const newStartYear = lastPeriod ? lastPeriod.endYear + 1 : currentYear;

    setPeriods([...periods, {
      id: Date.now(),
      name: `Okres ${periods.length + 1}`,
      startYear: newStartYear,
      endYear: newStartYear + 5,
      startingSalary: lastPeriod ? lastPeriod.startingSalary * Math.pow(1 + lastPeriod.annualRaise / 100, 5) : currentSalary,
      annualRaise: 3
    }]);
  };

  const updatePeriod = (id, field, value) => {
    const numValue = parseFloat(value) || 0;
    setPeriods(periods.map(p => {
      if (p.id === id) {
        let newValue = numValue;

        if (field === 'startYear') {
          newValue = Math.max(currentYear - 50, Math.min(currentYear + 50, numValue));
        } else if (field === 'endYear') {
          newValue = Math.max(p.startYear, Math.min(currentYear + 50, numValue));
        } else if (field === 'startingSalary') {
          newValue = Math.max(0, Math.min(10000000, numValue));
        } else if (field === 'annualRaise') {
          newValue = Math.max(-20, Math.min(50, numValue));
        }

        return { ...p, [field]: newValue };
      }
      return p;
    }));
  };

  const updatePeriodName = (id, value) => {
    setPeriods(periods.map(p => p.id === id ? { ...p, name: value } : p));
  };

  const removePeriod = (id) => {
    setPeriods(periods.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Kalkulator emerytalny</h1>
          <p style={{ color: 'var(--grey)' }}>Dowiedz się jaką dostaniesz emeryturę i zaplanuj swoją przyszłość</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6" style={{ borderLeft: '4px solid var(--blue)' }}>
            <div className="flex items-center justify-between mb-2">
              <Calendar style={{ color: 'var(--blue)' }} size={24} />
              <span className="text-sm" style={{ color: 'var(--grey)' }}>Pozostało do emerytury</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{retirementAge - currentAge}</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6" style={{ borderLeft: '4px solid var(--red)' }}>
            <div className="flex items-center justify-between mb-2">
              <DollarSign style={{ color: 'var(--red)' }} size={24} />
              <span className="text-sm" style={{ color: 'var(--grey)' }}>Całkowite dochody</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{totalEarnings} zł</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6" style={{ borderLeft: '4px solid var(--orange)' }}>
            <div className="flex items-center justify-between mb-2">
              <TrendingUp style={{ color: 'var(--orange)' }} size={24} />
              <span className="text-sm" style={{ color: 'var(--grey)' }}>Średnia pensja</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{avgSalary} zł</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6" style={{ borderLeft: '4px solid var(--green)' }}>
            <div className="flex items-center justify-between mb-2">
              <PiggyBank style={{ color: 'var(--green)' }} size={24} />
              <span className="text-sm" style={{ color: 'var(--grey)' }}>Przewidywana emerytura</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{predictedPension} zł</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Aktualne ustawienia</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Aktualny wiek</label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => {
                    const newAge = Math.max(16, Math.min(100, parseInt(e.target.value) || 0));
                    setCurrentAge(newAge);
                    setFormData({ ...formData, currentAge: newAge });
                  }}
                  min="16"
                  max="100"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--grey)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Planowany wiek przejścia na emeryturę</label>
                <input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => {
                    const newRetirementAge = Math.max(currentAge, Math.min(100, parseInt(e.target.value) || 0));
                    setRetirementAge(newRetirementAge);
                    setFormData({ ...formData, retirementAge: newRetirementAge });
                  }}
                  min={currentAge}
                  max="100"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--grey)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Obecny stan konta emerytalnego (zł)</label>
                <input
                  type="number"
                  value={formData?.currentRetirementBalance || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, currentRetirementBalance: value });
                  }}
                  min="0"
                  placeholder="0"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: 'var(--grey)' }}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--grey)' }}>
                  Kwota już zgromadzona na Twoim koncie w ZUS
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Historyczne zarobki</h2>
            </div>
            <div className="text-sm mb-2" style={{ color: 'var(--grey)' }}>
              Jeśli nie znasz kwotu zebranej na koncie, a nie jesteś pewny dokładnej wartości zarobków możesz na raz dodać szacowane zarobki z wielu lat
            </div>
            <div className="mb-4 p-3 rounded-lg border" style={{ backgroundColor: 'rgba(63, 132, 210, 0.1)', borderColor: 'var(--blue)' }}>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Dodaj zarobki z wielu lat</h3>
              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div>
                  <label style={{ color: 'var(--grey)' }}>Rok początkowy</label>
                  <input
                    type="number"
                    value={bulkPastYears.startYear}
                    onChange={(e) => setBulkPastYears({ ...bulkPastYears, startYear: parseInt(e.target.value) || currentYear - 10 })}
                    min={currentYear - 50}
                    max={currentYear}
                    className="w-full px-2 py-1 border rounded"
                    style={{ borderColor: 'var(--grey)' }}
                  />
                </div>
                <div>
                  <label style={{ color: 'var(--grey)' }}>Rok końcowy</label>
                  <input
                    type="number"
                    value={bulkPastYears.endYear}
                    onChange={(e) => setBulkPastYears({ ...bulkPastYears, endYear: parseInt(e.target.value) || currentYear - 1 })}
                    min={currentYear - 50}
                    max={currentYear}
                    className="w-full px-2 py-1 border rounded"
                    style={{ borderColor: 'var(--grey)' }}
                  />
                </div>
                <div>
                  <label style={{ color: 'var(--grey)' }}>Początkowe zarobki</label>
                  <input
                    type="number"
                    value={bulkPastYears.startingSalary}
                    onChange={(e) => setBulkPastYears({ ...bulkPastYears, startingSalary: parseFloat(e.target.value) || 50000 })}
                    min="0"
                    max="10000000"
                    className="w-full px-2 py-1 border rounded"
                    style={{ borderColor: 'var(--grey)' }}
                  />
                </div>
                <div>
                  <label style={{ color: 'var(--grey)' }}>Roczna podwyżka %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={bulkPastYears.annualRaise}
                    onChange={(e) => setBulkPastYears({ ...bulkPastYears, annualRaise: parseFloat(e.target.value) || 3 })}
                    min="-20"
                    max="50"
                    className="w-full px-2 py-1 border rounded"
                    style={{ borderColor: 'var(--grey)' }}
                  />
                </div>
              </div>
              <button
                onClick={addBulkPastYears}
                className="w-full px-3 py-1 text-white rounded text-sm"
                style={{ backgroundColor: 'var(--blue)' }}
              >
                Wygeneruj zarobki z wielu lat
              </button>
            </div>

            <div className="border rounded" style={{ borderColor: 'var(--grey)' }}>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10" style={{ backgroundColor: 'var(--background)' }}>
                    <tr style={{ backgroundColor: 'rgba(190, 195, 206, 0.2)' }}>
                      <th className="px-4 py-2 text-left">Rok</th>
                      <th className="px-4 py-2 text-left">Roczne zarobki</th>
                      <th className="px-4 py-2 w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="sticky top-10 z-10" style={{ backgroundColor: 'var(--background)' }}>
                      <td colSpan="3" className="px-4 py-2 text-center border-b" style={{ borderColor: 'rgba(190, 195, 206, 0.2)' }}>
                        <button
                          onClick={() => {
                            if (pastEarnings.length === 0) {
                              setPastEarnings([{ year: currentYear, salary: '' }]);
                            } else {
                              const maxYear = Math.max(...pastEarnings.map(e => e.year));
                              if (maxYear < currentYear) {
                                setPastEarnings([...pastEarnings, { year: maxYear + 1, salary: '' }]);
                              }
                            }
                          }}
                          className="px-3 py-1 text-xs rounded text-white"
                          style={{ backgroundColor: 'var(--green)' }}
                          disabled={pastEarnings.length > 0 && Math.max(...pastEarnings.map(e => e.year)) >= currentYear}
                        >
                          + Dodaj rok powyżej
                        </button>
                      </td>
                    </tr>

                    {(() => {
                      if (pastEarnings.length === 0) {
                        return (
                          <tr>
                            <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                              Brak danych, użyj przycisków "dodaj rok powyżej/poniżej" aby dodać zarobki za rok
                            </td>
                          </tr>
                        );
                      }

                      const years = pastEarnings.map(e => e.year);
                      const minYear = Math.min(...years);
                      const maxYear = Math.max(...years);
                      const rows = [];

                      for (let year = maxYear; year >= minYear; year--) {
                        const earning = pastEarnings.find(e => e.year === year);
                        const salary = earning ? earning.salary : '0';
                        const existingIndex = pastEarnings.findIndex(e => e.year === year);

                        rows.push(
                          <tr
                            key={year}
                            className="border-b"
                            style={{ borderColor: 'rgba(190, 195, 206, 0.2)' }}
                          >
                            <td className="px-4 py-2 font-medium">
                              {year}
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="number"
                                value={salary}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (existingIndex !== -1) {
                                    const updated = [...pastEarnings];
                                    updated[existingIndex] = { ...updated[existingIndex], salary: value };
                                    setPastEarnings(updated);
                                  } else {
                                    setPastEarnings([...pastEarnings, { year, salary: value }]);
                                  }
                                }}
                                min="0"
                                className="w-full px-2 py-1 border rounded"
                                style={{ borderColor: 'var(--grey)' }}
                                placeholder="Zarobki"
                              />
                            </td>
                            <td className="px-4 py-2">
                              {earning && (
                                <button
                                  onClick={() => {
                                    setPastEarnings(pastEarnings.filter((_, i) => i !== existingIndex));
                                  }}
                                  className="px-2 py-1 text-white rounded text-xs"
                                  style={{ backgroundColor: 'var(--red)' }}
                                >
                                  ×
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      }

                      return rows;
                    })()}

                    <tr className="sticky bottom-0 z-10" style={{ backgroundColor: 'var(--background)' }}>
                      <td colSpan="3" className="px-4 py-2 text-center border-t" style={{ borderColor: 'rgba(190, 195, 206, 0.2)' }}>
                        <button
                          onClick={() => {
                            if (pastEarnings.length === 0) {
                              setPastEarnings([{ year: currentYear - 1, salary: '' }]);
                            } else {
                              const minYear = Math.min(...pastEarnings.map(e => e.year));
                              setPastEarnings([...pastEarnings, { year: minYear - 1, salary: '' }]);
                            }
                          }}
                          className="px-3 py-1 text-xs rounded text-white"
                          style={{ backgroundColor: 'var(--green)' }}
                        >
                          + Dodaj rok poniżej
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Zaplanuj przyszłość</h2>
              <button
                onClick={addPeriod}
                className="px-3 py-1 text-white rounded-md text-sm"
                style={{ backgroundColor: 'var(--green)' }}
              >
                + Dodaj okres
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {periods.map((period) => (
                <div key={period.id} className="p-3 rounded-lg border" style={{ backgroundColor: 'rgba(0, 120, 52, 0.05)', borderColor: 'var(--green)' }}>
                  <div className="flex justify-between items-start mb-2">
                    <input
                      type="text"
                      value={period.name}
                      onChange={(e) => updatePeriodName(period.id, e.target.value)}
                      className="font-semibold text-sm bg-transparent border-b border-transparent focus:outline-none"
                      style={{ color: 'var(--foreground)', borderBottomColor: 'var(--grey)' }}
                      placeholder="Period name"
                    />
                    <button
                      onClick={() => removePeriod(period.id)}
                      className="px-2 py-0.5 text-white rounded text-xs"
                      style={{ backgroundColor: 'var(--red)' }}
                    >
                      ×
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label style={{ color: 'var(--grey)' }}>Rok początkowy</label>
                      <input
                        type="number"
                        value={period.startYear}
                        onChange={(e) => updatePeriod(period.id, 'startYear', e.target.value)}
                        min={currentYear - 50}
                        max={currentYear + 50}
                        className="w-full px-2 py-1 border rounded"
                        style={{ borderColor: 'var(--grey)' }}
                      />
                    </div>
                    <div>
                      <label style={{ color: 'var(--grey)' }}>Rok końcowy</label>
                      <input
                        type="number"
                        value={period.endYear}
                        onChange={(e) => updatePeriod(period.id, 'endYear', e.target.value)}
                        min={period.startYear}
                        max={currentYear + 50}
                        className="w-full px-2 py-1 border rounded"
                        style={{ borderColor: 'var(--grey)' }}
                      />
                    </div>
                    <div className="col-span-2">
                      <label style={{ color: 'var(--grey)' }}>Początkowe zarobki</label>
                      <input
                        type="number"
                        value={period.startingSalary}
                        onChange={(e) => updatePeriod(period.id, 'startingSalary', e.target.value)}
                        min="0"
                        max="10000000"
                        className="w-full px-2 py-1 border rounded"
                        style={{ borderColor: 'var(--grey)' }}
                      />
                    </div>
                    <div className="col-span-2">
                      <label style={{ color: 'var(--grey)' }}>Planowana roczna podwyżka %</label>
                      <input
                        type="number"
                        step="0.5"
                        value={period.annualRaise}
                        onChange={(e) => updatePeriod(period.id, 'annualRaise', e.target.value)}
                        min="-20"
                        max="50"
                        className="w-full px-2 py-1 border rounded"
                        style={{ borderColor: 'var(--grey)' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Historia i predykcja pensji</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={allData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--grey)" />
                <XAxis dataKey="year" stroke="var(--foreground)" />
                <YAxis stroke="var(--foreground)" />
                <Tooltip
                  formatter={(value) => `${value.toLocaleString()} zł`}
                  contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--grey)' }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="salary"
                  stroke="var(--blue)"
                  strokeWidth={2}
                  name="Zarobki"
                  dot={{ fill: 'var(--blue)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
