import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

export default function LanguageSelector({ compact = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('laxmi_lang', code);
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      <button
        id="language-selector-btn"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-xl border transition-all duration-300 ${
          compact
            ? 'px-2.5 py-1.5 text-xs'
            : 'px-3 py-2 text-xs'
        } font-semibold tracking-wide text-gray-300 hover:text-white hover:border-primary/40 hover:bg-primary/10`}
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
        }}
        aria-label="Select language"
        aria-expanded={open}
      >
        <Globe size={13} className="text-accent flex-shrink-0" />
        <span className="max-w-[80px] truncate">{current.native}</span>
        <ChevronDown
          size={11}
          className={`transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden z-[200]"
            style={{
              background: 'rgba(5, 10, 25, 0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div className="p-1.5 max-h-72 overflow-y-auto scrollbar-thin">
              {LANGUAGES.map((lang) => {
                const isActive = i18n.language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-primary/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold leading-tight">{lang.native}</p>
                      <p className="text-[10px] text-gray-500 leading-tight">{lang.label}</p>
                    </div>
                    {isActive && (
                      <Check size={14} className="text-primary flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
