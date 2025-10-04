import React, { JSX } from "react";

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-[var(--green)] text-white w-full">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        {/* Left column - link list */}
        <div style={{ fontWeight: 700 }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-2 text-sm font-medium">
          {[
            "Zamówienia publiczne",
            "Praca w ZUS",
            "Praca dla lekarzy",
            "Konkursy ofert",
            "Mienie zbędne",
            "Mapa serwisu",
          ].map((item) => (
            <a
              key={item}
              href="#"
              className="flex items-center gap-2 hover:underline whitespace-nowrap"
            >
              <span className="text-lg">›</span> {item}
            </a>
          ))}
        </div>

        {/* Center - info and social */}
        <div className="flex flex-col items-center md:items-start gap-4 md:gap-6 text-sm font-semibold">
          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="hover:underline">Deklaracja dostępności</a>
            <span className="opacity-50">|</span>
            <a href="#" className="hover:underline">Ustawienia plików cookies</a>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {/* YouTube */}
            <a href="#" className="flex items-center gap-2">
              <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#006943" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              Elektroniczny ZUS
            </a>

            {/* LinkedIn */}
            <a href="#" className="flex items-center gap-2">
              <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#006943" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              LinkedIn
            </a>

            {/* X */}
            <a href="#" className="flex items-center gap-2">
              <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#006943" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                </svg>
              </div>
              X
            </a>

            {/* RSS */}
            <a href="#" className="flex items-center gap-2"> 
              <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#006943" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248S0 22.546 0 20.752s1.456-3.248 3.252-3.248 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
                </svg>
              </div>
              Kanał RSS
            </a>
          </div>
        </div>

        {/* Right side - scroll up */}
        <div className="flex flex-col items-end justify-center">
          <a
            href="#top"
            className="flex items-center gap-2 font-semibold hover:underline"
          >
            Do góry
          </a>
        </div>
      </div>
    </footer>
  );
}
