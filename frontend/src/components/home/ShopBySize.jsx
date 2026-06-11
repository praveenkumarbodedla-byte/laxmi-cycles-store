import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ── Size data ─────────────────────────────────────────────────────────── */
const SIZES = [
  { inches: 16, categoryKey: 'sizes.kids',   ageKey: 'sizes.age16', descKey: 'sizes.desc16', color: '#FF6B9D', colorGlow: 'rgba(255,107,157,0.2)' },
  { inches: 18, categoryKey: 'sizes.kids',   ageKey: 'sizes.age18', descKey: 'sizes.desc18', color: '#FF9F43', colorGlow: 'rgba(255,159,67,0.2)' },
  { inches: 20, categoryKey: 'sizes.junior', ageKey: 'sizes.age20', descKey: 'sizes.desc20', color: '#FECA57', colorGlow: 'rgba(254,202,87,0.2)' },
  { inches: 24, categoryKey: 'sizes.teen',   ageKey: 'sizes.age24', descKey: 'sizes.desc24', color: '#48DBFB', colorGlow: 'rgba(72,219,251,0.2)' },
  { inches: 26, categoryKey: 'sizes.adults', ageKey: 'sizes.age26', descKey: 'sizes.desc26', color: '#0066FF', colorGlow: 'rgba(0,102,255,0.2)' },
  { inches: 30, categoryKey: 'sizes.adults', ageKey: 'sizes.age30', descKey: 'sizes.desc30', color: '#00D4FF', colorGlow: 'rgba(0,212,255,0.2)' },
];

/* ── Wheel SVG icon ────────────────────────────────────────────────────── */
function WheelIcon({ size = 72, color, inches }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <defs>
        <filter id={`glow-${inches}`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Tyre */}
      <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
      {/* Rim */}
      <circle cx="40" cy="40" r="30" fill="none" stroke={color} strokeWidth="2" opacity="0.8" filter={`url(#glow-${inches})`} />
      <circle cx="40" cy="40" r="26" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      {/* Spokes */}
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <line
            key={i}
            x1="40" y1="40"
            x2={40 + 28 * Math.cos(a)}
            y2={40 + 28 * Math.sin(a)}
            stroke={color}
            strokeWidth="0.8"
            opacity="0.4"
          />
        );
      })}
      {/* Hub */}
      <circle cx="40" cy="40" r="6" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <circle cx="40" cy="40" r="2.5" fill={color} opacity="0.6" />
      {/* Size number */}
      <text x="40" y="44" textAnchor="middle" fill="white" fontSize="12" fontWeight="800" fontFamily="Inter, Arial, sans-serif">
        {inches}"
      </text>
    </svg>
  );
}

/* ── Card variants ─────────────────────────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.92 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.65, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const getCategoryGlow = (categoryKey) => {
  if (categoryKey === 'sizes.kids')   return 'rgba(255,107,157,0.25)';
  if (categoryKey === 'sizes.junior') return 'rgba(254,202,87,0.25)';
  if (categoryKey === 'sizes.teen')   return 'rgba(72,219,251,0.25)';
  if (categoryKey === 'sizes.adults') return 'rgba(0,102,255,0.25)';
  return 'rgba(255,255,255,0.1)';
};

export default function ShopBySize() {
  const { t } = useTranslation();
  return (
    <section id="sizes" className="relative py-16 md:py-28 px-4 overflow-hidden scroll-mt-20">

      {/* ── Background ────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(0,30,80,0.06) 50%, transparent 100%)' }} />
        <div className="absolute inset-0 bg-noise opacity-40" />
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }} />
        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-8 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(0,212,255,0.6))' }} />
            <span className="text-accent text-[11px] font-bold tracking-[0.4em] uppercase">{t('sizes.sectionLabel')}</span>
            <div className="w-8 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(0,212,255,0.6))' }} />
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 tracking-tight">
            {t('sizes.sectionTitle')}{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ffffff, #00D4FF, #0066FF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{t('sizes.sectionTitleHighlight')}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            {t('sizes.sectionDescription')}
          </p>
        </motion.div>

        {/* ── Size cards grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {SIZES.map((s, i) => (
            <motion.div
              key={s.inches}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
            >
              <Link
                to={`/cycles?size=${s.inches}`}
                className="group relative flex flex-col items-center text-center rounded-2xl p-4 md:p-6 pb-5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-2xl"
                style={{
                  background: 'rgba(8, 16, 32, 0.65)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* ── Top glow line ─── */}
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(to right, transparent, ${s.color}, transparent)` }}
                />

                {/* ── Breathing background glow (slow pulsing) ─── */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    opacity: [0.12, 0.28, 0.12],
                  }}
                  transition={{
                    duration: 3.5 + (s.inches % 3) * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ background: `radial-gradient(ellipse at 50% 30%, ${getCategoryGlow(s.categoryKey)}, transparent 65%)` }}
                />

                {/* ── Stronger hover glow ─── */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 30%, ${getCategoryGlow(s.categoryKey)}, transparent 60%)` }}
                />

                {/* ── Wheel icon ─── */}
                <div className="relative mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[15deg]">
                  <WheelIcon color={s.color} inches={s.inches} />
                  <div
                    className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                    style={{ background: getCategoryGlow(s.category) }}
                  />
                </div>

                {/* ── Category badge ─── */}
                <span
                  className="text-[10px] font-bold tracking-[0.3em] uppercase px-3 py-1 rounded-full mb-3 transition-all duration-300 border"
                  style={{
                    color: s.color,
                    borderColor: `${s.color}30`,
                    background: `${s.color}10`,
                  }}
                >
                  {t(s.categoryKey)}
                </span>

                {/* ── Size & Age Row (Responsive: side-by-side on mobile, stacked on desktop) ─── */}
                <div className="w-full flex md:flex-col items-center justify-between md:justify-center gap-1.5 mb-4 px-2 md:px-0">
                  {/* Size label */}
                  <h3 className="font-display font-bold text-lg md:text-2xl text-white tracking-tight leading-none">
                    {s.inches}<span className="text-xs md:text-sm text-gray-400 font-semibold ml-1">{t('sizes.inch')}</span>
                  </h3>

                  {/* Age range */}
                  <p className="text-gray-400 md:text-gray-500 text-[10px] md:text-[11px] tracking-wider font-semibold leading-none">
                    {t(s.ageKey)}
                  </p>
                </div>

                {/* ── Description (desktop/tablet only) ─── */}
                <p className="hidden md:block text-gray-400 text-xs leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-300 line-clamp-2">
                  {t(s.descKey)}
                </p>

                {/* ── Explore arrow ─── */}
                <div className="mt-auto flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 group-hover:gap-2"
                  style={{ color: s.color }}>
                  {t('sizes.view')}
                  <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>

                {/* ── Corner marks ─── */}
                {['top-2.5 left-2.5 border-t border-l', 'top-2.5 right-2.5 border-t border-r', 'bottom-2.5 left-2.5 border-b border-l', 'bottom-2.5 right-2.5 border-b border-r'].map((cls) => (
                  <div
                    key={cls}
                    className={`absolute w-2.5 h-2.5 ${cls} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                    style={{ borderColor: s.color }}
                  />
                ))}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Size guide footer ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-14 text-center"
        >
          <p className="text-gray-500 text-sm mb-4">
            {t('sizes.sizeGuide')}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:gap-3"
            style={{
              background: 'linear-gradient(135deg, #00D4FF, #0066FF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            {t('sizes.getSizeAdvice')}
            <ArrowRight size={14} className="text-accent" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
