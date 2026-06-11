import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import BrandShowcase from '../components/home/BrandShowcase';
import ShopBySize from '../components/home/ShopBySize';
import FeaturedCycles from '../components/home/FeaturedCycles';
import ComparePreviewSection from '../components/home/ComparePreviewSection';
import GallerySection from '../components/home/GallerySection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import ContactSection from '../components/home/ContactSection';

/*
  Homepage section order (must match NAV_ITEMS order exactly):
  #hero        → Home
  #brands      → Brands
  #sizes       → Sizes
  #collection  → Collection
  #compare     → Compare Cycles
  #gallery     → Gallery
  #reviews     → Reviews
  #contact     → Contact
*/
export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      if (location.hash) {
        // Scroll to hash-targeted section (e.g. /#brands, /#sizes, /#collection, etc.)
        const tryScroll = (attempts = 0) => {
          const el = document.querySelector(location.hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else if (attempts < 15) {
            setTimeout(() => tryScroll(attempts + 1), 100);
          }
        };
        requestAnimationFrame(() => setTimeout(() => tryScroll(), 60));
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      {/* 1. Home */}
      <HeroSection key={location.key} />
      <StatsSection />

      {/* 2. Brands */}
      <BrandShowcase />

      {/* 3. Sizes */}
      <ShopBySize />

      {/* 4. Collection */}
      <FeaturedCycles />

      {/* 5. Compare Cycles */}
      <ComparePreviewSection />

      {/* 6. Gallery */}
      <GallerySection />

      {/* 7. Reviews */}
      <TestimonialsSection />

      {/* 8. Contact */}
      <ContactSection />
    </>
  );
}
