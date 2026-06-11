import { motion } from 'framer-motion';
import { Award, Users, Zap, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  const values = [
    { icon: Award, title: t('about.values.v1.title'), desc: t('about.values.v1.desc') },
    { icon: Users, title: t('about.values.v2.title'), desc: t('about.values.v2.desc') },
    { icon: Zap, title: t('about.values.v3.title'), desc: t('about.values.v3.desc') },
    { icon: Heart, title: t('about.values.v4.title'), desc: t('about.values.v4.desc') },
  ];

  const milestones = [
    { year: t('about.milestones.m1.year'), event: t('about.milestones.m1.event') },
    { year: t('about.milestones.m2.year'), event: t('about.milestones.m2.event') },
    { year: t('about.milestones.m3.year'), event: t('about.milestones.m3.event') },
    { year: t('about.milestones.m4.year'), event: t('about.milestones.m4.event') },
    { year: t('about.milestones.m5.year'), event: t('about.milestones.m5.event') },
  ];

  return (
    <div className="min-h-screen pt-20 bg-dark-800">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900 to-dark-800" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/8 blur-3xl rounded-full" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
            — {t('about.storyLabel')}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="section-title gradient-text mb-6">
            {t('about.storyTitle')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg leading-relaxed">
            {t('about.storyDesc')}
          </motion.p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-title text-white mb-3">{t('about.valuesTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center glow-border group hover:scale-105 transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors">
                  <v.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-3">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/50 to-transparent" />
        <div className="relative max-w-3xl mx-auto">
          <h2 className="section-title text-center gradient-text-gold mb-14">{t('about.journeyTitle')}</h2>
          <div className="space-y-6 relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/30 to-transparent" />
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-6"
              >
                <div className="w-16 flex-shrink-0 text-right">
                  <span className="font-display font-bold text-primary text-sm">{m.year}</span>
                </div>
                <div className="relative flex-shrink-0">
                  <div className="w-4 h-4 rounded-full bg-primary border-2 border-dark-800 mt-0.5" />
                </div>
                <div className="glass-card p-4 flex-1">
                  <p className="text-white font-medium text-sm">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
