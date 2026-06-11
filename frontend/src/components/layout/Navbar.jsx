import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, GitCompare, User, LogOut, FileText, ChevronDown } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import LogoMark from './LogoMark';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

/* ── Navigation configuration ─────────────────────────────────────────────
   Every item has a `hash` that maps to a section id on the homepage.
   The Intersection Observer tracks all these sections for the active pill.
   `sectionId` is the id attribute of the DOM element to observe.          */
const NAV_ITEMS = [
  { labelKey: 'nav.home',    hash: '#hero',       sectionId: 'hero' },
  { labelKey: 'nav.brands',  hash: '#brands',     sectionId: 'brands' },
  { labelKey: 'nav.sizes',   hash: '#sizes',      sectionId: 'sizes' },
  { labelKey: 'nav.collection', hash: '#collection', sectionId: 'collection' },
  { labelKey: 'nav.compare', hash: '#compare',    sectionId: 'compare' },
  { labelKey: 'nav.gallery', hash: '#gallery',    sectionId: 'gallery' },
  { labelKey: 'nav.reviews', hash: '#reviews',    sectionId: 'reviews' },
  { labelKey: 'nav.contact', hash: '#contact',    sectionId: 'contact' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [profileOpen, setProfileOpen] = useState(false);
  const [enquiriesOpen, setEnquiriesOpen] = useState(false);
  const [myEnquiries, setMyEnquiries] = useState([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { compareList } = useCompare();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchMyEnquiries = async () => {
    setLoadingEnquiries(true);
    try {
      const res = await api.get('/api/enquiries/my');
      setMyEnquiries(res.data.data);
    } catch (err) {
      console.error('Failed to fetch user enquiries', err);
    } finally {
      setLoadingEnquiries(false);
    }
  };

  // Scroll lock system to prevent observer triggering during smooth scrolling and page transitions
  const lockActiveSectionRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  /* ── Scroll detection ───────────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Section-based active tracking using Intersection Observer ──────── */
  useEffect(() => {
    if (location.pathname !== '/') {
      // Not on homepage: no section tracking needed
      setActiveSection('');
      return;
    }

    // Use 40% margins on top and bottom so a section becomes "active" when it
    // occupies the central 20% band of the viewport — prevents simultaneous
    // activation of adjacent sections and stops flickering at boundaries.
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    };

    // Track the latest intersecting entry by section order (last one wins)
    // to handle cases where two sections are simultaneously in the band.
    const SECTION_ORDER = ['hero', 'brands', 'sizes', 'collection', 'compare', 'gallery', 'reviews', 'contact'];
    const visibleSections = new Set();

    const handleIntersection = (entries) => {
      if (lockActiveSectionRef.current !== null) return;

      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        if (entry.isIntersecting) {
          visibleSections.add(id);
        } else {
          visibleSections.delete(id);
        }
      });

      // Pick the section that appears first in page order (topmost visible wins)
      if (visibleSections.size > 0) {
        for (const id of SECTION_ORDER) {
          if (visibleSections.has(id)) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const observeElements = () => {
      SECTION_ORDER.forEach((id) => {
        const el = document.getElementById(id);
        if (el && !el._observed) {
          el._observed = true;
          observer.observe(el);
        }
      });
    };

    observeElements();

    // Re-observe if sections mount late (dynamic content)
    const mutationObserver = new MutationObserver(observeElements);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      // Clean up _observed flags
      SECTION_ORDER.forEach((id) => {
        const el = document.getElementById(id);
        if (el) delete el._observed;
      });
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  /* ── Close mobile on route change ───────────────────────────────────── */
  useEffect(() => { setMobileOpen(false); }, [location]);

  /* ── Lock body scroll when mobile menu is open ──────────────────────── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  /* ── Handle hash-based navigation ──────────────────────────────────── */
  const handleNavClick = useCallback((item, e) => {
    e.preventDefault();
    const targetId = item.sectionId;

    // Lock active section immediately to prevent observer flicker during scroll
    lockActiveSectionRef.current = targetId;
    setActiveSection(targetId);

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      lockActiveSectionRef.current = null;
    }, 1400);

    if (location.pathname !== '/') {
      // Navigate to homepage first, then scroll to section
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 350);
    } else {
      // Already on homepage: scroll directly
      if (targetId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    setMobileOpen(false);
  }, [location.pathname, navigate]);

  /* ── Check if a nav item is currently active ────────────────────────── */
  const isItemActive = useCallback((item) => {
    if (location.pathname === '/') {
      // On homepage: active state driven entirely by scroll/observer
      return activeSection === item.sectionId;
    }
    // On other pages: nothing is active (all items go back to homepage)
    return false;
  }, [location.pathname, activeSection]);

  return (
    <>
      {/* ── Main Navbar ─────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? 'rgba(5, 10, 25, 0.72)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)',
          backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex items-center justify-between transition-all duration-500"
            style={{ height: scrolled ? '60px' : '72px' }}
          >

            {/* ── Logo ──────────────────────────────────────────────────── */}
            <Link to="/" className="flex items-center gap-3 group relative">
              {/* Glow halo behind logo */}
              <div className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(ellipse, rgba(0,102,255,0.15), transparent 70%)' }} />
              <div className="relative">
                <LogoMark />
              </div>
              <div className="relative">
                <span className="font-display font-bold text-lg tracking-[0.2em] text-white leading-none block">
                  LAXMI
                </span>
                <span className="block text-[9px] font-semibold tracking-[0.25em] leading-none mt-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #00D4FF, #0066FF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                  CYCLES STORE
                </span>
              </div>
            </Link>

            {/* ── Desktop Navigation ────────────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_ITEMS.map((item) => {
                const active = isItemActive(item);
                return (
                  <a
                    key={item.label}
                    href={`/${item.hash}`}
                    onClick={(e) => handleNavClick(item, e)}
                    className={`relative px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all duration-300 group ${
                      active
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {/* Hover background */}
                    <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/[0.06] transition-all duration-300" />

                    {/* Label */}
                    <span className="relative z-10">{t(item.labelKey)}</span>

                    {/* Active underline glow — uses layoutId for smooth spring animation */}
                    {active && (
                      <motion.div
                        layoutId="nav-active-pill"
                        className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-sm"
                        style={{
                          background: '#0066FF',
                        }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* ── Right Actions (desktop) ───────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language Selector */}
              <LanguageSelector />

              {/* Compare badge */}
              {compareList.length > 0 && (
                <Link
                  to="/compare"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-300 border border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50"
                  style={{ backdropFilter: 'blur(8px)' }}
                >
                  <GitCompare size={14} />
                  {t('nav.compare')} ({compareList.length})
                </Link>
              )}

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] hover:border-white/20 transition-all text-white font-semibold text-[13px]"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold uppercase text-white shadow-glow-blue">
                      {user.name?.[0] || 'U'}
                    </div>
                    <span className="max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown size={12} className={`text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <>
                        {/* Click outdoor to close */}
                        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />

                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-52 rounded-2xl glass-card-dark border border-white/10 p-2 shadow-2xl z-50 overflow-hidden text-left"
                        >
                          <div className="px-3 py-2 border-b border-white/5 mb-1.5">
                            <p className="text-[12px] font-bold text-white truncate">{user.name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                          </div>

                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              setProfileOpen(true);
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[12px] text-gray-300 hover:text-white hover:bg-white/5 transition-all text-left"
                          >
                            <User size={13} className="text-primary" />
                            {t('nav.myProfile')}
                          </button>

                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              setEnquiriesOpen(true);
                              fetchMyEnquiries();
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[12px] text-gray-300 hover:text-white hover:bg-white/5 transition-all text-left"
                          >
                            <FileText size={13} className="text-accent" />
                            {t('nav.myEnquiries')}
                          </button>

                          <div className="border-t border-white/5 my-1.5" />

                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              logout();
                              toast.success('Logged out successfully');
                              navigate('/login');
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[12px] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left font-semibold"
                          >
                            <LogOut size={13} />
                            {t('nav.logout')}
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-bold text-white overflow-hidden transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #0066FF, #0044BB)',
                    boxShadow: '0 0 20px rgba(0,102,255,0.3), inset 0 1px 0 rgba(255,255,255,0.12)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 32px rgba(0,102,255,0.55), inset 0 1px 0 rgba(255,255,255,0.12)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(0,102,255,0.3), inset 0 1px 0 rgba(255,255,255,0.12)'; }}
                >
                  {/* Shimmer effect */}
                  <span
                    className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                  />
                  <span className="relative">{t('nav.login')}</span>
                  <ChevronRight size={14} className="relative group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>
              )}
            </div>

            {/* ── Mobile hamburger ──────────────────────────────────────── */}
            <button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 text-white/80 hover:text-white hover:border-white/20 transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={18} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile overlay backdrop ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── Mobile slide-out menu ────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed inset-y-0 right-0 w-80 max-w-[85vw] z-50 flex flex-col lg:hidden overflow-y-auto"
            style={{
              background: 'rgba(5, 10, 25, 0.92)',
              backdropFilter: 'blur(30px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(30px) saturate(1.6)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <LogoMark />
                <div>
                  <span className="font-display font-bold text-base tracking-[0.15em] text-white block leading-none">LAXMI</span>
                  <span className="text-[8px] font-semibold tracking-[0.2em] leading-none mt-0.5 block"
                    style={{ background: 'linear-gradient(135deg, #00D4FF, #0066FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    CYCLES STORE
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 p-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item, i) => {
                const active = isItemActive(item);
                return (
                  <motion.div
                    key={item.labelKey}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      href={`/${item.hash}`}
                      onClick={(e) => handleNavClick(item, e)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        active
                          ? 'text-white bg-primary/15 border border-primary/25'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <ChevronRight size={14} className={active ? 'text-primary' : 'text-primary/60'} />
                      {t(item.labelKey)}
                      {active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                          style={{ boxShadow: '0 0 6px rgba(0,102,255,0.8)' }} />
                      )}
                    </a>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom section */}
            <div className="p-4 pt-2 border-t border-white/[0.06] space-y-3">
              {compareList.length > 0 && (
                <Link
                  to="/compare"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-accent/30 text-accent text-sm font-semibold hover:bg-accent/10 transition-all"
                >
                  <GitCompare size={14} />
                  {t('nav.compare')} ({compareList.length})
                </Link>
              )}

              {user ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-left">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                    <span className="inline-block text-[9px] uppercase tracking-wider text-primary font-bold mt-1 bg-primary/10 px-1.5 py-0.5 rounded">
                      {user.role}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setProfileOpen(true);
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-gray-300 hover:text-white text-sm"
                  >
                    <User size={14} className="text-primary" />
                    {t('nav.myProfile')}
                  </button>

                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setEnquiriesOpen(true);
                      fetchMyEnquiries();
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 text-gray-300 hover:text-white text-sm"
                  >
                    <FileText size={14} className="text-accent" />
                    {t('nav.myEnquiries')}
                  </button>

                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                      toast.success('Logged out successfully');
                      navigate('/login');
                    }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold border border-red-500/20 transition-all"
                  >
                    <LogOut size={14} />
                    {t('nav.logout').toUpperCase()}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold text-white transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #0066FF, #0044BB)',
                    boxShadow: '0 0 20px rgba(0,102,255,0.3)',
                  }}
                >
                  {t('nav.login')}
                  <ChevronRight size={14} />
                </Link>
              )}
              {/* Mobile Language Selector */}
              <div className="flex justify-center pt-1">
                <LanguageSelector compact />
              </div>
              <p className="text-center text-[10px] text-gray-600 mt-2 tracking-wider">
                © {new Date().getFullYear()} Laxmi Cycles Store
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Profile Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {profileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md glass-card-dark border border-primary/30 p-6 rounded-3xl z-50 shadow-2xl">
              <button onClick={() => setProfileOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={18} /></button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold uppercase text-white shadow-glow-blue mx-auto mb-3">
                  {user?.name?.[0]}
                </div>
                <h3 className="font-display font-bold text-xl text-white">{user?.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full mt-2.5">
                  {user?.role} Account
                </span>
              </div>
              <div className="space-y-3.5 border-t border-white/5 pt-4 text-sm text-left">
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Type</span>
                  <span className="text-white font-medium capitalize">{user?.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Security Level</span>
                  <span className="text-green-400 font-medium">Standard JWT Secure</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Enquiries Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {enquiriesOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEnquiriesOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl glass-card-dark border border-primary/30 p-6 rounded-3xl z-50 shadow-2xl max-h-[80vh] flex flex-col">
              <button onClick={() => setEnquiriesOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={18} /></button>
              <div className="mb-4 text-left">
                <h3 className="font-display font-bold text-xl text-white">My Enquiries</h3>
                <p className="text-xs text-gray-400 mt-0.5">Track your cycle enquiries and notes</p>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                {loadingEnquiries ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-xs text-gray-500">Loading your enquiries...</p>
                  </div>
                ) : myEnquiries.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-12">You haven't submitted any enquiries yet.</p>
                ) : (
                  myEnquiries.map((enq) => (
                    <div key={enq._id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors text-left animate-fade-in">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <h4 className="font-semibold text-white text-sm">{enq.cycleName}</h4>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg border ${
                          enq.status === 'new' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' :
                          enq.status === 'read' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                          enq.status === 'replied' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                          'text-gray-400 bg-gray-400/10 border-gray-400/20'
                        }`}>
                          {enq.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs line-clamp-2 italic">"{enq.message}"</p>
                      {enq.adminNotes && (
                        <div className="mt-2.5 p-2 rounded-lg bg-primary/5 border border-primary/10 text-[11px] text-gray-300">
                          <strong className="text-primary">Admin Reply:</strong> {enq.adminNotes}
                        </div>
                      )}
                      <div className="text-[10px] text-gray-600 mt-2">
                        Submitted on {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
