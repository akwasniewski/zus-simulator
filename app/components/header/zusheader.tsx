"use client";
import React, { useState } from 'react';
import { Search, Volume2, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import zusLogo from './logozus.svg';
import bipLogo from './bip.png'
import eu from './eu.jpg'
import wozek from './ikona_wozek.svg'
import ucho from './ikona_ucho.svg'

const ZUSHeader = () => {
  const [isLangOpen, setIsLangOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-200">
      {/* Top Bar */}
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Image src={zusLogo} alt="ZUS Logo" className="zus-logo-img" width={300} />
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          <button className="text-sm text-gray-700 hover:text-gray-900">
            Kontakt
          </button>

          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              PL
              <ChevronDown className="w-4 h-4" />
            </button>
            {isLangOpen && (
              <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded shadow-lg py-1 min-w-[60px]">
                <button className="w-full px-3 py-1 text-sm hover:bg-gray-100 text-left">EN</button>
                <button className="w-full px-3 py-1 text-sm hover:bg-gray-100 text-left">DE</button>
              </div>
            )}
          </div>

          {/* Accessibility Icons - Using CSS Variables */}
          <button className="p-2 bg-[var(--blue)] text-white rounded hover:opacity-90">
            <Image src={wozek} alt="wozek" className="wozek-img" width={30} />
          </button>
          <button className="p-2 bg-[var(--blue)] text-white rounded hover:opacity-90">
            <Image src={ucho} alt="ucho" className="wozek-img" width={30} />
          </button>

          {/* BIP Logo */}
          <div className="flex items-center">
            <Image src={bipLogo} alt="BIP LOGO" className="bip-logo-img" width={50} />
          </div>

          {/* Action Buttons - Using CSS Variables */}
          <button className="px-4 py-2 border-2 border-[var(--blue)] text-[var(--blue)] rounded hover:bg-gray-50 text-sm font-medium">
            Zarejestruj w PUE/eZUS →
          </button>
          <button className="px-4 py-2 bg-[var(--orange)] text-gray-900 rounded hover:opacity-90 text-sm font-medium">
            Zaloguj do PUE/eZUS →
          </button>

          {/* Search */}
          <button className="p-2 border-2 border-gray-300 rounded-full hover:bg-gray-50">
            <Search className="w-5 h-5 text-gray-700" />
          </button>
          <div className="text-sm text-gray-700">
            Szukaj
          </div>

          {/* EU Flag */}
          <div className="flex flex-col items-center gap-1">
            <Image src={eu} alt="Flaga UE" width={100} />
          </div>
        </div>
      </div>

      {/* Navigation Bar - Using CSS Variables */}
      <nav className="bg-gray-50 border-t border-gray-200">
        <div className="px-6 py-4 flex items-center justify-center">
          <div className="flex gap-12">
            {['Świadczenia', 'Firmy', 'Pracujący', 'Lekarze', 'Wzory formularzy', 'Baza wiedzy', 'O ZUS'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[var(--green)] font-semibold hover:opacity-80 text-lg px-3 py-2"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default ZUSHeader;
