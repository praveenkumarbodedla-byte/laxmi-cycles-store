import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Play, Pause } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ─── Video source ───────────────────────────────────────────────────────
   Place your video in:  frontend/public/hero-bg.mp4              */

/* ─── Floating badge component ──────────────────────────────────────────── */
function FloatingBadge({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 ${className}`}
      style={{ background: 'rgba(5, 15, 30, 0.65)' }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Word-by-word text reveal ──────────────────────────────────────────── */
function WordReveal({ text, delay = 0, className = '' }) {
  const words = text.split(' ');
  return (
    <span className={className} style={{ display: 'inline', overflow: 'hidden' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'inline-block', marginRight: '0.25em', overflow: 'hidden' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Main HeroSection ──────────────────────────────────────────────────── */
export default function HeroSection() {
  const { t } = useTranslation();
  const location = useLocation();
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Parallax on scroll
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 0.4]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Detect first scroll for the scroll indicator
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Force video to always start from frame 0
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    // Debug listeners
    video.addEventListener('loadedmetadata', () => {
      console.log('Video Loaded');
      console.log('Current Time:', video.currentTime);
    });

    video.addEventListener('play', () => {
      console.log('Playing From:', video.currentTime);
    });

    const resetVideo = async () => {
      video.pause();
      video.currentTime = 0;
      video.load();

      try {
        await video.play();
      } catch (err) {
        console.log(err);
      }
    };

    resetVideo();
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPaused) {
      videoRef.current.play();
      setIsPaused(false);
    } else {
      videoRef.current.pause();
      setIsPaused(true);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center "
      style={{ background: '#000508' }}
    >

      {/* ── Video Background ──────────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ y: videoY }}
      >
        <video
            key={window.location.pathname + Date.now()}
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            style={{
              opacity: videoLoaded ? 1 : 0,
              transition: 'opacity 1.5s ease',
              filter: 'brightness(0.8) contrast(1.08) saturate(1.1)',
            }}
            onCanPlay={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>

        {/* Fallback / pre-video atmospheric background */}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: videoLoaded && !videoError ? 0 : 1,
            background: 'radial-gradient(ellipse at 30% 45%, #0a2040 0%, #020c1b 45%, #000508 100%)',
          }}
        />

        {/* Cinematic grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px' }}
        />
      </motion.div>

      {/* ── Overlay System ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary dark gradient — bottom heavy to protect text */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,3,10,0.85) 0%, rgba(0,5,15,0.4) 30%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.05) 100%)' }}
        />
        {/* Left vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,3,12,0.3) 0%, transparent 50%)' }}
        />
        {/* Right vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to left, rgba(0,3,12,0.25) 0%, transparent 50%)' }}
        />
        {/* Top vignette */}
        <div
          className="absolute top-0 inset-x-0 h-48"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), transparent)' }}
        />
        {/* Blue ambient tint */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(0,60,140,0.1) 0%, transparent 60%)' }}
        />
        {/* Scroll-driven darkening */}
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {/* ── Hero Content ─────────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 w-full flex flex-col items-center justify-center text-center px-6 pt-16 pb-28 md:pt-20 md:pb-40"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 mb-8"
        >

        </motion.div>

        {/* Main headline */}
        <div
          className="overflow-hidden mb-5"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)', lineHeight: 0.92 }}
        >
          <div className="font-display font-black text-white tracking-tight">
            <WordReveal text={t('hero.headline1')} delay={0.35} />
          </div>
          <div className="font-display font-black tracking-tight" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #80c8ff 35%, #0066FF 65%, #00D4FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            <WordReveal text={t('hero.headline2')} delay={0.55} />
          </div>
        </div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
        >
          {t('hero.subheadline')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link
            to="/cycles"
            className="group relative inline-flex items-center gap-3 px-9 py-4 rounded-xl font-bold text-white text-base overflow-hidden transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #0066FF, #0044BB)',
              boxShadow: '0 0 40px rgba(0,102,255,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 70px rgba(0,102,255,0.7), inset 0 1px 0 rgba(255,255,255,0.15)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(0,102,255,0.45), inset 0 1px 0 rgba(255,255,255,0.15)'}
          >
            {/* Shimmer on hover */}
            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />
            {t('hero.ctaExplore')}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>

          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 px-9 py-4 rounded-xl font-bold text-white text-base border transition-all duration-300 hover:bg-white/10 hover:border-white/30"
            style={{
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {t('hero.ctaContact')}
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-6 mt-16"
        >
          {[['200+', t('hero.stat1Label')], ['15+', t('hero.stat2Label')], ['5000+', t('hero.stat3Label')]].map(([num, label], i) => (
            <div key={label} className="flex items-center gap-6">
              <div className="text-center">
                <p className="font-display font-bold text-white text-xl leading-none" style={{ textShadow: '0 0 20px rgba(0,212,255,0.4)' }}>{num}</p>
                <p className="text-gray-400 text-[11px] tracking-wider mt-1">{label}</p>
              </div>
              {i < 2 && <div className="w-px h-8 bg-white/10" />}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Floating ambient badges (desktop) ────────────────────────────── */}
      <div className="hidden lg:block">
        {/* Left badge */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10">
          <FloatingBadge delay={1.4} className="flex flex-col gap-1.5">
            <span className="text-accent text-[9px] font-bold tracking-widest uppercase">{t('hero.frameMaterial')}</span>
            <span className="text-white text-sm font-semibold">{t('hero.frameMaterialValue')}</span>
            <div className="w-full h-px" style={{ background: 'linear-gradient(to right, rgba(0,212,255,0.5), transparent)' }} />
          </FloatingBadge>
        </div>

        {/* Right badge */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10">
          <FloatingBadge delay={1.55} className="flex flex-col gap-1.5 text-right">
            <span className="text-accent text-[9px] font-bold tracking-widest uppercase">{t('hero.gearRange')}</span>
            <span className="text-white text-sm font-semibold">{t('hero.gearRangeValue')}</span>
            <div className="w-full h-px" style={{ background: 'linear-gradient(to left, rgba(0,212,255,0.5), transparent)' }} />
          </FloatingBadge>
        </div>

        {/* Bottom right badge */}
        <div className="absolute right-10 bottom-32 z-10">
          <FloatingBadge delay={1.7} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,102,255,0.3)', border: '1px solid rgba(0,102,255,0.4)' }}>
              <span className="text-primary text-xs font-bold">★</span>
            </div>
            <div>
              <p className="text-white text-xs font-semibold">{t('hero.trustedSince')}</p>
              <p className="text-gray-400 text-[10px]">{t('hero.hydNo1')}</p>
            </div>
          </FloatingBadge>
        </div>
      </div>

      {/* ── Video controls (play/pause) ───────────────────────────────────── */}
      {!videoError && videoLoaded && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          onClick={togglePlay}
          className="absolute bottom-8 right-8 z-10 w-10 h-10 rounded-full flex items-center justify-center border border-white/15 backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/10"
          style={{ background: 'rgba(0,0,0,0.35)' }}
          aria-label={isPaused ? 'Play video' : 'Pause video'}
        >
          {isPaused
            ? <Play size={14} className="text-white ml-0.5" />
            : <Pause size={14} className="text-white" />}
        </motion.button>
      )}

      {/* ── Bottom progress line ──────────────────────────────────────────── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 2.5, delay: 1.5, ease: 'easeInOut' }}
        className="absolute bottom-0 left-0 right-0 h-px origin-left"
        style={{ background: 'linear-gradient(to right, transparent, rgba(0,102,255,0.6), rgba(0,212,255,0.8), rgba(0,102,255,0.6), transparent)' }}
      />

      {/* ── Scroll hint ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          >
            <span className="text-gray-500 text-[10px] tracking-[0.35em] uppercase">{t('hero.scroll')}</span>
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-8"
              style={{ background: 'linear-gradient(to bottom, rgba(0,212,255,0.7), transparent)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Corner accent marks ───────────────────────────────────────────── */}
      {['top-5 left-5 border-t border-l', 'top-5 right-5 border-t border-r'].map(cls => (
        <motion.div
          key={cls}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`absolute w-8 h-8 pointer-events-none ${cls}`}
          style={{ borderColor: 'rgba(0,212,255,0.6)' }}
        />
      ))}
    </section>
  );
}
