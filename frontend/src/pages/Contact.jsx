import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919391899088';

export default function Contact() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contactDetails = [
    { icon: MapPin, label: t('contact.storeAddress'), value: 'GV9Q+GRG, Bhuvanagiri, Telangana 508116', href: 'https://maps.google.com/?q=GV9Q%2BGRG+Bhuvanagiri+Telangana+508116' },
    { icon: Phone, label: t('contact.phoneNumber'), value: '+91 93918 99088', href: 'tel:+919391899088' },
    { icon: Mail, label: t('contact.email'), value: 'laxmicycles@gmail.com', href: 'mailto:laxmicycles@gmail.com' },
    { icon: Clock, label: t('contact.businessHours'), value: `${t('contact.monSat')} 9 AM – 8 PM | ${t('contact.sunday')} 10 AM – 6 PM`, href: null },
  ];

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    values: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      message: '',
    }
  });

  const onSubmit = async (data) => {
    if (!user) {
      toast.error(t('contact.loginRequired'));
      navigate('/login');
      return;
    }
    try {
      await api.post('/api/enquiries', { ...data, cycleName: 'General Enquiry' });
      toast.success(t('contact.sendSuccess'));
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || t('contact.sendError'));
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20 bg-dark-800">
      {/* Header */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900 to-dark-800" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-accent/6 blur-3xl rounded-full" />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">— {t('contact.getInTouch')}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="section-title gradient-text mb-4">{t('nav.contact')}</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-gray-400">{t('contact.sectionDescription')}</motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display font-bold text-2xl text-white mb-8">{t('contact.visitShowroom')}</h2>
            <div className="space-y-4 mb-8">
              {contactDetails.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 glass-card p-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
                    {href ? (
                      <a href={href} className="text-white font-medium hover:text-primary transition-colors">{value}</a>
                    ) : (
                      <p className="text-white font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Laxmi%20Cycles!%20I%20have%20a%20question.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-semibold hover:bg-green-500/20 transition-all duration-300 mb-8"
            >
              <MessageCircle size={20} />
              {t('contact.chatWhatsapp')}
            </a>

            {/* Map embed */}
            <div className="rounded-2xl overflow-hidden glass-card aspect-[4/3]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.5!2d79.1244!3d17.5072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcbff5555555555%3A0x0!2zQlZROStHUkcsIEJodXZhbmFnaXJpLCBUZWxhbmdhbmEgNTA4MTE2!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Laxmi Cycles Store Location"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="glass-card glow-border p-8">
              <h2 className="font-display font-bold text-2xl text-white mb-2">{t('contact.sendMessageTitle')}</h2>
              <p className="text-gray-400 text-sm mb-8">{t('contact.replyTime')}</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {[
                  { name: 'name', label: t('login.fullName'), type: 'text', placeholder: t('login.fullNamePlaceholder'), rules: { required: t('contact.nameRequired') } },
                  { name: 'email', label: t('login.emailAddress'), type: 'email', placeholder: t('login.emailPlaceholder'), rules: { required: t('contact.emailRequired'), pattern: { value: /^\S+@\S+\.\S+$/, message: t('contact.invalidEmail') } } },
                  { name: 'phone', label: t('contact.phoneNumber'), type: 'tel', placeholder: t('contact.invalidPhone'), rules: { required: t('contact.phoneRequired'), pattern: { value: /^[6-9]\d{9}$/, message: t('contact.invalidPhone') } } },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      {...register(field.name, field.rules)}
                      className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    {errors[field.name] && <p className="text-red-400 text-xs mt-1">{errors[field.name].message}</p>}
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('contact.messageLabel')}</label>
                  <textarea
                    rows={5}
                    placeholder={t('contact.messagePlaceholder')}
                    {...register('message', { required: t('contact.messageRequired') })}
                    className="w-full px-4 py-3 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="btn-primary w-full py-4 justify-center text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('contact.sending') : t('contact.sendMessageBtn')}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
