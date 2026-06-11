import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GALLERY_IMAGES = [
  {
    id: 1,
    url: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT8nUD2_Qj8kn2IlPv0IwuKk4P8JFA8-EaC8dgrIo0PQd2icl38WHCGQ2Gepg4yFVQS2gSKDbk92_Hg7x3Me6LsiMVJZcNrA-4CKNF3OxJjCpUxh1OGw1B7',
    title: 'Hero Sprint Pro Display',
    category: 'showroom',
    desc: 'The flagship Hero Sprint Pro cycle displayed on our modern showroom stand.'
  },
  {
    id: 2,
    url: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSzAegasl8OwjduG_r_VC3Zmo-29V5sA-SZJXwFhKYWvf_aIrROKusijE2ucFpj2fyanYjj7_rAjWRorx9zOFScdE-36pYkG4zMYNu0FxIiYE7Dmp3-SdgP0A',
    title: 'Vesco Road Beast',
    category: 'cycles',
    desc: 'Premium aerodynamics and lightweight carbon frame engineered for high velocity.'
  },
  {
    id: 3,
    url: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSTeUTICE3X1BbHOgZ3I5xXoxmAFWVdBJdiSGzxW_RiJXfFNzRpIPjlfs4reZIbJnMZ0Z_hiQVLgH0EmkymgQ2W0xdOjoDFPEZW0Jkm9gOdTftfZGJviAp1',
    title: 'Sun Bride Urban Showcase',
    category: 'showroom',
    desc: 'State-of-the-art hybrid cycle configured at our showroom fitting station.'
  },
  {
    id: 4,
    url: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRZNQt2ojiTV7KuIpM6SqPhwNL3KmBv4G1KusVcdWxWYze18IhC5IG_0eu_QDOizpBRu3Hlzybyc6nPt1DgmTFct1T0PYumZk0rhHIyMRo',
    title: 'Afro Alpha Trailblazer',
    category: 'cycles',
    desc: 'Equipped with heavy-duty mountain suspension and all-terrain traction control.'
  },
  {
    id: 5,
    url: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRukNZbgRXV4buwLS2FPK4sDpxqBEgiFhwSO77y6IEWxVnegD1e1iquH0F5MexPCcjYpkoEladSvq9QboJdMDumMR_R248mCM6HUUVyULJ-UzFUDfHfxfg8',
    title: 'Happy Rider on City Trails',
    category: 'riders',
    desc: 'A proud customer exploring the Hyderabad trails on their new Laxmi cycle.'
  },
  {
    id: 6,
    url: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRbKDA_d1KImO60FZMENIuhz5f_x-ni5AAtaT09OK8SFb_esIBf-vMbnLjed6cUjCuI-bmAKTyWxCSte7WdaqRO8tyckAuroq8Mw69_DegvDBPoT9NRhugA5Sw',
    title: 'Showroom Interior Glow',
    category: 'showroom',
    desc: 'Modern industrial showroom styling with ambient highlights and displays.'
  },
  {
    id: 7,
    url: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTao6rqmw8oHu_iIBi8MzZShERbfI8OtKSGLlzRuqVdTuR-lg4ITpxw3ZOgPou3judqaMGH3bhZ2b2v1N7g1pU-l2iVk55K4UCsmNDLyiFYrXqoXSKIyrvW',
    title: 'Vesco Special Edition',
    category: 'cycles',
    desc: 'Exquisite attention to frame detailing and premium design craftsmanship.'
  },
  {
    id: 8,
    url: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTi6gL0i1jijuVvLMMu0h-yPGEPvEghJPVYgEG49Cdbq5DZ0IrutQjgyifrY6CmrUuu-y2z1L1jQRxgrSvM6kJTRpMLK7MbpA-IqbcKr5SeC08oqW8vtqUM',
    title: 'Laxmi Cycling Club Ride',
    category: 'riders',
    desc: 'Weekend group rides connecting cycle enthusiasts across the community.'
  }
];

