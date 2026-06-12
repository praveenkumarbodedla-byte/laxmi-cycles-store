import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, MessageCircle, CheckCircle, XCircle, GitCompare, Palette, Ruler, Tag } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { useTranslation } from 'react-i18next';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919848116926';

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230A1628'/%3E%3Ccircle cx='120' cy='200' r='60' fill='none' stroke='%230066FF' stroke-width='6' opacity='0.5'/%3E%3Ccircle cx='280' cy='200' r='60' fill='none' stroke='%230066FF' stroke-width='6' opacity='0.5'/%3E%3Cpath d='M120 200L170 120H240L275 180' fill='none' stroke='%2300D4FF' stroke-width='5' opacity='0.4'/%3E%3Ctext x='200' y='280' text-anchor='middle' fill='%23334466' font-size='14' font-family='Inter'%3ENo Image%3C/text%3E%3C/svg%3E";

/* ── Brand accent colors ───────────────────────────────────────────────── */
const BRAND_COLORS = {
  'Hero':      { accent: '#FF3B30', glow: 'rgba(255,59,48,0.15)' },
  'Vesco':     { accent: '#0A84FF', glow: 'rgba(10,132,255,0.15)' },
  'Sun Bride': { accent: '#FFD60A', glow: 'rgba(255,214,10,0.12)' },
  'Afro':      { accent: '#30D158', glow: 'rgba(48,209,88,0.12)' },
};

