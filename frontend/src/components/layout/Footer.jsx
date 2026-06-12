import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LogoMark from './LogoMark';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919848116926';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    [t('footer.quickLinks')]: [
      { label: t('footer.home'), to: '/' },
      { label: t('footer.ourCycles'), to: '/cycles' },
      { label: t('footer.aboutUs'), to: '/about' },
      { label: t('footer.contact'), to: '/contact' },
    ],
    [t('footer.categories')]: [
      { label: t('footer.mountainBikes'), to: '/cycles?category=Mountain' },
      { label: t('footer.roadBikes'), to: '/cycles?category=Road' },
      { label: t('footer.kidsCycles'), to: '/cycles?category=Kids' },
      { label: t('footer.electricCycles'), to: '/cycles?category=Electric' },
      { label: t('footer.sportsCycles'), to: '/cycles?category=Sports' },
    ],
  };

  return (
    <footer className="relative bg-dark-900 border-t border-white/5 pt-16 pb-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-blue overflow-hidden">
                <LogoMark width={32} height={32} />
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-widest text-white">LAXMI</span>
                <span className="block text-[10px] text-accent font-semibold tracking-[0.3em] -mt-1">CYCLES STORE</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              {t('footer.tagline')}
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors text-sm">
                <MessageCircle size={16} className="text-green-400 flex-shrink-0" />
                +91 98481 16926
              </a>
              <a href="tel:+919848116926"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                <Phone size={16} className="text-primary flex-shrink-0" />
                +91 98481 16926
              </a>
              <a href="mailto:laxmicycles@gmail.com"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                <Mail size={16} className="text-primary flex-shrink-0" />
                laxmicycles@gmail.com
              </a>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
                GV9Q+GRG, Bhuvanagiri,<br />Telangana 508116
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-bold text-white tracking-wide mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-primary text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Hours */}
        <div className="glass-card p-4 mb-10 inline-block">
          <p className="text-xs font-semibold text-accent tracking-widest mb-2">{t('footer.showroomHours')}</p>
          <div className="flex flex-wrap gap-6 text-sm text-gray-300">
            <span><span className="text-white font-medium">{t('footer.monSat')}</span> 9:00 AM – 8:00 PM</span>
            <span><span className="text-white font-medium">{t('footer.sunday')}</span> 10:00 AM – 6:00 PM</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-4">
            {[
              { icon: Instagram, href: '#', label: 'Instagram' },
              { icon: Facebook, href: '#', label: 'Facebook' },
              { icon: Youtube, href: '#', label: 'YouTube' },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
