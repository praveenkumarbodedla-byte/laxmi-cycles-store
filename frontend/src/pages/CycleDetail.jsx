import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, GitCompare, MessageCircle, Share2,
  ChevronLeft, ChevronRight, CheckCircle, XCircle,
  Tag, Bike, Scale, Settings, Disc
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import CycleCard from '../components/cycles/CycleCard';
import CycleListItem from '../components/cycles/CycleListItem';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919848116926';
const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230A1628'/%3E%3Ccircle cx='120' cy='200' r='60' fill='none' stroke='%230066FF' stroke-width='8'/%3E%3Ccircle cx='280' cy='200' r='60' fill='none' stroke='%230066FF' stroke-width='8'/%3E%3Cpath d='M120 200L160 120H240L270 175' fill='none' stroke='%2300D4FF' stroke-width='6'/%3E%3C/svg%3E";

function EnquiryForm({ cycle, onClose }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    values: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      message: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/api/enquiries', {
        ...data,
        cycleId: cycle._id,
        cycleName: cycle.name,
      });
      toast.success(t('cycleDetail.enquiry.successMsg'));
      reset();
      onClose?.();
    } catch (err) {
      toast.error(err.response?.data?.message || t('cycleDetail.enquiry.failedMsg'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="glass-card p-3 mb-4 border border-primary/20">
        <p className="text-xs text-gray-400">{t('cycleDetail.enquiryAbout')}</p>
        <p className="text-white font-semibold">{cycle.name} — ₹{cycle.price.toLocaleString('en-IN')}</p>
      </div>

      {[
        { name: 'name', label: t('login.fullName'), type: 'text', placeholder: t('login.fullNamePlaceholder'), rules: { required: t('contact.nameRequired') } },
        { name: 'email', label: t('login.emailAddress'), type: 'email', placeholder: t('login.emailPlaceholder'), rules: { required: t('contact.emailRequired'), pattern: { value: /^\S+@\S+\.\S+$/, message: t('contact.invalidEmail') } } },
        { name: 'phone', label: t('contact.phoneNumber'), type: 'tel', placeholder: t('contact.invalidPhone'), rules: { required: t('contact.phoneRequired'), pattern: { value: /^[6-9]\d{9}$/, message: t('contact.invalidPhone') } } },
      ].map((field) => (
        <div key={field.name}>
          <label className="text-xs text-gray-400 mb-1.5 block font-medium">{field.label}</label>
          <input
            type={field.type}
            placeholder={field.placeholder}
            {...register(field.name, field.rules)}
            className="w-full px-4 py-2.5 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
          {errors[field.name] && <p className="text-red-400 text-xs mt-1">{errors[field.name].message}</p>}
        </div>
      ))}

      <div>
        <label className="text-xs text-gray-400 mb-1.5 block font-medium">{t('cycleDetail.messageOptional')}</label>
        <textarea
          rows={3}
          placeholder={t('cycleDetail.messageOptionalPlaceholder')}
          {...register('message', { required: t('contact.messageRequired') })}
          className="w-full px-4 py-2.5 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none"
        />
        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full py-3 justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? t('contact.sending') : t('cycleDetail.enquiry.sendBtn')}
      </button>
    </form>
  );
}

