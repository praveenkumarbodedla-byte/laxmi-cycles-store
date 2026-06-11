import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, animate } from 'framer-motion';

/* ── Particle Canvas: orbiting particles that form the bike silhouette ── */
function LoadingCanvas({ phase }) {
  const ref = useRef(null);
  const frameRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = (canvas.width = 420);
    const H = (canvas.height = 420);
    const cx = W / 2;
    const cy = H / 2;

    // Bicycle silhouette key points (normalised around centre 210,210)
    const bikePoints = [
      // rear wheel rim
      ...Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return { x: cx - 110 + Math.cos(a) * 80, y: cy + 30 + Math.sin(a) * 80 };
      }),
      // front wheel rim
      ...Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return { x: cx + 110 + Math.cos(a) * 80, y: cy + 30 + Math.sin(a) * 80 };
      }),
      // frame top tube
      ...Array.from({ length: 10 }, (_, i) => ({
        x: cx - 20 + (i / 9) * 100,
        y: cy - 60,
      })),
      // seat tube
      ...Array.from({ length: 8 }, (_, i) => ({
        x: cx - 20,
        y: cy - 60 + (i / 7) * 90,
      })),
      // down tube
      ...Array.from({ length: 10 }, (_, i) => ({
        x: cx - 20 + (i / 9) * 110,
        y: cy - 60 + (i / 9) * 110,
      })),
      // chain stay
      ...Array.from({ length: 10 }, (_, i) => ({
        x: cx - 110 + (i / 9) * 110,
        y: cy + 30,
      })),
    ];

    // Orbital radius options
    const orbitR = [90, 115, 140];
    const count = 60;
    const particles = Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      r: orbitR[i % orbitR.length],
      speed: 0.003 + Math.random() * 0.003,
      size: Math.random() * 2.5 + 0.8,
      alpha: Math.random() * 0.6 + 0.4,
      color: i % 3 === 0 ? '#00D4FF' : i % 3 === 1 ? '#0066FF' : '#ffffff',
      // target position in bike shape
      tx: bikePoints[i % bikePoints.length].x,
      ty: bikePoints[i % bikePoints.length].y,
    }));

    let t = 0;

    const draw = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      t = elapsed / 1000;

      ctx.clearRect(0, 0, W, H);

      // Determine formation progress (0 → 1) during phase ≥ 2
      const formProgress = phase >= 2 ? Math.min((elapsed - 0) / 2000, 1) : 0;

      particles.forEach((p) => {
        // Orbit position
        p.angle += p.speed;
        const ox = cx + Math.cos(p.angle) * p.r;
        const oy = cy + Math.sin(p.angle) * p.r;

        // Lerp toward bike shape
        const px = ox + (p.tx - ox) * formProgress;
        const py = oy + (p.ty - oy) * formProgress;

        // Glow
        const grd = ctx.createRadialGradient(px, py, 0, px, py, p.size * 4);
        grd.addColorStop(0, p.color);
        grd.addColorStop(1, 'transparent');
        ctx.globalAlpha = p.alpha * (phase >= 3 ? Math.max(0, 1 - (elapsed - 2000) / 600) : 1);
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Halo
        ctx.globalAlpha = (p.alpha * 0.15) * (phase >= 3 ? Math.max(0, 1 - (elapsed - 2000) / 600) : 1);
        ctx.beginPath();
        ctx.arc(px, py, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [phase]);

  return (
    <canvas
      ref={ref}
      width={420}
      height={420}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

/* ── Animated wheel SVG ── */
function GlowWheel({ phase }) {
  return (
    <motion.div
      className="relative"
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
    >
      <svg width="200" height="200" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="lw-hub" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3399ff" />
            <stop offset="100%" stopColor="#001133" />
          </radialGradient>
          <linearGradient id="lw-rim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="50%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#003380" />
          </linearGradient>
          <filter id="lw-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="lw-softglow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer tyre */}
        <circle cx="100" cy="100" r="92" fill="none" stroke="#0d1a2e" strokeWidth="14" />
        <circle cx="100" cy="100" r="92" fill="none" stroke="#0a1220" strokeWidth="10" />

        {/* Rim ring */}
        <circle
          cx="100" cy="100" r="80"
          fill="none"
          stroke="url(#lw-rim)"
          strokeWidth="3"
          filter="url(#lw-glow)"
        />
        <circle cx="100" cy="100" r="76" fill="none" stroke="rgba(0,212,255,0.15)" strokeWidth="1" />

        {/* Spokes */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <line
              key={i}
              x1="100" y1="100"
              x2={100 + 78 * Math.cos(a)}
              y2={100 + 78 * Math.sin(a)}
              stroke="url(#lw-rim)"
              strokeWidth="1.5"
              opacity="0.7"
              filter="url(#lw-softglow)"
            />
          );
        })}

        {/* Hub */}
        <circle cx="100" cy="100" r="14" fill="url(#lw-hub)" filter="url(#lw-glow)" />
        <circle cx="100" cy="100" r="8" fill="#010810" />
        <circle cx="100" cy="100" r="4" fill="url(#lw-rim)" />

        {/* Highlight streak */}
        <path
          d="M26,62 A80,80 0 0,1 142,38"
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

/* ── Animated count-up number ── */
function CountUp({ to, duration = 2.5 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const ctrl = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return ctrl.stop;
  }, [to, duration]);
  return <>{val}</>;
}

