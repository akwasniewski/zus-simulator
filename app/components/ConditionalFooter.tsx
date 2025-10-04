'use client';

import { usePathname } from 'next/navigation';
import Footer from './footer/Footer';
import FunFactsCarousel from './FunFact';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Don't show footer and fun facts on telemetry page
  const showFooter = pathname !== '/telemetry';
  
  if (!showFooter) {
      return <Footer />
  }
  
  return (
    <>
      <FunFactsCarousel />
      <Footer />
    </>
  );
}