import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, X, ChevronUp, ChevronDown, CheckCircle, Scale, Settings, Disc, Shield, MessageCircle } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919391899088';

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%230A1628'/%3E%3Ccircle cx='70' cy='100' r='30' fill='none' stroke='%230066FF' stroke-width='3' opacity='0.4'/%3E%3Ccircle cx='130' cy='100' r='30' fill='none' stroke='%230066FF' stroke-width='3' opacity='0.4'/%3E%3Ctext x='100' y='140' text-anchor='middle' fill='%23334466' font-size='10'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function CompareBar() {
  const { t } = useTranslation();
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [expanded, setExpanded] = useState(false);

  if (compareList.length === 0) return null;

  const canCompare = compareList.length === 2;

  // Extract features helper
  const getFeaturesList = (cycle) => {
    const specs = cycle.specifications || {};
    return [
      { name: t('compare.gears'), value: specs.gears ? t('compare.speedValue', { count: specs.gears }) : null, icon: Settings },
      { name: t('compare.brakes', 'Brakes'), value: specs.brakeType || null, icon: Disc },
      { name: t('compare.suspension', 'Suspension'), value: specs.suspension || null, icon: CheckCircle },
      { name: t('compare.material', 'Material'), value: specs.frameMaterial || null, icon: Shield },
      { name: t('compare.weight', 'Weight'), value: specs.weight || null, icon: Scale },
    ].filter(f => f.value);
  };

  return (
    <>
      {/* ── Sticky bottom bar ───────────────────────────────────────────── */}
      <motion.div
        initial={{ y: 120 }}
        animate={{ y: 0 }}
        exit={{ y: 120 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-40"
        style={{
          background: 'rgba(5, 10, 25, 0.92)',
          backdropFilter: 'blur(24px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
          borderTop: '1px solid rgba(0,102,255,0.2)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-4 flex-wrap">

            {/* Label */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(0,102,255,0.15)', border: '1px solid rgba(0,102,255,0.3)' }}>
                <GitCompare size={15} className="text-primary" />
              </div>
              <div>
                <span className="text-white text-sm font-bold">{t('compare.compareBarTitle')}</span>
                <span className="text-gray-400 text-xs ml-1.5">({compareList.length}/2)</span>
              </div>
            </div>

            {/* Selected cycles */}
            <div className="flex gap-2 flex-1 flex-wrap">
              {compareList.map((cycle) => (
                <motion.div
                  key={cycle._id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <img
                    src={cycle.images?.[0]?.url || PLACEHOLDER_IMAGE}
                    alt={cycle.name}
                    className="w-7 h-7 rounded-lg object-cover"
                    onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                  />
                  <span className="text-white text-xs font-semibold max-w-[120px] truncate">{cycle.name}</span>
                  <button
                    onClick={() => removeFromCompare(cycle._id)}
                    className="w-5 h-5 rounded-md flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              ))}
              {compareList.length < 2 && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dashed border-white/15 text-gray-500 text-xs">
                  {t('compare.selectAnother')}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={clearCompare}
                className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
              >
                {t('compare.clearAll')}
              </button>
              {canCompare ? (
                <motion.button
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  onClick={() => setExpanded(!expanded)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #0066FF, #0044BB)',
                    boxShadow: '0 0 20px rgba(0,102,255,0.35)',
                  }}
                >
                  {expanded ? t('compare.hide') : t('compare.compareNow')}
                  {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </motion.button>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 bg-white/5 border border-white/10 cursor-not-allowed"
                >
                  {t('compare.select2')}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Full comparison overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {expanded && canCompare && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(false)}
              className="fixed inset-0 z-[45] bg-black/70 backdrop-blur-sm"
            />

            {/* Comparison panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 32 }}
              className="fixed inset-x-0 bottom-0 z-[46] max-h-[85vh] overflow-y-auto rounded-t-3xl"
              style={{
                background: 'rgba(5, 10, 25, 0.97)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                borderTop: '1px solid rgba(0,102,255,0.2)',
                boxShadow: '0 -16px 60px rgba(0,0,0,0.6)',
              }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-white/15" />
              </div>

              {/* Header */}
              <div className="px-6 pb-5 flex items-center justify-between border-b border-white/[0.06]">
                <div>
                  <h2 className="font-display font-bold text-2xl text-white tracking-tight">
                    {t('compare.cycleWord')} <span style={{
                      background: 'linear-gradient(135deg, #00D4FF, #0066FF)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>{t('compare.comparisonWord')}</span>
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">{t('compare.sideBySideSub')}</p>
                </div>
                <button
                  onClick={() => setExpanded(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* ── Comparison content ─────────────────────────────────── */}
              <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">

                {/* Cycle header cards */}
                <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: `150px 1fr 1fr` }}>
                  {/* Empty top-left cell */}
                  <div className="flex flex-col justify-center">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t('compare.showroomModel')}</span>
                  </div>
                  {compareList.map((cycle) => (
                    <motion.div
                      key={cycle._id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center text-center rounded-2xl p-5 relative group"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <img
                        src={cycle.images?.[0]?.url || PLACEHOLDER_IMAGE}
                        alt={cycle.name}
                        className="w-full aspect-[4/3] rounded-xl object-cover mb-4 shadow-lg"
                        onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                      />
                      <p className="text-[10px] font-bold tracking-wider uppercase mb-1"
                        style={{ color: '#0066FF' }}>
                        {cycle.brand}
                      </p>
                      <h3 className="font-display font-bold text-lg text-white leading-tight mb-3">
                        {cycle.name}
                      </h3>
                      <div className="flex gap-3 mt-auto">
                        <Link
                          to={`/cycles/${cycle._id}`}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          {t('collection.viewDetails')}
                        </Link>
                        <a
                          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello Laxmi Cycles Store,\nI am interested in ${cycle.name}.\nPlease provide more details.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-green-400 hover:underline flex items-center gap-1"
                        >
                          <MessageCircle size={12} />
                          {t('compare.whatsapp', 'WhatsApp')}
                        </a>
                      </div>
                      {/* Remove button */}
                      <button
                        onClick={() => removeFromCompare(cycle._id)}
                        className="absolute top-3 right-3 w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Comparison table */}
                <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-dark-900/50">
                  
                  {/* Brand Row */}
                  <div className="grid items-center border-b border-white/[0.04]" style={{ gridTemplateColumns: '150px 1fr 1fr' }}>
                    <div className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('compare.brand')}</div>
                    {compareList.map((c, i) => (
                      <div key={i} className="px-6 py-4 text-center text-sm font-semibold text-white">
                        {c.brand || '—'}
                      </div>
                    ))}
                  </div>

                  {/* Size Row */}
                  <div className="grid items-center border-b border-white/[0.04]" style={{ gridTemplateColumns: '150px 1fr 1fr' }}>
                    <div className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('compare.size')}</div>
                    {compareList.map((c, i) => {
                      const wheel = c.specifications?.wheelSize;
                      const frame = c.specifications?.frameSize;
                      return (
                        <div key={i} className="px-6 py-4 text-center text-sm font-semibold text-white">
                          {wheel ? t('compare.wheelValue', { size: wheel }) : ''}
                          {wheel && frame ? ' / ' : ''}
                          {frame ? t('compare.frameValue', { size: frame }) : ''}
                          {!wheel && !frame ? '—' : ''}
                        </div>
                      );
                    })}
                  </div>

                  {/* Colour Row */}
                  <div className="grid items-center border-b border-white/[0.04]" style={{ gridTemplateColumns: '150px 1fr 1fr' }}>
                    <div className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('compare.color')}</div>
                    {compareList.map((c, i) => (
                      <div key={i} className="px-6 py-4 text-center text-sm font-semibold text-white">
                        {c.specifications?.color || c.color || '—'}
                      </div>
                    ))}
                  </div>

                  {/* Price Row */}
                  <div className="grid items-center border-b border-white/[0.04]" style={{ gridTemplateColumns: '150px 1fr 1fr' }}>
                    <div className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('compare.price')}</div>
                    {compareList.map((c, i) => (
                      <div key={i} className="px-6 py-4 text-center">
                        <span className="text-base font-bold" style={{
                          background: 'linear-gradient(135deg, #ffffff, #00D4FF)',
                          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>
                          {c.price ? `₹${c.price.toLocaleString('en-IN')}` : '—'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Features Row */}
                  <div className="grid border-b border-white/[0.04]" style={{ gridTemplateColumns: '150px 1fr 1fr' }}>
                    <div className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('compare.features', 'Features')}</div>
                    {compareList.map((c, i) => {
                      const features = getFeaturesList(c);
                      return (
                        <div key={i} className="px-6 py-5 flex flex-col gap-3">
                          {features.length > 0 ? (
                            features.map((f, fi) => {
                              const Icon = f.icon;
                              return (
                                <div key={fi} className="flex items-center gap-2.5 text-xs text-gray-300 bg-white/[0.02] border border-white/[0.04] p-2 rounded-xl">
                                  <Icon size={14} className="text-primary" />
                                  <span className="font-medium text-gray-400">{f.name}:</span>
                                  <span className="text-white font-semibold">{f.value}</span>
                                </div>
                              );
                            })
                          ) : (
                            <span className="text-gray-500 text-sm text-center">{t('compare.noSpecs')}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* Price Verdict Card */}
                {compareList[0].price && compareList[1].price && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-2xl p-5 text-center"
                    style={{
                      background: 'rgba(0,102,255,0.05)',
                      border: '1px solid rgba(0,102,255,0.15)',
                    }}
                  >
                    <p className="text-gray-400 text-xs tracking-wider uppercase mb-1">{t('compare.verdictPriceDiff')}</p>
                    <p className="font-display font-bold text-xl text-white">
                      ₹{Math.abs(compareList[0].price - compareList[1].price).toLocaleString('en-IN')}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {compareList[0].price < compareList[1].price
                        ? t('compare.verdictValueChoice', { name: compareList[0].name })
                        : compareList[0].price > compareList[1].price
                          ? t('compare.verdictValueChoice', { name: compareList[1].name })
                          : t('compare.verdictMatchPerfect')}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
