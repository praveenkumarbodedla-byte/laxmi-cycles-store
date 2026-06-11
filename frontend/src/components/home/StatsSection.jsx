import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';

function CountUp({ target, suffix, duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const { t } = useTranslation();

  const stats = [
    { labelKey: 'stats.yearsInBusiness', labelFallback: 'Years in Business', value: 15, suffix: '+' },
    { labelKey: 'stats.happyCustomers', labelFallback: 'Happy Customers', value: 5000, suffix: '+' },
    { labelKey: 'stats.cycleModels', labelFallback: 'Cycle Models', value: 200, suffix: '+' },
    { labelKey: 'stats.brandsAvailable', labelFallback: 'Brands Available', value: 7, suffix: '' },
  ];

  return (
    <section className="py-12 md:py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,102,255,0.05) 0%, transparent 50%, rgba(0,212,255,0.03) 100%)' }} />

      <div className="relative max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card glow-border p-6 text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="font-display font-bold text-4xl md:text-5xl gradient-text mb-2">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-gray-400 text-sm font-medium">{t(stat.labelKey, stat.labelFallback)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
