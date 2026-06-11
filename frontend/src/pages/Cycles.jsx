import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bike, Filter, X, ArrowLeft, GitCompare, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import CycleCard from '../components/cycles/CycleCard';
import CycleFilters from '../components/cycles/CycleFilters';
import CycleListItem from '../components/cycles/CycleListItem';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';

const DEFAULT_FILTERS = {
  brand: '',
  category: '',
  size: '',
  minPrice: '',
  maxPrice: '',
  isAvailable: '',
  sort: '-createdAt',
  search: '',
  gears: '',
};

const getBrandFromQuery = (queryVal) => {
  if (!queryVal) return '';
  const val = queryVal.toLowerCase().replace(/-/g, ' ');
  if (val === 'hero') return 'Hero';
  if (val === 'vesco') return 'Vesco';
  if (val === 'sun bride') return 'Sun Bride';
  if (val === 'afro') return 'Afro';
  return queryVal;
};

export default function Cycles() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { compareList } = useCompare();
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    category: searchParams.get('category') || '',
    brand: getBrandFromQuery(searchParams.get('brand')) || '',
  });

  // Sync query parameters with filters state when searchParams changes (e.g. navigation)
  useEffect(() => {
    const queryBrand = searchParams.get('brand');
    const queryCategory = searchParams.get('category');
    if (queryBrand !== null || queryCategory !== null) {
      setFilters((prev) => ({
        ...prev,
        brand: queryBrand !== null ? getBrandFromQuery(queryBrand) : prev.brand,
        category: queryCategory !== null ? queryCategory : prev.category,
      }));
    }
  }, [searchParams]);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  const fetchCycles = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...filters };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await api.get('/api/cycles', { params });
      setCycles(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setCycles([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch immediately on first mount; debounce only subsequent filter changes
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      fetchCycles(1);
      return;
    }
    const timer = setTimeout(() => fetchCycles(1), 250);
    return () => clearTimeout(timer);
  }, [fetchCycles]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <>
      {/* Mobile-only styles to override global navbar */}
      <style>{`
        @media (max-width: 1023px) {
          nav { display: none !important; }
          main { padding-top: 0 !important; }
        }
      `}</style>

      {/* ── MOBILE VIEW (lg:hidden) ────────────────────────────────────── */}
      <div className="lg:hidden min-h-screen bg-dark-800 text-white pb-20 flex flex-col">
        {/* Sticky Flipkart Header */}
        <div className="sticky top-0 z-[1000] bg-[#050A14] border-b border-white/10 px-3 py-2 flex items-center gap-2">
          <button onClick={() => navigate('/')} className="p-1 text-gray-400 hover:text-white" aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder={t('cycles.searchPlaceholder')}
              className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-dark-700 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
            />
            {filters.search && (
              <button onClick={() => handleFilterChange('search', '')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          <Link to="/compare" className="relative p-2 text-gray-400 hover:text-white" aria-label="Compare list">
            <GitCompare size={20} />
            {compareList.length > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-glow-blue">
                {compareList.length}
              </span>
            )}
          </Link>
        </div>

        {/* Sticky Quick-Filters Row */}
        <div className="sticky top-[49px] z-[999] bg-[#050A14]/95 backdrop-blur-md border-b border-white/5 py-2 px-3 flex gap-2 overflow-x-auto select-none no-scrollbar">
          <button
            onClick={() => setMobileSortOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-dark-700 text-[11px] font-medium text-white whitespace-nowrap"
          >
            {t('cycles.sortDrawerTitle')} <ChevronDown size={12} className="text-gray-400" />
          </button>

          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-dark-700 text-[11px] font-medium text-white whitespace-nowrap"
          >
            <Filter size={10} className="text-gray-400" /> {t('cycles.filtersDrawerTitle')}
          </button>

          {/* Quick filter: Available Only */}
          <button
            onClick={() => handleFilterChange('isAvailable', filters.isAvailable === 'true' ? '' : 'true')}
            className={`px-3 py-1 rounded-full border text-[11px] font-medium whitespace-nowrap transition-all duration-200 ${
              filters.isAvailable === 'true'
                ? 'bg-primary border-primary text-white'
                : 'border-white/10 bg-dark-700 text-gray-400'
            }`}
          >
            {t('cycles.availableOnly')}
          </button>

          {/* Quick filter: Kids' Cycles */}
          <button
            onClick={() => handleFilterChange('category', filters.category === 'Kids' ? '' : 'Kids')}
            className={`px-3 py-1 rounded-full border text-[11px] font-medium whitespace-nowrap transition-all duration-200 ${
              filters.category === 'Kids'
                ? 'bg-primary border-primary text-white'
                : 'border-white/10 bg-dark-700 text-gray-400'
            }`}
          >
            {t('cycles.kidsCycles')}
          </button>

          {/* Quick filter: Sort Low-High */}
          <button
            onClick={() => handleFilterChange('sort', filters.sort === 'price' ? '-createdAt' : 'price')}
            className={`px-3 py-1 rounded-full border text-[11px] font-medium whitespace-nowrap transition-all duration-200 ${
              filters.sort === 'price'
                ? 'bg-primary border-primary text-white'
                : 'border-white/10 bg-dark-700 text-gray-400'
            }`}
          >
            {t('cycles.priceLowHigh')}
          </button>
        </div>

        {/* Cycles list or loading or empty state */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="divide-y divide-white/5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex p-3 gap-3 animate-pulse">
                  <div className="w-[100px] h-[100px] rounded-lg bg-dark-700" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-4 bg-dark-700 rounded w-2/3" />
                    <div className="h-3 bg-dark-700 rounded w-full" />
                    <div className="h-4 bg-dark-700 rounded w-1/3" />
                    <div className="h-3 bg-dark-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : cycles.length === 0 ? (
            <div className="text-center py-20 px-4">
              <Bike size={48} className="text-gray-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">{t('cycles.noResults')}</h3>
              <p className="text-xs text-gray-400 mb-4">{t('cycles.noResultsSub')}</p>
              <button onClick={resetFilters} className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg">{t('cycles.clearFilters')}</button>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {cycles.map((cycle) => (
                <CycleListItem cycle={cycle} key={cycle._id} />
              ))}
            </div>
          )}

          {/* Mobile Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-1.5 py-6 px-4 border-t border-white/5">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchCycles(i + 1)}
                  className={`w-8 h-8 rounded-lg font-semibold text-xs transition-all ${
                    pagination.page === i + 1
                      ? 'bg-primary text-white'
                      : 'border border-white/10 text-gray-400 bg-dark-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── DESKTOP VIEW (hidden lg:block) ───────────────────────────────── */}
      <div className="hidden lg:block min-h-screen pt-20 pb-40 bg-dark-800">
        {/* Header */}
        <div className="relative py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900 to-dark-800" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-primary/8 blur-3xl rounded-full pointer-events-none" />
          <div className="relative max-w-7xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-accent text-sm font-semibold tracking-widest uppercase mb-3"
            >
              — {t('collection.sectionLabel')}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="section-title gradient-text mb-6"
            >
              {t('cycles.pageTitle')}
            </motion.h1>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-xl mx-auto"
            >
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder={t('cycles.searchPlaceholderDesktop')}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-dark-700 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {filters.search && (
                <button onClick={() => handleFilterChange('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  <X size={16} />
                </button>
              )}
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Desktop Filters */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <CycleFilters filters={filters} onChange={handleFilterChange} onReset={resetFilters} />
            </div>

            {/* Cycles Grid */}
            <div className="flex-1 min-w-0">
              <div className="hidden lg:flex items-center justify-between mb-6">
                <p className="text-gray-400 text-sm">{t('cycles.cyclesFound', { count: pagination.total })}</p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="glass-card h-80 animate-pulse" />
                  ))}
                </div>
              ) : cycles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24"
                >
                  <Bike size={56} className="text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{t('cycles.noResults')}</h3>
                  <p className="text-gray-400 mb-6">{t('cycles.noResultsSub')}</p>
                  <button onClick={resetFilters} className="btn-outline">{t('cycles.clearFilters')}</button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {cycles.map((cycle, i) => (
                      <motion.div
                        key={cycle._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <CycleCard cycle={cycle} hideCompare={true} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => fetchCycles(i + 1)}
                      className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                        pagination.page === i + 1
                          ? 'bg-primary text-white shadow-glow-blue'
                          : 'border border-white/10 text-gray-400 hover:border-primary/50 hover:text-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 overflow-y-auto p-4 lg:hidden"
              style={{ background: '#05080F' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">{t('cycles.filtersDrawerTitle')}</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <CycleFilters filters={filters} onChange={handleFilterChange} onReset={() => { resetFilters(); setMobileFiltersOpen(false); }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Sort Drawer */}
      <AnimatePresence>
        {mobileSortOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSortOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 right-0 bottom-0 z-50 rounded-t-2xl p-4 lg:hidden"
              style={{ background: '#0A1628', borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm">{t('cycles.sortDrawerTitle')}</h3>
                <button onClick={() => setMobileSortOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { value: '-createdAt', label: t('cycles.sortOptions.newest') },
                  { value: 'price', label: t('cycles.sortOptions.priceLowHigh') },
                  { value: '-price', label: t('cycles.sortOptions.priceHighLow') },
                  { value: 'name', label: t('cycles.sortOptions.nameAZ') },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      handleFilterChange('sort', opt.value);
                      setMobileSortOpen(false);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-left transition-all ${
                      filters.sort === opt.value
                        ? 'bg-primary text-white'
                        : 'bg-dark-700/50 text-gray-300 hover:bg-dark-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