export default function CycleCard({ cycle, hideCompare = false }) {
  const { t } = useTranslation();
  const { addToCompare, isInCompare } = useCompare();
  const inCompare = isInCompare(cycle._id);

  const imageUrl = cycle.images?.[0]?.url || PLACEHOLDER_IMAGE;
  const whatsappMsg = encodeURIComponent(
    `Hello Laxmi Cycles Store,\nI am interested in ${cycle.name}.\nPlease provide more details.`
  );

  const brand = BRAND_COLORS[cycle.brand] || { accent: '#0066FF', glow: 'rgba(0,102,255,0.15)' };
  const sizeLabel = cycle.specifications?.wheelSize || cycle.specifications?.frameSize || null;
  const colorLabel = cycle.specifications?.color || cycle.color || null;

  const getAvailabilityText = (availability, isAvailable) => {
    const status = availability || (isAvailable ? 'available' : 'out_of_stock');
    if (status === 'available') return t('cycles.inStock');
    if (status === 'limited_stock') return t('collection.limitedStock', 'Limited Stock');
    return t('cycles.outOfStock');
  };

  const statusVal = cycle.availability || (cycle.isAvailable ? 'available' : 'out_of_stock');

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(8, 16, 32, 0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Top accent glow line ─── */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(to right, transparent, ${brand.accent}, transparent)` }}
      />

      {/* ── Image section ──────────────────────────────────────────── */}
      <div className="relative overflow-hidden aspect-[4/3] bg-dark-700">
        <img
          src={imageUrl}
          alt={cycle.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,10,20,0.95)] via-[rgba(5,10,20,0.3)] to-transparent" />

        {/* ── Top badges ─── */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {/* Brand pill */}
          <span
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase"
            style={{
              color: brand.accent,
              background: `${brand.accent}18`,
              border: `1px solid ${brand.accent}30`,
              backdropFilter: 'blur(8px)',
            }}
          >
            {cycle.brand}
          </span>
          {cycle.isFeatured && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-gold/90 text-dark-900">
              ★ {t('cycles.featured', 'FEATURED')}
            </span>
          )}
        </div>

        {/* ── Stock badge ─── */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider border ${
              statusVal === 'available'
                ? 'bg-green-500/15 text-green-400 border-green-500/25'
                : statusVal === 'limited_stock'
                ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25'
                : 'bg-red-500/15 text-red-400 border-red-500/25'
            }`}
            style={{ backdropFilter: 'blur(8px)' }}
          >
            {statusVal === 'available' ? (
              <CheckCircle size={10} />
            ) : statusVal === 'limited_stock' ? (
              <CheckCircle size={10} className="text-yellow-400" />
            ) : (
              <XCircle size={10} />
            )}
            {getAvailabilityText(cycle.availability, cycle.isAvailable)}
          </span>
        </div>

        {/* ── Hover overlay actions ─── */}
        <div className="absolute inset-x-0 bottom-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-3 group-hover:translate-y-0 z-10">
          {statusVal === 'out_of_stock' ? (
            <button
              disabled
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold tracking-wider uppercase bg-red-500/10 text-red-400/50 border border-red-500/10 cursor-not-allowed"
              style={{ backdropFilter: 'blur(12px)' }}
            >
              {t('cycles.outOfStock')}
            </button>
          ) : (
            <>
              {!hideCompare && (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCompare(cycle); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all duration-300 ${
                    inCompare
                      ? 'bg-accent/20 text-accent border border-accent/40'
                      : 'bg-white/8 text-white border border-white/15 hover:border-primary/50 hover:bg-primary/10'
                  }`}
                  style={{ backdropFilter: 'blur(12px)' }}
                >
                  <GitCompare size={12} />
                  {inCompare ? t('compare.added') : t('compare.compareBarTitle')}
                </button>
              )}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`${
                  hideCompare ? 'w-full' : 'flex-1'
                } flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold tracking-wider uppercase bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-all duration-300`}
                style={{ backdropFilter: 'blur(12px)' }}
              >
                <MessageCircle size={12} />
                {t('compare.whatsapp', 'WhatsApp')}
              </a>
            </>
          )}
        </div>
      </div>

      {/* ── Content section ────────────────────────────────────────── */}
      <Link to={`/cycles/${cycle._id}`} className="block p-5 pb-4">

        {/* Model name */}
        <h3 className="font-display font-bold text-lg text-white mb-2 leading-tight group-hover:text-primary transition-colors duration-300 tracking-tight">
          {cycle.name}
        </h3>

        {/* Spec chips row */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {sizeLabel && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-gray-300 bg-white/[0.04] border border-white/[0.06]">
              <Ruler size={10} className="text-primary/70" />
              {sizeLabel.replace('inch', t('sizes.inch'))}
            </span>
          )}
          {colorLabel && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-gray-300 bg-white/[0.04] border border-white/[0.06]">
              <Palette size={10} className="text-primary/70" />
              {colorLabel}
            </span>
          )}
          {cycle.category && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-gray-300 bg-white/[0.04] border border-white/[0.06]">
              <Tag size={10} className="text-primary/70" />
              {t(`cycles.categories.${cycle.category}`, cycle.category)}
            </span>
          )}
          {cycle.specifications?.gears && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-gray-300 bg-white/[0.04] border border-white/[0.06]">
              {t('compare.speedValue', { count: cycle.specifications.gears })}
            </span>
          )}
        </div>

        {/* Price + View Details */}
        <div className="flex items-end justify-between pt-3 border-t border-white/[0.05]">
          <div>
            <p className="text-[10px] text-gray-500 tracking-wider uppercase mb-0.5">{t('cycles.price')}</p>
            <p className="font-display font-bold text-xl leading-none" style={{
              background: 'linear-gradient(135deg, #ffffff, #00D4FF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              ₹{cycle.price?.toLocaleString('en-IN') || '—'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary group-hover:gap-2.5 transition-all duration-300">
            <Eye size={14} />
            {t('collection.viewDetails')}
          </span>
        </div>
      </Link>

      {/* ── Corner marks ─── */}
      {['top-2 left-2 border-t border-l', 'top-2 right-2 border-t border-r', 'bottom-2 left-2 border-b border-l', 'bottom-2 right-2 border-b border-r'].map((cls) => (
        <div
          key={cls}
          className={`absolute w-2.5 h-2.5 ${cls} opacity-0 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none`}
          style={{ borderColor: brand.accent }}
        />
      ))}

      {/* ── Bottom glow ─── */}
      <div
        className="absolute bottom-0 left-1/4 right-1/4 h-px opacity-0 group-hover:opacity-100 group-hover:left-[10%] group-hover:right-[10%] transition-all duration-500"
        style={{ background: `linear-gradient(to right, transparent, ${brand.accent}60, transparent)` }}
      />
    </motion.article>
  );
}
