import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919848116926';

export default function ContactSection() {
  const { t } = useTranslation();

  const contactDetails = [
    {
      icon: MapPin,
      label: t('contact.storeAddress'),
      value: 'GV9Q+GRG, Bhuvanagiri, Telangana 508116',
      href: 'https://maps.google.com/?q=GV9Q%2BGRG+Bhuvanagiri+Telangana+508116',
      target: '_blank'
    },
    {
      icon: Phone,
      label: t('contact.phoneNumber'),
      value: '+91 98481 16926',
      href: 'tel:+919848116926'
    },
    {
      icon: MessageCircle,
      label: t('contact.whatsapp'),
      value: '+91 98481 16926',
      href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('contact.whatsappMessage'))}`,
      target: '_blank',
      highlight: true
    },
    {
      icon: Mail,
      label: t('contact.email'),
      value: 'laxmicycles@gmail.com',
      href: 'mailto:laxmicycles@gmail.com'
    }
  ];

  return (
    <section id="contact" className="py-16 md:py-28 px-4 relative overflow-hidden bg-dark-900/40 scroll-mt-16">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent text-sm font-semibold tracking-widest uppercase mb-3"
          >
            — {t('contact.sectionLabel')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title gradient-text mb-4"
          >
            {t('contact.sectionTitle')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed"
          >
            {t('contact.sectionDescription')}
          </motion.p>
        </div>

        {/* Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {contactDetails.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={idx}
                  href={item.href}
                  target={item.target}
                  rel={item.target ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="flex items-start gap-4 p-5 rounded-2xl transition-all duration-300"
                  style={{
                    background: item.highlight ? 'rgba(37, 211, 102, 0.06)' : 'rgba(255,255,255,0.02)',
                    border: item.highlight ? '1px solid rgba(37, 211, 102, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: item.highlight ? 'rgba(37, 211, 102, 0.12)' : 'rgba(0,102,255,0.12)',
                      border: item.highlight ? '1px solid rgba(37, 211, 102, 0.3)' : '1px solid rgba(0,102,255,0.3)',
                    }}
                  >
                    <Icon size={20} className={item.highlight ? 'text-green-400' : 'text-primary'} />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">{item.label}</span>
                    <span className="text-white font-medium text-sm md:text-base leading-relaxed hover:text-primary transition-colors">{item.value}</span>
                  </div>
                </motion.a>
              );
            })}

            {/* Hours Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="flex items-start gap-4 p-5 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-accent/12 border border-accent/30 flex-shrink-0">
                <Clock size={20} className="text-accent" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2">{t('contact.businessHours')}</span>
                <div className="flex flex-col gap-1.5 text-xs md:text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span className="font-semibold text-white">{t('contact.monSat')}</span>
                    <span>9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between border-t border-white/[0.04] pt-1.5 mt-0.5">
                    <span className="font-semibold text-white">{t('contact.sunday')}</span>
                    <span>10:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Interactive Google Map Embed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-7 h-[420px] rounded-3xl overflow-hidden relative shadow-2xl"
            style={{
              border: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(255,255,255,0.01)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.5!2d79.1244!3d17.5072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcbff5555555555%3A0x0!2zQlZROStHUkcsIEJodXZhbmFnaXJpLCBUZWxhbmdhbmEgNTA4MTE2!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(0.7) invert(0.9) contrast(1.2)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Laxmi Cycles Store Location"
            />
            
            {/* Ambient Shadow Overlays for seamless integrations */}
            <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-3xl" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
