import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Brand data uses i18n keys for tagline and description; name is NOT translated.
const BRANDS = [
  {
    name: 'Hero',
    taglineKey: 'brands.hero.tagline',
    descriptionKey: 'brands.hero.description',
    accent: '#FF3B30',
    accentGlow: 'rgba(255,59,48,0.25)',
    filterKey: 'hero',
    icon: (
      <svg viewBox="0 0 64 64" className="w-10 h-10 md:w-[52px] md:h-[52px]" fill="none">
        <rect x="4" y="14" width="56" height="36" rx="8" stroke="currentColor" strokeWidth="2.5" />
        <text x="32" y="39" textAnchor="middle" fill="currentColor" fontSize="18" fontWeight="800" fontFamily="Arial, sans-serif" letterSpacing="3">HERO</text>
      </svg>
    ),
  },
  {
    name: 'Vesco',
    taglineKey: 'brands.vesco.tagline',
    descriptionKey: 'brands.vesco.description',
    accent: '#0A84FF',
    accentGlow: 'rgba(10,132,255,0.25)',
    filterKey: 'vesco',
    icon: (
      <svg viewBox="0 0 64 64" className="w-10 h-10 md:w-[52px] md:h-[52px]" fill="none">
        <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="2.5" />
        <path d="M18 38 L28 22 L38 38 L32 30 Z" fill="currentColor" opacity="0.9" />
        <text x="32" y="52" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="2">VESCO</text>
      </svg>
    ),
  },
  {
    name: 'Sun Bride',
    taglineKey: 'brands.sunbride.tagline',
    descriptionKey: 'brands.sunbride.description',
    accent: '#FFD60A',
    accentGlow: 'rgba(255,214,10,0.2)',
    filterKey: 'sun-bride',
    icon: (
      <svg viewBox="0 0 64 64" className="w-10 h-10 md:w-[52px] md:h-[52px]" fill="none">
        <circle cx="32" cy="28" r="10" stroke="currentColor" strokeWidth="2.5" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
          const x1 = 32 + 14 * Math.cos(a), y1 = 28 + 14 * Math.sin(a);
          const x2 = 32 + 20 * Math.cos(a), y2 = 28 + 20 * Math.sin(a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />;
        })}
        <text x="32" y="58" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="1.5">SUN BRIDE</text>
      </svg>
    ),
  },
  {
    name: 'Afro',
    taglineKey: 'brands.afro.tagline',
    descriptionKey: 'brands.afro.description',
    accent: '#30D158',
    accentGlow: 'rgba(48,209,88,0.2)',
    filterKey: 'afro',
    icon: (
      <svg viewBox="0 0 64 64" className="w-10 h-10 md:w-[52px] md:h-[52px]" fill="none">
        <path d="M32 6 L58 50 L6 50 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M32 20 L44 44 L20 44 Z" fill="currentColor" opacity="0.15" />
        <text x="32" y="42" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="800" fontFamily="Arial, sans-serif" letterSpacing="2">AFRO</text>
      </svg>
    ),
  },
];

/* ── Card animation variants ───────────────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function BrandShowcase() {
  const { t } = useTranslation();
  return (
    <section id="brands" className="relative py-16 md:py-28 px-4 overflow-hidden scroll-mt-20">

      {/* ── Background atmosphere ─────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,60,140,0.08) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 bg-noise opacity-40" />
        {/* Horizontal divider lines */}
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }} />
        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">

        {/* ── Section header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-8 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(0,212,255,0.6))' }} />
            <span className="text-accent text-[11px] font-bold tracking-[0.4em] uppercase">{t('brands.sectionLabel')}</span>
            <div className="w-8 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(0,212,255,0.6))' }} />
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 tracking-tight">
            {t('brands.sectionTitle')} <span style={{
              background: 'linear-gradient(135deg, #ffffff, #00D4FF, #0066FF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>{t('brands.sectionTitleHighlight')}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            {t('brands.sectionDescription')}
          </p>
        </motion.div>

        {/* ── Brand cards grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {BRANDS.map((brand, i) => (
            <motion.div
              key={brand.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background: 'rgba(8, 16, 32, 0.7)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* ── Top accent glow ─── */}
              <div
                className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                style={{ background: `linear-gradient(to right, transparent, ${brand.accent}, transparent)` }}
              />
              {/* ── Background glow on hover ─── */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${brand.accentGlow}, transparent 70%)` }}
              />

              {/* ── Card content ─── */}
              <div className="relative p-4 md:p-7 flex flex-col items-center text-center">

                {/* Logo icon */}
                <motion.div
                  className="mb-3 md:mb-5 transition-all duration-500 group-hover:scale-110"
                  style={{ color: brand.accent }}
                >
                  <div className="relative">
                    {brand.icon}
                    {/* Glow behind icon */}
                    <div
                      className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-full"
                      style={{ background: brand.accentGlow }}
                    />
                  </div>
                </motion.div>

                {/* Brand name */}
                <h3 className="font-display font-bold text-lg md:text-xl text-white mb-1 tracking-wide group-hover:tracking-wider transition-all duration-300">
                  {brand.name}
                </h3>

                {/* Tagline */}
                <p className="text-[9px] md:text-[11px] font-semibold tracking-[0.15em] md:tracking-[0.25em] uppercase mb-0 md:mb-4 transition-colors duration-300"
                  style={{ color: brand.accent }}>
                  {t(brand.taglineKey)}
                </p>

                {/* Divider */}
                <div className="hidden md:block w-10 h-px mb-4 transition-all duration-500 group-hover:w-16"
                  style={{ background: `linear-gradient(to right, transparent, ${brand.accent}, transparent)` }} />

                {/* Description */}
                <p className="hidden md:block text-gray-400 text-sm leading-relaxed mb-5 group-hover:text-gray-300 transition-colors duration-300">
                  {t(brand.descriptionKey)}
                </p>

                {/* Explore link */}
                <Link
                  to={`/cycles?brand=${brand.name.toLowerCase().replace(/ /g, '-')}`}
                  className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-semibold tracking-wider uppercase transition-all duration-300 group-hover:gap-2.5 mt-3 md:mt-0"
                  style={{ color: brand.accent }}
                >
                  {t('brands.explore')}
                  <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* ── Bottom border glow ─── */}
              <div
                className="absolute bottom-0 left-1/4 right-1/4 h-px transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:left-[10%] group-hover:right-[10%]"
                style={{ background: `linear-gradient(to right, transparent, ${brand.accent}80, transparent)` }}
              />

              {/* ── Corner marks ─── */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t border-l rounded-tl-sm opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                style={{ borderColor: brand.accent }} />
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r rounded-tr-sm opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                style={{ borderColor: brand.accent }} />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l rounded-bl-sm opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                style={{ borderColor: brand.accent }} />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r rounded-br-sm opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                style={{ borderColor: brand.accent }} />
            </motion.div>
          ))}
        </div>

        {/* ── Bottom trust strip ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="hidden md:flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mt-14"
        >
          {[
            [t('brands.stat1Value'), t('brands.stat1Label')],
            [t('brands.stat2Value'), t('brands.stat2Label')],
            [t('brands.stat3Value'), t('brands.stat3Label')],
          ].map(([val, label]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="font-display font-bold text-lg text-white" style={{ textShadow: '0 0 16px rgba(0,212,255,0.3)' }}>{val}</span>
              <span className="text-gray-500 text-xs tracking-wider">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
