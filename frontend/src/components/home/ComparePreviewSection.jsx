import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GitCompare, ArrowRight, CheckCircle2, Zap, Shield, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const COMPARE_FEATURES = [
  { icon: CheckCircle2, labelKey: 'compare.featuresPrice', color: '#00D4FF' },
  { icon: Zap, labelKey: 'compare.featuresSpecs', color: '#0066FF' },
  { icon: Shield, labelKey: 'compare.featuresBrand', color: '#7C3AED' },
  { icon: Star, labelKey: 'compare.featuresValue', color: '#F59E0B' },
];

// Decorative mock cycle card
function MockCard({ delay = 0, label, price, badgeKey, badgeColor }) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl overflow-hidden flex-1 min-w-0"
      style={{
        background: 'rgba(8, 16, 32, 0.6)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Image placeholder */}
      <div
        className="h-36 w-full flex items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(0,40,100,0.5), rgba(0,102,255,0.08))' }}
      >
        <svg viewBox="0 0 80 60" width="80" height="60" fill="none" className="opacity-30">
          <circle cx="20" cy="42" r="14" stroke="#0066FF" strokeWidth="3" />
          <circle cx="60" cy="42" r="14" stroke="#0066FF" strokeWidth="3" />
          <line x1="20" y1="42" x2="36" y2="22" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="36" y1="22" x2="60" y2="42" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="36" y1="22" x2="36" y2="42" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="42" x2="36" y2="42" stroke="#00D4FF" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M28,18 Q36,12 44,18" stroke="#00D4FF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <line x1="60" y1="24" x2="60" y2="34" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" />
          <line x1="55" y1="24" x2="65" y2="24" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div
          className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
          style={{ background: `${badgeColor}22`, color: badgeColor, border: `1px solid ${badgeColor}44` }}
        >
          {t(badgeKey)}
        </div>
      </div>

      <div className="p-4">
        <p className="text-white font-bold text-sm mb-1 truncate">{label}</p>
        <p
          className="text-sm font-semibold mb-3"
          style={{
            background: 'linear-gradient(to right, #00D4FF, #0066FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {price}
        </p>
        <div className="space-y-1.5">
          {[
            t('compare.mockAlloyFrame'),
            t('compare.mock21Gears'),
            t('compare.mockWheelSize')
          ].map((spec) => (
            <div key={spec} className="flex items-center gap-1.5 text-gray-400 text-[10px]">
              <div className="w-1 h-1 rounded-full bg-primary/50 flex-shrink-0" />
              {spec}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ComparePreviewSection() {
  const { t } = useTranslation();
  return (
    <section
      id="compare"
      className="relative py-16 md:py-28 px-4 overflow-hidden"
      style={{ scrollMarginTop: '72px' }}
    >
      {/* ── Background atmosphere ──────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 50%, rgba(0,80,180,0.07) 0%, transparent 55%), radial-gradient(ellipse at 70% 50%, rgba(124,58,237,0.05) 0%, transparent 55%)',
          }}
        />
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }} />
        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* ── Left: Copy ─────────────────────────────────────────────── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 mb-5">
                <div className="w-8 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(0,212,255,0.6))' }} />
                <span className="text-accent text-[11px] font-bold tracking-[0.4em] uppercase">{t('compare.sideBySide')}</span>
                <div className="w-8 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(0,212,255,0.6))' }} />
              </div>

              <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight mb-5 leading-tight">
                {t('compare.cantDecide')}{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #ffffff, #00D4FF, #0066FF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {t('compare.pageTitle')}
                </span>
              </h2>

              <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-md">
                {t('compare.previewDescription')}
              </p>

              {/* Feature pills */}
              <div className="grid grid-cols-2 gap-3 mb-10">
                {COMPARE_FEATURES.map(({ icon: Icon, labelKey, color }) => (
                  <div
                    key={labelKey}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <Icon size={14} style={{ color, flexShrink: 0 }} />
                    <span className="text-gray-300 text-xs font-medium">{t(labelKey)}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/compare"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold text-white overflow-hidden transition-all duration-300 relative"
                style={{
                  background: 'linear-gradient(135deg, #0066FF, #0044BB)',
                  boxShadow: '0 0 30px rgba(0,102,255,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 50px rgba(0,102,255,0.55), inset 0 1px 0 rgba(255,255,255,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(0,102,255,0.35), inset 0 1px 0 rgba(255,255,255,0.12)';
                }}
              >
                <span
                  className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
                />
                <GitCompare size={16} className="relative" />
                <span className="relative">{t('compare.startComparing')}</span>
                <ArrowRight size={16} className="relative group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          </div>

          {/* ── Right: Visual mock ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* VS badge */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-xs text-white shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #0066FF, #7C3AED)',
                boxShadow: '0 0 20px rgba(0,102,255,0.5)',
              }}
            >
              VS
            </div>

            {/* Ambient glow */}
            <div
              className="absolute inset-0 -z-10 blur-3xl opacity-20 rounded-3xl"
              style={{ background: 'linear-gradient(135deg, rgba(0,102,255,0.5), rgba(124,58,237,0.3))' }}
            />

            <div className="flex gap-4">
              <MockCard
                delay={0.1}
                label="Hero Sprint Pro"
                price="₹14,500"
                badgeKey="compare.mockPopular"
                badgeColor="#00D4FF"
              />
              <MockCard
                delay={0.2}
                label="Vesco Trail X"
                price="₹12,999"
                badgeKey="compare.mockValuePick"
                badgeColor="#F59E0B"
              />
            </div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-4 p-4 rounded-xl flex items-center justify-around gap-4"
              style={{
                background: 'rgba(0,102,255,0.06)',
                border: '1px solid rgba(0,102,255,0.15)',
              }}
            >
              {[
                { labelKey: 'compare.statsSpecs', value: '12+' },
                { labelKey: 'compare.statsBrands', value: '10+' },
                { labelKey: 'compare.statsModels', value: '50+' },
              ].map(({ labelKey, value }) => (
                <div key={labelKey} className="text-center">
                  <p
                    className="font-display font-black text-xl"
                    style={{
                      background: 'linear-gradient(to right, #00D4FF, #0066FF)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {value}
                  </p>
                  <p className="text-gray-500 text-[10px] font-medium mt-0.5">{t(labelKey)}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
