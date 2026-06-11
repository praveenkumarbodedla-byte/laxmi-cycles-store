import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitCompare, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCompare } from '../context/CompareContext';
import CompareBar from '../components/cycles/CompareBar';

export default function Compare() {
  const { t } = useTranslation();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const { compareList, removeFromCompare } = useCompare();

  return (
    <div className="min-h-screen pt-20 pb-40 bg-dark-800">
      {/* Header */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900 to-dark-800" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-primary/8 blur-3xl rounded-full pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-accent text-sm font-semibold tracking-widest uppercase mb-3"
          >
            — {t('compare.sideBySide')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="section-title gradient-text mb-4"
          >
            {t('compare.pageTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-gray-400"
          >
            {t('compare.sectionDescription')}
          </motion.p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-3xl p-10 relative overflow-hidden"
          style={{
            background: 'rgba(8, 16, 32, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Ambient glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(0,102,255,0.1)', border: '1px solid rgba(0,102,255,0.2)' }}
            >
              <GitCompare className="text-primary" size={26} />
            </div>

            <h2 className="font-display font-bold text-3xl text-white mb-4 tracking-tight">
              {t('compare.sectionTitle')}{' '}
              <span style={{
                background: 'linear-gradient(135deg, #00D4FF, #0066FF)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                {t('compare.sideBySideSub')}
              </span>
            </h2>

            {compareList.length === 0 && (
              <>
                <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed mb-8">
                  {t('compare.emptySubtitle')}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-gray-500 text-xs font-semibold">
                    {t('compare.selectedCount', { count: 0 })}
                  </div>
                  <Link
                    to="/cycles"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg, #0066FF, #0044BB)', boxShadow: '0 0 20px rgba(0,102,255,0.3)' }}
                  >
                    {t('compare.browseCollection')} <ArrowRight size={15} />
                  </Link>
                </div>
              </>
            )}

            {compareList.length === 1 && (
              <>
                <p className="text-gray-300 text-sm max-w-lg mx-auto leading-relaxed mb-6">
                  {t('compare.pickMore', { name: compareList[0].name })}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-white">
                    {compareList[0].images?.[0]?.url && (
                      <img src={compareList[0].images[0].url} alt="" className="w-6 h-6 rounded object-cover" />
                    )}
                    <span>{compareList[0].name}</span>
                  </div>
                  <span className="text-gray-500 text-xs font-bold">+</span>
                  <div className="px-3 py-1.5 rounded-xl border border-dashed border-white/10 text-gray-500 text-xs">
                    {t('compare.select2nd')}
                  </div>
                </div>
                <Link
                  to="/cycles"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #0066FF, #0044BB)', boxShadow: '0 0 20px rgba(0,102,255,0.3)' }}
                >
                  {t('compare.pick2nd')} <ArrowRight size={15} />
                </Link>
              </>
            )}

            {compareList.length >= 2 && (
              <>
                <p className="text-gray-300 text-sm max-w-lg mx-auto leading-relaxed mb-6">
                  {t('compare.readyCompare', { c1: compareList[0].name, c2: compareList[1].name })}
                </p>

                {/* Side-by-side comparison cards */}
                <div className="grid sm:grid-cols-2 gap-6 mt-8 text-left">
                  {compareList.slice(0, 2).map((cycle) => (
                    <div
                      key={cycle._id}
                      className="rounded-2xl p-5 relative"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      {cycle.images?.[0]?.url && (
                        <img
                          src={cycle.images[0].url}
                          alt={cycle.name}
                          className="w-full h-40 object-cover rounded-xl mb-4"
                        />
                      )}
                      <h3 className="font-bold text-white text-base mb-1">{cycle.name}</h3>
                      <p className="text-primary font-semibold text-sm mb-3">
                        ₹{cycle.price?.toLocaleString('en-IN')}
                      </p>
                      {cycle.brand && <p className="text-gray-400 text-xs mb-1">{t('compare.brand')}: <span className="text-white">{cycle.brand}</span></p>}
                      {cycle.category && <p className="text-gray-400 text-xs mb-1">{t('compare.category')}: <span className="text-white">{t(`cycles.categories.${cycle.category}`, cycle.category)}</span></p>}
                      {cycle.gearCount && <p className="text-gray-400 text-xs mb-1">{t('compare.gears')}: <span className="text-white">{t(`cycles.gears.${cycle.gearCount}`, cycle.gearCount)}</span></p>}
                      {cycle.frameSize && <p className="text-gray-400 text-xs mb-1">{t('compare.frame')}: <span className="text-white">{t('compare.frameValue', { size: cycle.frameSize })}</span></p>}
                      {cycle.weight && <p className="text-gray-400 text-xs mb-1">{t('compare.weight', 'Weight')}: <span className="text-white">{cycle.weight} kg</span></p>}
                      <button
                        onClick={() => removeFromCompare(cycle._id)}
                        className="mt-4 text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        {t('compare.remove')}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      <CompareBar />
    </div>
  );
}