/* ── Main Loading Screen ── */
export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);
  // 0 = wheel appear, 1 = particles orbit, 2 = particles form bike, 3 = fade bike / logo in, 4 = exit
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Phase timeline
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 3800),
      setTimeout(() => setPhase(4), 5000),
      setTimeout(() => { setDone(true); onComplete?.(); }, 5800),
    ];

    // Progress counter
    const steps = [
      { delay: 0, to: 0 },
      { delay: 300, to: 18 },
      { delay: 800, to: 42 },
      { delay: 1600, to: 65 },
      { delay: 2800, to: 83 },
      { delay: 3800, to: 97 },
      { delay: 4800, to: 100 },
    ];
    const progressTimers = steps.map(({ delay, to }) =>
      setTimeout(() => setProgress(to), delay)
    );

    return () => {
      timers.forEach(clearTimeout);
      progressTimers.forEach(clearTimeout);
    };
  }, [onComplete]);

  if (done) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
          style={{
            background: 'radial-gradient(ellipse at 35% 40%, #061428 0%, #020810 50%, #000508 100%)',
          }}
        >
          {/* ── Ambient background layers ── */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Radial glow behind wheel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(0,102,255,0.12) 0%, rgba(0,212,255,0.04) 40%, transparent 70%)' }}
            />
            {/* Top vignette */}
            <div className="absolute top-0 inset-x-0 h-40" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }} />
            {/* Bottom vignette */}
            <div className="absolute bottom-0 inset-x-0 h-40" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
            {/* Subtle grid */}
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{ backgroundImage: 'repeating-linear-gradient(0deg,#0066FF 0,#0066FF 1px,transparent 1px,transparent 80px)', backgroundSize: '100% 80px' }}
            />
            {/* Scan lines */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: 'repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(0,102,255,0.5) 2px,rgba(0,102,255,0.5) 3px)', backgroundSize: '6px 100%' }}
            />
          </div>

          {/* ── Canvas particles ── */}
          <LoadingCanvas phase={phase} />

          {/* ── Central animation area ── */}
          <div className="relative z-10 flex flex-col items-center justify-center">

            {/* Wheel + ring layers */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: phase <= 2 ? 1 : 0, scale: phase === 0 ? 0.3 : 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center"
            >
              {/* Outer glow rings */}
              {[160, 180, 200].map((size, i) => (
                <motion.div
                  key={size}
                  className="absolute rounded-full border"
                  style={{
                    width: size, height: size,
                    borderColor: `rgba(0,${102 + i * 40},255,${0.12 - i * 0.03})`,
                  }}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'linear' }}
                />
              ))}
              {/* Pulse ring */}
              <motion.div
                className="absolute rounded-full border border-accent/20"
                style={{ width: 220, height: 220 }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <GlowWheel phase={phase} />
            </motion.div>

            {/* Logo — fades in during phase 3 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 20 }}
              animate={{
                opacity: phase >= 3 ? 1 : 0,
                scale: phase >= 3 ? 1 : 0.75,
                y: phase >= 3 ? 0 : 20,
              }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute flex flex-col items-center gap-3"
            >
              {/* Icon mark */}
              <div className="relative mb-2">
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                  <defs>
                    <radialGradient id="logo-hub" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#3399ff" />
                      <stop offset="100%" stopColor="#001133" />
                    </radialGradient>
                    <linearGradient id="logo-rim" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00D4FF" />
                      <stop offset="50%" stopColor="#0066FF" />
                      <stop offset="100%" stopColor="#003380" />
                    </linearGradient>
                    <filter id="logo-glow">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  {/* Rear wheel */}
                  <circle cx="20" cy="46" r="18" fill="none" stroke="#0d1a2e" strokeWidth="5" />
                  <circle cx="20" cy="46" r="14" fill="none" stroke="url(#logo-rim)" strokeWidth="1.8" filter="url(#logo-glow)" />
                  {Array.from({ length: 8 }, (_, i) => {
                    const a = (i / 8) * Math.PI * 2;
                    return <line key={i} x1="20" y1="46" x2={20 + 13 * Math.cos(a)} y2={46 + 13 * Math.sin(a)} stroke="url(#logo-rim)" strokeWidth="0.8" opacity="0.7" />;
                  })}
                  <circle cx="20" cy="46" r="3.5" fill="url(#logo-hub)" />
                  {/* Front wheel */}
                  <circle cx="52" cy="46" r="18" fill="none" stroke="#0d1a2e" strokeWidth="5" />
                  <circle cx="52" cy="46" r="14" fill="none" stroke="url(#logo-rim)" strokeWidth="1.8" filter="url(#logo-glow)" />
                  {Array.from({ length: 8 }, (_, i) => {
                    const a = (i / 8) * Math.PI * 2;
                    return <line key={i} x1="52" y1="46" x2={52 + 13 * Math.cos(a)} y2={46 + 13 * Math.sin(a)} stroke="url(#logo-rim)" strokeWidth="0.8" opacity="0.7" />;
                  })}
                  <circle cx="52" cy="46" r="3.5" fill="url(#logo-hub)" />
                  {/* Frame */}
                  <line x1="20" y1="46" x2="36" y2="28" stroke="url(#logo-rim)" strokeWidth="2.2" strokeLinecap="round" filter="url(#logo-glow)" />
                  <line x1="36" y1="28" x2="52" y2="46" stroke="url(#logo-rim)" strokeWidth="2.2" strokeLinecap="round" filter="url(#logo-glow)" />
                  <line x1="36" y1="28" x2="36" y2="46" stroke="url(#logo-rim)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="20" y1="46" x2="36" y2="46" stroke="url(#logo-rim)" strokeWidth="1.8" strokeLinecap="round" />
                  {/* Saddle */}
                  <path d="M28,24 Q36,18 44,24" fill="none" stroke="url(#logo-rim)" strokeWidth="2.5" strokeLinecap="round" filter="url(#logo-glow)" />
                  {/* Handlebar */}
                  <line x1="52" y1="30" x2="52" y2="38" stroke="url(#logo-rim)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="47" y1="30" x2="57" y2="30" stroke="url(#logo-rim)" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {/* Icon glow halo */}
                <div className="absolute inset-0 rounded-full blur-2xl opacity-40" style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.8), transparent 70%)' }} />
              </div>

              {/* Store name */}
              <motion.h1
                initial={{ opacity: 0, letterSpacing: '0.5em' }}
                animate={{ opacity: phase >= 3 ? 1 : 0, letterSpacing: phase >= 3 ? '0.15em' : '0.5em' }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-white font-bold uppercase text-center"
                style={{ fontSize: 'clamp(1.1rem, 3vw, 1.6rem)', fontFamily: "'Inter', sans-serif", textShadow: '0 0 40px rgba(0,212,255,0.5)' }}
              >

              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: phase >= 3 ? 0.65 : 0, y: phase >= 3 ? 0 : 8 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-accent text-xs tracking-[0.4em] uppercase text-center"
              >
                Ride Beyond Limits
              </motion.p>

              {/* Decorative line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: phase >= 3 ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mt-1 h-px w-48"
                style={{ background: 'linear-gradient(to right, transparent, #00D4FF, #0066FF, transparent)' }}
              />
            </motion.div>
          </div>

          {/* ── Bottom progress section ── */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-8 pb-10 flex flex-col items-center gap-4">
            {/* Percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-baseline gap-1"
            >
              <span
                className="font-bold tabular-nums"
                style={{
                  fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                  fontFamily: "'Inter', sans-serif",
                  background: 'linear-gradient(135deg, #ffffff, #00D4FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: 'none',
                }}
              >
                <CountUp to={progress} duration={0.6} />
              </span>
              <span className="text-gray-500 text-sm font-semibold">%</span>
            </motion.div>

            {/* Progress bar track */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative w-full max-w-sm h-px rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.07)' }}
            >
              {/* Fill */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: 'linear-gradient(to right, #0066FF, #00D4FF)' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Shimmer */}
              <motion.div
                className="absolute inset-y-0 w-20 rounded-full"
                style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.35), transparent)' }}
                animate={{ left: [`${Math.max(progress - 15, -20)}%`, `${progress}%`] }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              {/* Glow dot at tip */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                style={{ background: '#00D4FF', boxShadow: '0 0 8px #00D4FF, 0 0 20px rgba(0,212,255,0.8)' }}
                animate={{ left: `calc(${progress}% - 3px)` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>

            {/* Status text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.7 }}
              className="text-gray-500 text-[10px] tracking-[0.3em] uppercase"
            >
              {progress < 30 ? 'Initialising Experience' : progress < 65 ? 'Loading Showroom' : progress < 95 ? 'Preparing Collection' : 'Welcome'}
            </motion.p>
          </div>

          {/* ── Corner accent marks (luxury aesthetic) ── */}
          {[
            'top-6 left-6 border-t border-l',
            'top-6 right-6 border-t border-r',
            'bottom-6 left-6 border-b border-l',
            'bottom-6 right-6 border-b border-r',
          ].map((cls) => (
            <motion.div
              key={cls}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`absolute w-6 h-6 ${cls}`}
              style={{ borderColor: 'rgba(0,212,255,0.5)' }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
