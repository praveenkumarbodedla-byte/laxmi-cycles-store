import { useEffect } from 'react';
import TestimonialsSection from '../components/home/TestimonialsSection';

export default function Reviews() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-dark-800">
      <TestimonialsSection />
    </div>
  );
}
