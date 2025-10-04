import React, { JSX } from "react";

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-[#006943] text-white w-full">
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
              <div className="bg-white rounded-full w-8 h-8 relative" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} width="14" height="14" viewBox="0 0 24 24" fill="#006943" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.801 6c0 0-0.195-1.379-0.797-1.984-0.762-0.797-1.613-0.801-2.004-0.848-2.797-0.203-6.996-0.203-6.996-0.203h-0.008c0 0-4.199 0-6.996 0.203-0.391 0.047-1.242 0.051-2.004 0.848-0.602 0.605-0.793 1.984-0.793 1.984s-0.199 1.617-0.199 3.238v1.516c0 1.617 0.199 3.238 0.199 3.238s0.195 1.379 0.793 1.984c0.762 0.797 1.762 0.77 2.207 0.855 1.602 0.152 6.801 0.199 6.801 0.199s4.203-0.008 7-0.207c0.391-0.047 1.242-0.051 2.004-0.848 0.602-0.605 0.797-1.984 0.797-1.984s0.199-1.617 0.199-3.238v-1.516c-0.004-1.617-0.203-3.238-0.203-3.238zM7.934 12.594v-5.621l5.402 2.82-5.402 2.801z" />
                </svg>
              </div>
              Elektroniczny ZUS
            </a>

            {/* LinkedIn */}
            <a href="#" className="flex items-center gap-2">
              <div className="bg-white rounded-full w-8 h-8 relative" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} width="14" height="14" viewBox="0 0 24 24" fill="#006943" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.895 6.975v11.060h-3.683v-11.060h3.683zM4.129 3.56c0.011 1.060-0.792 1.908-2.076 1.908v0h-0.022c-1.239 0-2.031-0.848-2.031-1.908 0-1.083 0.826-1.908 2.076-1.908 1.261 0 2.042 0.826 2.054 1.908zM17.143 11.696v6.339h-3.672v-5.915c0-1.484-0.536-2.5-1.864-2.5-1.016 0-1.618 0.681-1.886 1.339-0.089 0.246-0.123 0.569-0.123 0.904v6.172h-3.672c0.045-10.022 0-11.060 0-11.060h3.672v1.607h-0.022c0.48-0.759 1.35-1.864 3.337-1.864 2.422 0 4.23 1.585 4.23 4.978z" />
                </svg>
              </div>
              Linkedin
            </a>

            {/* X */}
            <a href="#" className="flex items-center gap-2">
              <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#006943" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.203 1.875h2.757l-6.022 6.883 7.085 9.367h-5.547l-4.345-5.681-4.972 5.681h-2.758l6.442-7.363-6.797-8.888h5.688l3.927 5.192zM14.236 16.475h1.527l-9.86-13.037h-1.639z" />
                  </svg>
              </div>
              X
            </a>


            {/* RSS */}
            <a href="#" className="flex items-center gap-2">
              <div className="bg-white rounded-full w-8 h-8 relative" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} width="14" height="14" viewBox="0 0 24 24" fill="#006943" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.286 15c0 1.183-0.96 2.143-2.143 2.143s-2.143-0.96-2.143-2.143 0.96-2.143 2.143-2.143 2.143 0.96 2.143 2.143zM10 16.373c0.011 0.201-0.056 0.391-0.19 0.536-0.134 0.156-0.324 0.234-0.525 0.234h-1.507c-0.368 0-0.67-0.279-0.703-0.647-0.324-3.404-3.025-6.105-6.429-6.429-0.368-0.033-0.647-0.335-0.647-0.703v-1.507c0-0.201 0.078-0.391 0.234-0.525 0.123-0.123 0.301-0.19 0.48-0.19h0.056c2.377 0.19 4.621 1.228 6.306 2.924 1.696 1.685 2.734 3.929 2.924 6.306zM15.714 16.395c0.011 0.19-0.056 0.379-0.201 0.525-0.134 0.145-0.313 0.223-0.513 0.223h-1.596c-0.379 0-0.692-0.29-0.714-0.67-0.368-6.484-5.536-11.652-12.020-12.031-0.379-0.022-0.67-0.335-0.67-0.703v-1.596c0-0.201 0.078-0.379 0.223-0.513 0.134-0.134 0.313-0.201 0.491-0.201h0.033c3.906 0.201 7.578 1.842 10.346 4.621 2.779 2.768 4.42 6.44 4.621 10.346z" />
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