export default function CycleDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cycle, setCycle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const { addToCompare, isInCompare } = useCompare();

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    api.get(`/api/cycles/${id}`)
      .then((res) => {
        setCycle(res.data.data);
        setRelated(res.data.related || []);
        setCurrentImage(0);
      })
      .catch(() => setCycle(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!cycle) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
        <Bike size={56} className="text-gray-600" />
        <h2 className="text-2xl font-bold text-white">{t('cycles.noResults')}</h2>
        <Link to="/cycles" className="btn-primary">{t('cycleDetail.backBtn')}</Link>
      </div>
    );
  }

  const images = cycle.images?.length > 0 ? cycle.images : [{ url: PLACEHOLDER, publicId: 'placeholder' }];
  const whatsappMsg = encodeURIComponent(`Hello Laxmi Cycles Store,\nI am interested in ${cycle.name}.\nPlease provide more details.`);

  const specs = [
    { icon: Scale, label: t('compare.weight', 'Weight'), value: cycle.specifications?.weight ? `${cycle.specifications.weight} kg` : null },
    { icon: Settings, label: t('compare.gears'), value: cycle.specifications?.gears ? t('compare.speedValue', { count: cycle.specifications.gears }) : null },
    { icon: Bike, label: t('compare.frame'), value: cycle.specifications?.frameSize ? t('compare.frameValue', { size: cycle.specifications.frameSize }) : null },
    { icon: Disc, label: t('compare.brakes', 'Brakes'), value: cycle.specifications?.brakeType },
    { icon: Bike, label: t('cycles.filterSize'), value: cycle.specifications?.wheelSize ? t('compare.wheelValue', { size: cycle.specifications.wheelSize }) : null },
    { icon: Settings, label: t('compare.suspension', 'Suspension'), value: cycle.specifications?.suspension },
    { icon: Tag, label: t('hero.frameMaterial'), value: cycle.specifications?.frameMaterial },
    { icon: Tag, label: t('compare.color'), value: cycle.specifications?.color },
  ].filter((s) => s.value);

  const getAvailabilityText = (availability, isAvailable) => {
    const status = availability || (isAvailable ? 'available' : 'out_of_stock');
    if (status === 'available') return t('cycles.inStock');
    if (status === 'limited_stock') return t('collection.limitedStock', 'Limited Stock');
    return t('cycles.outOfStock');
  };

  const statusVal = cycle.availability || (cycle.isAvailable ? 'available' : 'out_of_stock');

  return (
    <div className="min-h-screen pt-20 pb-20 bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back button */}
        <Link to="/cycles" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft size={16} /> {t('cycleDetail.backBtn')}
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-card mb-4"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={images[currentImage]?.url || PLACEHOLDER}
                  alt={cycle.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button onClick={() => setCurrentImage((c) => (c - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-dark-800/80 border border-white/10 flex items-center justify-center text-white hover:border-primary/50 transition-all">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setCurrentImage((c) => (c + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-dark-800/80 border border-white/10 flex items-center justify-center text-white hover:border-primary/50 transition-all">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={img.publicId}
                    onClick={() => setCurrentImage(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === currentImage ? 'border-primary' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = PLACEHOLDER; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold border border-primary/30 bg-primary/10 text-primary">
                {t(`cycles.categories.${cycle.category}`, cycle.category)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                statusVal === 'available'
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : statusVal === 'limited_stock'
                  ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
                {statusVal === 'available' ? (
                  <CheckCircle size={10} />
                ) : statusVal === 'limited_stock' ? (
                  <CheckCircle size={10} className="text-yellow-400" />
                ) : (
                  <XCircle size={10} />
                )}
                {getAvailabilityText(cycle.availability, cycle.isAvailable)}
              </span>
              {cycle.isFeatured && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold/20 border border-gold/40 text-gold">
                  ★ {t('cycles.featured', 'FEATURED')}
                </span>
              )}
            </div>

            <p className="text-gray-400 text-sm font-semibold tracking-widest uppercase mb-2">{cycle.brand}</p>
            <h1 className="font-display font-bold text-4xl text-white mb-4">{cycle.name}</h1>
            <div className="font-display font-bold text-5xl gradient-text mb-6">
              ₹{cycle.price.toLocaleString('en-IN')}
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">{cycle.description}</p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              {statusVal === 'out_of_stock' ? (
                <button
                  disabled
                  className="w-full py-3.5 flex justify-center text-base rounded-xl bg-red-500/10 text-red-400/50 border border-red-500/10 cursor-not-allowed font-semibold uppercase"
                >
                  {t('cycles.outOfStock')}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (!user) {
                        toast.error(t('cycleDetail.enquiry.loginRequired'));
                        navigate('/login');
                      } else {
                        setShowEnquiry(true);
                      }
                    }}
                    className="btn-primary flex-1 py-3.5 justify-center text-base"
                  >
                    <MessageCircle size={18} /> {t('cycleDetail.enquiry.sendBtn')}
                  </button>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-semibold text-base bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-all duration-300"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-green-400 flex-shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.49" />
                    </svg>
                    {t('compare.whatsapp', 'WhatsApp')}
                  </a>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => addToCompare(cycle)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                  isInCompare(cycle._id)
                    ? 'border-accent/50 bg-accent/10 text-accent'
                    : 'border-white/10 text-gray-400 hover:border-primary/50 hover:text-white'
                }`}
              >
                <GitCompare size={16} />
                {isInCompare(cycle._id) ? t('cycleDetail.inCompare') : t('collection.addToCompare')}
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: cycle.name, url: window.location.href });
                  } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href).then(() => toast.success(t('cycleDetail.linkCopied')));
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-gray-400 hover:text-white hover:border-primary/50 transition-all"
              >
                <Share2 size={16} /> {t('cycleDetail.share')}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        {specs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 glass-card p-8"
          >
            <h2 className="font-display font-bold text-2xl text-white mb-8">{t('cycleDetail.details')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="p-4 rounded-xl bg-dark-700/50 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} className="text-primary" />
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                  </div>
                  <p className="text-white font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related cycles */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display font-bold text-2xl text-white mb-8">{t('cycleDetail.relatedCycles')}</h2>
            
            {/* Desktop View */}
            <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((c) => (
                <CycleCard key={c._id} cycle={c} />
              ))}
            </div>

            {/* Mobile View */}
            <div className="lg:hidden divide-y divide-white/[0.04] border-t border-b border-white/[0.04]">
              {related.map((c) => (
                <CycleListItem key={c._id} cycle={c} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enquiry Modal */}
      <AnimatePresence>
        {showEnquiry && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEnquiry(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed z-50 inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto glass-card-dark border border-primary/30 p-6 rounded-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-xl text-white">{t('cycleDetail.enquiry.sendBtn')}</h3>
                <button onClick={() => setShowEnquiry(false)} className="text-gray-400 hover:text-white">
                  <span className="text-2xl">×</span>
                </button>
              </div>
              <EnquiryForm cycle={cycle} onClose={() => setShowEnquiry(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
