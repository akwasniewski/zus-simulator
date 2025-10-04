import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato } from "next/font/google";
import Header from './components/header/zusheader'
import "./globals.css";
import Footer from "./components/footer/Footer";
import FunFactsCarousel from './components/FunFact';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pension Calculator - Plan Your Retirement",
  description: "Calculate your future pension with our easy-to-use retirement planning tool. Enter your current age, salary, and retirement plans to see your projected pension.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Header />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} antialiased`}
      >
        {children}
      
      <FunFactsCarousel />
      <Footer />
      </body>
    </html>
  );
}
