import { useEffect } from 'react';
import GallerySection from '../components/home/GallerySection';

export default function Gallery() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-dark-800">
      <GallerySection />
    </div>
  );
}
