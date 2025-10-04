'use client';
import { useState, useEffect } from 'react';

interface StatisticsComparisonProps {
  expectedPension?: number;
}

interface PensionGroup {
  name: string;
  range: string;
  average: number;
  description: string;
  characteristics: string[];
  percentage: number;
}

export default function StatisticsComparison({ expectedPension = 4000 }: StatisticsComparisonProps) {
  const [selectedGroup, setSelectedGroup] = useState<PensionGroup | null>(null);
  const [userPosition, setUserPosition] = useState<number>(0);

  // Rzeczywiste dane z ZUS na podstawie dostarczonych plików
  const pensionGroups: PensionGroup[] = [
    {
      name: "Poniżej minimalnej",
      range: "do 1 878 zł",
      average: 1458.03,
      description: "Świadczeniobiorcy otrzymujący emeryturę poniżej minimalnej",
      characteristics: [
        "Niska aktywność zawodowa",
        "Nieprzepracowanie minimum 25 lat (M) / 20 lat (K)",
        "Brak prawa do gwarancji minimalnej emerytury",
        "Często osoby z krótkim stażem pracy"
      ],
      percentage: 8
    },
    {
      name: "Minimalna emerytura",
      range: "1 878 - 2 500 zł",
      average: 2200,
      description: "Emeryci otrzymujący świadczenie w okolicach minimum",
      characteristics: [
        "Podstawowy staż pracy (20-25 lat)",
        "Niskie wynagrodzenia w trakcie kariery",
        "Często pracownicy fizyczni i usługowi",
        "Przeciętny kapitał początkowy: ~45 000 zł"
      ],
      percentage: 15
    },
    {
      name: "Średnia krajowa",
      range: "2 500 - 4 500 zł",
      average: 3500,
      description: "Najliczniejsza grupa emerytów w Polsce",
      characteristics: [
        "Staż pracy 30-35 lat",
        "Stabilne zatrudnienie w sektorze publicznym/prywatnym",
        "Przeciętne wynagrodzenia przez całą karierę",
        "Kapitał początkowy: ~70 000-100 000 zł"
      ],
      percentage: 45
    },
    {
      name: "Powyżej średniej",
      range: "4 500 - 7 000 zł",
      average: 5748.66,
      description: "Emeryci z ponadprzeciętnymi świadczeniami",
      characteristics: [
        "Długi staż pracy (35+ lat)",
        "Wyższe stanowiska, specjaliści",
        "Stałe zatrudnienie w dobrych warunkach",
        "Kapitał początkowy: ~110 000 zł"
      ],
      percentage: 25
    },
    {
      name: "Wysokie emerytury",
      range: "powyżej 7 000 zł",
      average: 8799.92,
      description: "Najwyższe świadczenia emerytalne",
      characteristics: [
        "Kadra kierownicza, dyrektorzy",
        "Posłowie, senatorzy, wysokie stanowiska państwowe",
        "Bardzo długi staż w dobrych warunkach",
        "Wysokie składki przez cały okres pracy"
      ],
      percentage: 7
    }
  ];

  useEffect(() => {
    // Oblicz pozycję użytkownika na skali - ograniczona do zakresu 0-100%
    let userGroupIndex = pensionGroups.findIndex(group => 
      expectedPension <= group.average || group === pensionGroups[pensionGroups.length - 1]
    );
    
    // Zabezpieczenie przed wartościami spoza zakresu
    userGroupIndex = Math.max(0, Math.min(userGroupIndex, pensionGroups.length - 1));
    setUserPosition(userGroupIndex);
  }, [expectedPension]);

  const getComparisonText = () => {
    const averagePension = 4045; // Średnia emerytura w Polsce
    const difference = expectedPension - averagePension;
    const percentageDiff = ((difference / averagePension) * 100).toFixed(1);

    if (difference > 0) {
      return `Twoje oczekiwania są o ${percentageDiff}% wyższe od średniej krajowej`;
    } else if (difference < 0) {
      return `Twoje oczekiwania są o ${Math.abs(Number(percentageDiff))}% niższe od średniej krajowej`;
    } else {
      return "Twoje oczekiwania są dokładnie na poziomie średniej krajowej";
    }
  };

  // Oblicz pozycję kropki z ograniczeniami
  const calculateDotPosition = () => {
    const minPosition = 2; // Minimalna pozycja (2% od lewej)
    const maxPosition = 98; // Maksymalna pozycja (98% od lewej)
    
    let position = (userPosition / (pensionGroups.length - 1)) * 100;
    
    // Ogranicz pozycję do dozwolonego zakresu
    position = Math.max(minPosition, Math.min(position, maxPosition));
    
    return position;
  };

  const dotPosition = calculateDotPosition();

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border border-[var(--grey)]">
      <h2 className="text-2xl font-bold text-[black] mb-6 text-center">
        Porównanie z rzeczywistymi danymi ZUS
      </h2>

      {/* Podsumowanie porównania */}
      <div className="bg-[var(--grey)]/10 border border-[var(--grey)] rounded-lg p-6 mb-8">
        <div className="text-center">
          <p className="text-lg text-[black] mb-2">
            Oczekiwana emerytura: <strong>{expectedPension.toLocaleString()} zł</strong>
          </p>
          <p className="text-md text-[var(--green)] font-semibold">
            {getComparisonText()}
          </p>
        </div>
      </div>

      {/* Wizualizacja grup emerytalnych */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-[black] mb-4">
          Rozkład wysokości emerytur w Polsce
        </h3>
        
        <div className="relative bg-gray-100 rounded-lg p-4">
          {/* Skala */}
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>1 878 zł</span>
            <span>Średnia: 4 045 zł</span>
            <span>7 000+ zł</span>
          </div>
          
          {/* Pasek progresu grup */}
          <div className="flex h-8 rounded-lg overflow-hidden mb-4">
            {pensionGroups.map((group, index) => (
              <div
                key={group.name}
                className="relative group cursor-pointer"
                style={{ width: `${group.percentage}%` }}
                onMouseEnter={() => setSelectedGroup(group)}
                onMouseLeave={() => setSelectedGroup(null)}
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    index === 0 ? 'bg-red-400' :
                    index === 1 ? 'bg-orange-400' :
                    index === 2 ? 'bg-yellow-400' :
                    index === 3 ? 'bg-green-400' :
                    'bg-blue-400'
                  } ${selectedGroup?.name === group.name ? 'opacity-100' : 'opacity-80'}`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white mix-blend-difference">
                    {group.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Wskaźnik użytkownika - POPRAWIONE POZYCJONOWANIE */}
          <div 
            className="absolute top-0 transform -translate-x-1/2 transition-all duration-500 z-10"
            style={{ 
              left: `${dotPosition}%`,
              top: '100%',
              marginTop: '10px'
            }}
          >
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-[var(--green)] rounded-full border-2 border-white shadow-lg" />
              <div className="text-xs font-semibold text-[var(--green)] mt-1 whitespace-nowrap">
                Twoje oczekiwania
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Szczegóły grup */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {pensionGroups.map((group, index) => (
          <div
            key={group.name}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
              selectedGroup?.name === group.name 
                ? 'border-[var(--green)] bg-[var(--green)]/10 shadow-md' 
                : 'border-[var(--grey)] hover:border-[var(--grey)]/70'
            }`}
            onMouseEnter={() => setSelectedGroup(group)}
            onMouseLeave={() => setSelectedGroup(null)}
          >
            <h4 className="font-semibold text-[black] mb-2">{group.name}</h4>
            <p className="text-sm text-[var(--grey)] mb-2">{group.range}</p>
            <p className="text-lg font-bold text-[var(--green)]">
              Średnia: {group.average.toLocaleString()} zł
            </p>
          </div>
        ))}
      </div>

      {/* Szczegółowy opis wybranej grupy */}
      {selectedGroup && (
        <div className="bg-[var(--grey)]/10 border border-[var(--grey)] rounded-lg p-6 animate-fadeIn">
          <h3 className="text-xl font-bold text-[black] mb-3">
            {selectedGroup.name}
          </h3>
          <p className="text-[#000000] mb-4">{selectedGroup.description}</p>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-[black]">Charakterystyka grupy:</h4>
            <ul className="list-disc list-inside space-y-1 text-[#000000]">
              {selectedGroup.characteristics.map((char, index) => (
                <li key={index}>{char}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 p-3 bg-[var(--green)]/10 rounded-lg border border-[var(--green)]">
            <p className="text-sm text-[black]">
              <strong>Porównanie:</strong> Twoje oczekiwania są {
                expectedPension > selectedGroup.average ? 'wyższe' : 
                expectedPension < selectedGroup.average ? 'niższe' : 'równe'
              } średniej tej grupy
            </p>
          </div>
        </div>
      )}

      {/* Źródło danych */}
      <div className="mt-6 pt-4 border-t border-[var(--grey)]">
        <p className="text-xs text-[var(--grey)] text-center">
          Dane oparte na rzeczywistych statystykach ZUS za 2024 rok | 
          Średnia emerytura: 4 045 zł | Minimalna: 1 878 zł
        </p>
      </div>
    </div>
  );
}