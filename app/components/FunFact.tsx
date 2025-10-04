'use client';
import { useState, useEffect } from 'react';

export const funFacts: string[] = [
  "Najwyższa emerytura w Polsce wynosi 15 287 zł - pobiera ją mieszkaniec woj. śląskiego",
  "Najniższa emerytura to 1 588 zł - minimalna emerytura gwarantowana przez państwo",
  "Średnia emerytura w Polsce to 3 126 zł brutto",
  "Tylko 2% emerytów otrzymuje świadczenie powyżej 6 000 zł miesięcznie",
  "Co czwarty emeryt otrzymuje poniżej 2 500 zł miesięcznie",
  "Rekordzista przepracował 67 lat przed przejściem na emeryturę",
  "Najstarsza emerytka w Polsce ma 108 lat i pobiera emeryturę od 65 lat",
  "Średni wiek przejścia na emeryturę to 61 lat dla mężczyzn i 59 lat dla kobiet",
  "Górnicy przechodzą na emeryturę średnio 8 lat wcześniej niż urzędnicy",
  "Nauczyciele z najwyższymi emeryturami pracowali średnio 42 lata",
  "Co piąta osoba pobierająca emeryturę ma mniej niż 65 lat",
  "Kobiety stanowią 62% wszystkich emerytów w Polsce",
  "Emeryci w woj. mazowieckim otrzymują średnio o 400 zł więcej niż w lubelskim",
  "Byli żołnierze mają najwyższe średnie emerytury - 5 800 zł",
  "Rolnicy otrzymują średnio o 35% niższe emerytury niż pracownicy etatowi",
  "Co trzeci emeryt w Polsce dorabia do swojej emerytury",
  "Osoby z wyższym wykształceniem otrzymują średnio o 45% wyższe emerytury",
  "Różnica w emeryturach między kobietami a mężczyznami wynosi średnio 25%",
  "Tylko 15% emerytów deklaruje, że ich emerytura w pełni zaspokaja potrzeby",
  "Najwięcej emerytów mieszka w woj. śląskim - ponad 800 tysięcy",
  "Aby otrzymać minimalną emeryturę, kobiety muszą przepracować 20 lat, mężczyźni 25 lat",
  "Urlopy rodzicielskie wliczają się do stażu pracy przy obliczaniu emerytury",
  "Każdy rok pracy powyżej wymaganego okresu podwyższa emeryturę średnio o 3-5%",
  "Zasiłek chorobowy nie wlicza się do stażu emerytalnego",
  "Studia wyższe liczą się do stażu emerytalnego - maksymalnie 4 lata",
  "Emerytura pomostowa przysługuje tylko 32 grupom zawodowym",
  "Można pracować i pobierać emeryturę bez ograniczeń od 1 stycznia 2022 roku",
  "Wiek emerytalny wynosi 60 lat dla kobiet i 65 lat dla mężczyzn",
  "Emeryturę można zawiesić na 3 lata i wrócić do pracy",
  "Za pracę w szkodliwych warunkach można wcześniej przejść na emeryturę",
  "Polscy emeryci otrzymują średnio 40% mniej niż emeryci w Niemczech",
  "W Czechach średnia emerytura jest o 25% wyższa niż w Polsce",
  "Polska na 24 miejscu w UE pod względem wysokości emerytur",
  "W Szwajcarii emeryci otrzymują średnio 5-krotność polskich emerytur",
  "Węgierscy emeryci otrzymują średnio o 30% mniej niż polscy",
  "W USA nie ma państwowej emerytury - system oparty na prywatnych oszczędnościach",
  "W Szwecji emerytura zależy od całkowitych zarobków w ciągu życia",
  "W Norwegii emerytura jest finansowana z dochodów z ropy naftowej",
  "We Włoszech wiek emerytalny wynosi 67 lat dla obu płci",
  "W Japonii emeryci często pracują do 70-75 roku życia",
  "Tylko 15% Polaków oszczędza dodatkowo na emeryturę",
  "PPE (Pracownicze Plany Emerytalne) mają tylko 2 miliony Polaków",
  "IKZE i IKE - tylko 5% Polaków korzysta z tych form oszczędzania",
  "Średnie wpłaty na PPE to 150 zł miesięcznie",
  "Kobiety częściej oszczędzają na emeryturę niż mężczyźni",
  "Osoby przed 30 rokiem życia rzadko myślą o emeryturę - tylko 8% oszczędza",
  "Fundusze emerytalne zarobiły średnio 6,5% w 2023 roku",
  "Waloryzacja emerytur w 2024 roku wyniosła 12,3%",
  "ZUS wypłaca miesięcznie ponad 25 miliardów złotych emerytur",
  "Na każdego emeryta pracuje statystycznie 1,5 osoby aktywnej zawodowo"
];

export default function FunFactsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextFact = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % funFacts.length);
  };

  const prevFact = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + funFacts.length) % funFacts.length);
  };

  // Auto rotation every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextFact();
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white  py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-grey relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-8 bg-green rounded"></div>
              <h3 className="text-xl font-bold text-foreground">Czy wiesz, że...?</h3>
            </div>
          </div>

          {/* Container with fun fact and arrows */}
          <div className="relative">
            {/* Left arrow */}
            <button
              onClick={prevFact}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 text-green hover:text-green/80 transition-all duration-300 z-10 flex items-center justify-center"
              aria-label="Previous fun fact"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>

            {/* Fun fact content */}
            <div className="mx-12 p-4 bg-grey/30 rounded-lg min-h-[80px] flex items-center">
              <p className="text-foreground text-lg leading-relaxed text-center w-full">
                {funFacts[currentIndex]}
              </p>
            </div>

            {/* Right arrow */}
            <button
              onClick={nextFact}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 text-green hover:text-green/80 transition-all duration-300 z-10 flex items-center justify-center"
              aria-label="Next fun fact"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-4">
            {funFacts.slice(0, 8).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'bg-green scale-125' 
                    : 'bg-grey hover:bg-green/50'
                }`}
                aria-label={`Go to fun fact ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}