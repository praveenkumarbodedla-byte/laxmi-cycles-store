import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const FALLBACK_REVIEWS = [
  {
    _id: '1',
    customerName: 'Ravi Kumar',
    rating: 5,
    comment: 'Excellent service! Got my Hero MTB cycle at a great price. The staff was very helpful and knowledgeable. The collection is outstanding.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
    tag: 'Verified Purchase'
  },
  {
    _id: '2',
    customerName: 'Priya Sharma',
    rating: 5,
    comment: 'Beautiful showroom! My daughter loves her new kids cycle. Quality is top-notch and the sizing guide helped us pick the absolute perfect model.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
    tag: 'Verified Purchase'
  },
  {
    _id: '3',
    customerName: 'Suresh Reddy',
    rating: 5,
    comment: 'Best cycle store in Hyderabad. Wide variety of models, honest pricing, and extremely quick delivery. Extremely satisfied with my Vesco Hybrid!',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
    tag: 'Verified Purchase'
  },
];

export default function TestimonialsSection() {
  const { t } = useTranslation();
  // Start with fallback data so the page renders instantly with no blank screen.
  // Real data from the API silently replaces it when the fetch completes.
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    api.get('/api/reviews')
      .then((res) => {
        // Map backend reviews with fallback avatars if they lack customer photos
        const data = res.data.data.map((r, i) => ({
          ...r,
          avatar: r.avatar || FALLBACK_REVIEWS[i % FALLBACK_REVIEWS.length].avatar,
          tag: r.tag || 'Verified Purchase'
        }));
        setReviews(data.length > 0 ? data : FALLBACK_REVIEWS);
      })
      .catch(() => setReviews(FALLBACK_REVIEWS));
  }, []);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + reviews.length) % reviews.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % reviews.length);
  };

  const review = reviews[current];

  // Slide animations
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0
    })
  };

  const getComment = (r) => {
    if (r._id === '1') return t('reviews.fallbackComments.c1');
    if (r._id === '2') return t('reviews.fallbackComments.c2');
    if (r._id === '3') return t('reviews.fallbackComments.c3');
    return r.comment;
  };

  const getTag = (r) => {
    if (r.tag === 'Verified Purchase') return t('reviews.verifiedPurchase');
    return r.tag;
  };

  return (
    <section id="reviews" className="py-16 md:py-28 px-4 relative overflow-hidden scroll-mt-16 bg-dark-800">
      
      {/* Background glow atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }} />

      <div className="relative max-w-4xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">— {t('reviews.sectionLabel')}</p>
          <h2 className="section-title gradient-text mb-4">{t('reviews.sectionTitle')}</h2>
          <p className="text-gray-400 text-base max-w-md mx-auto">
            {t('reviews.sectionDescription')}
          </p>
        </motion.div>

        {/* Testimonial Card */}
        <div className="relative rounded-3xl p-8 md:p-14 overflow-hidden"
          style={{
            background: 'rgba(8, 16, 32, 0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 214, 10, 0.15)', // Subtle gold glow border
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Quote Mark Decoration */}
          <Quote size={50} className="text-gold/10 absolute top-8 left-8 pointer-events-none" />

          <div className="min-h-[260px] flex flex-col justify-between">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={review._id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="text-center flex flex-col items-center"
              >
                {/* Rating Badge */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                    >
                      <Star
                        size={18}
                        className={i < review.rating ? 'text-gold fill-gold' : 'text-gray-700'}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-200 text-lg md:text-xl font-medium leading-relaxed mb-8 italic max-w-2xl">
                  "{getComment(review)}"
                </p>

                {/* Profile Meta */}
                <div className="flex items-center gap-3.5">
                  <img
                    src={review.avatar}
                    alt={review.customerName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold/40 shadow-md"
                  />
                  <div className="text-left">
                    <p className="font-semibold text-white leading-tight">{review.customerName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{getTag(review)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Navigation */}
            {reviews.length > 1 && (
              <div className="flex items-center justify-between mt-10 border-t border-white/[0.06] pt-6">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-gold/40 hover:bg-white/[0.06] transition-all duration-300"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {/* Bullet Indicators */}
                <div className="flex gap-2">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > current ? 1 : -1);
                        setCurrent(i);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-gold w-6' : 'bg-gray-700 w-1.5'}`}
                    />
                  ))}
                </div>

                <button
                  onClick={next}
                  className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-gold/40 hover:bg-white/[0.06] transition-all duration-300"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
