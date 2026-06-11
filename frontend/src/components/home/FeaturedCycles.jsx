import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Bike } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import CycleCard from '../cycles/CycleCard';
import CycleListItem from '../cycles/CycleListItem';

export default function FeaturedCycles() {
  const { t } = useTranslation();
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/cycles/featured')
      .then((res) => setCycles(res.data.data))
      .catch(() => setCycles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="collection" className="relative py-16 md:py-28 px-4 overflow-hidden scroll-mt-20">

      {/* ── Background atmosphere ──────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(0,60,140,0.06) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 bg-noise opacity-40" />
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }} />
        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }} />
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[120px] opacity-30"
          style={{ background: 'radial-gradient(ellipse, rgba(0,102,255,0.1), transparent 70%)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">

        {/* ── Section header ──────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-8 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(0,212,255,0.6))' }} />
              <span className="text-accent text-[11px] font-bold tracking-[0.4em] uppercase">{t('collection.sectionLabel')}</span>
              <div className="w-8 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(0,212,255,0.6))' }} />
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight">
              {t('collection.sectionTitle')}{' '}
              <span style={{
                background: 'linear-gradient(135deg, #ffffff, #00D4FF, #0066FF)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{t('collection.sectionTitleHighlight')}</span>
            </h2>
            <p className="text-gray-400 text-base mt-3 max-w-md">
              {t('collection.sectionDescription')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/cycles"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white overflow-hidden transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,102,255,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              {t('collection.viewAll')}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>

        {/* ── Cards grid ──────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl animate-pulse h-[420px]"
                style={{
                  background: 'rgba(8, 16, 32, 0.5)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div className="aspect-[4/3] rounded-t-2xl bg-white/[0.03]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-2/3 rounded bg-white/[0.04]" />
                  <div className="h-3 w-1/2 rounded bg-white/[0.03]" />
                  <div className="flex gap-2">
                    <div className="h-5 w-14 rounded bg-white/[0.03]" />
                    <div className="h-5 w-14 rounded bg-white/[0.03]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : cycles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 rounded-2xl"
            style={{ background: 'rgba(8,16,32,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <Bike size={52} className="text-gray-600 mx-auto mb-5" strokeWidth={1.5} />
            <p className="text-gray-400 text-lg font-semibold mb-2">{t('collection.noFeatured')}</p>
            <p className="text-gray-500 text-sm">{t('collection.noFeaturedSub')}</p>
          </motion.div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cycles.map((cycle, i) => (
                <motion.div
                  key={cycle._id}
                  initial={{ opacity: 0, y: 44 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <CycleCard cycle={cycle} />
                </motion.div>
              ))}
            </div>

            {/* Mobile View */}
            <div className="lg:hidden divide-y divide-white/[0.04] border-t border-b border-white/[0.04]">
              {cycles.map((cycle) => (
                <CycleListItem key={cycle._id} cycle={cycle} />
              ))}
            </div>
          </>
        )}

        {/* ── Bottom CTA ──────────────────────────────────────────── */}
        {!loading && cycles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 text-center"
          >
            <Link
              to="/cycles"
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white overflow-hidden transition-all duration-300 relative"
              style={{
                background: 'linear-gradient(135deg, #0066FF, #0044BB)',
                boxShadow: '0 0 30px rgba(0,102,255,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 50px rgba(0,102,255,0.55), inset 0 1px 0 rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(0,102,255,0.35), inset 0 1px 0 rgba(255,255,255,0.12)'}
            >
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />
              <span className="relative">{t('collection.viewAll')}</span>
              <ArrowRight size={18} className="relative group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