export default function GallerySection() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredImages = filter === 'all'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === filter);

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <section id="gallery" className="relative py-16 md:py-28 px-4 overflow-hidden scroll-mt-16 bg-dark-900/50">

      {/* ── Background Elements ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/4 blur-[120px] rounded-full" />
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent text-sm font-semibold tracking-widest uppercase mb-3"
          >
            — {t('gallery.sectionLabel')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title gradient-text mb-4"
          >
            {t('gallery.sectionTitle')} {t('gallery.sectionTitleHighlight')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed"
          >
            {t('gallery.sectionDescription')}
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-3 flex-wrap mb-10">
          {[
            { labelKey: 'gallery.filtersAll', value: 'all' },
            { labelKey: 'gallery.filtersShowroom', value: 'showroom' },
            { labelKey: 'gallery.filtersCycles', value: 'cycles' },
            { labelKey: 'gallery.filtersRiders', value: 'riders' }
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${filter === btn.value
                ? 'bg-primary border-primary text-white shadow-glow-blue'
                : 'bg-white/[0.02] border-white/10 text-gray-400 hover:border-primary/50 hover:text-white'
                }`}
            >
              {t(btn.labelKey)}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, index) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="group relative h-[160px] md:h-[200px] lg:h-[280px] rounded-2xl overflow-hidden cursor-pointer bg-dark-800 border border-white/5 shadow-md hover:shadow-primary/5 transition-all duration-300"
                onClick={() => setLightboxIndex(index)}
              >
                {/* Image zoom on hover */}
                <img
                  src={img.url}
                  alt={t(`gallery.images.img${img.id}.title`)}
                  className="w-full h-full object-cover transition-transform duration-700 ease-[0.16, 1, 0.3, 1] group-hover:scale-105"
                  loading="lazy"
                />

                {/* Ambient glow edge */}
                <div className="absolute inset-0 border border-white/0 group-hover:border-primary/30 rounded-2xl transition-all duration-500 pointer-events-none" />

                {/* Dark Overlay with details on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-5">

                  {/* Eye Icon Floating */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white translate-y-[-10px] md:group-hover:translate-y-0 transition-transform duration-300">
                    <Eye size={14} />
                  </div>

                  <span className="text-[9px] font-bold text-primary tracking-wider uppercase mb-0.5">
                    {t(`gallery.categories.${img.category}`)}
                  </span>
                  <h3 className="font-display font-bold text-white text-xs md:text-sm leading-tight mb-0.5">
                    {t(`gallery.images.img${img.id}.title`)}
                  </h3>
                  <p className="text-gray-400 text-[10px] leading-normal line-clamp-1 md:line-clamp-2">
                    {t(`gallery.images.img${img.id}.desc`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md">

            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all z-[110]"
            >
              <X size={20} />
            </button>

            {/* Backdrop click close */}
            <div className="absolute inset-0" onClick={() => setLightboxIndex(null)} />

            {/* Carousel navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all z-10"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all z-10"
            >
              <ChevronRight size={24} />
            </button>

            {/* Main view container */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative max-w-4xl max-h-[80vh] px-4 flex flex-col items-center pointer-events-none"
            >
              <img
                src={filteredImages[lightboxIndex].url}
                alt={t(`gallery.images.img${filteredImages[lightboxIndex].id}.title`)}
                className="max-w-full max-h-[70vh] rounded-2xl object-contain shadow-2xl border border-white/10"
              />

              <div className="text-center mt-4 pointer-events-auto">
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase block mb-1">
                  {t(`gallery.categories.${filteredImages[lightboxIndex].category}`)}
                </span>
                <h3 className="font-display font-bold text-white text-lg">
                  {t(`gallery.images.img${filteredImages[lightboxIndex].id}.title`)}
                </h3>
                <p className="text-gray-400 text-xs mt-1 max-w-md">
                  {t(`gallery.images.img${filteredImages[lightboxIndex].id}.desc`)}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
