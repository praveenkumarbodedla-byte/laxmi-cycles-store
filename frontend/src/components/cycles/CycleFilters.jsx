import { motion } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BRANDS = ['Hero', 'Vesco', 'Sun Bride', 'Afro'];
const SIZES = ['16 inch', '18 inch', '20 inch', '24 inch', '26 inch', '30 inch'];
const CATEGORIES = ['Mountain', 'Road', 'Kids', 'Sports', 'Hybrid', 'City'];
const GEARS = ['Single Speed', '7-Speed', '18-Speed', '21-Speed'];

export default function CycleFilters({ filters, onChange, onReset }) {
  const { t } = useTranslation();
  const hasFilters = filters.brand || filters.category || filters.size || filters.minPrice || filters.maxPrice || filters.gears || filters.isAvailable;

  const SORT_OPTIONS = [
    { value: '-createdAt', label: t('cycles.sortOptions.newest') },
    { value: 'price', label: t('cycles.sortOptions.priceLowHigh') },
    { value: '-price', label: t('cycles.sortOptions.priceHighLow') },
    { value: 'name', label: t('cycles.sortOptions.nameAZ') },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-6 sticky top-24 space-y-7"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-primary" />
          <h3 className="font-display font-bold text-white text-lg">{t('cycles.filtersDrawerTitle')}</h3>
        </div>
        {hasFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            <X size={12} /> {t('compare.clearAll')}
          </button>
        )}
      </div>

      {/* Brand filter */}
      <div>
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">{t('cycles.filterBrand')}</p>
        <div className="space-y-2">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="brand"
                value={brand}
                checked={filters.brand === brand}
                onChange={() => onChange('brand', filters.brand === brand ? '' : brand)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                filters.brand === brand ? 'border-primary bg-primary' : 'border-gray-600 group-hover:border-primary/60'
              }`}>
                {filters.brand === brand && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className={`text-sm transition-colors ${filters.brand === brand ? 'text-white font-semibold' : 'text-gray-400 group-hover:text-white'}`}>
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Size filter */}
      <div>
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">{t('cycles.filterSize')}</p>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onChange('size', filters.size === size ? '' : size)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filters.size === size
                  ? 'bg-primary text-white border border-primary'
                  : 'border border-white/10 text-gray-400 hover:border-primary/50 hover:text-white'
              }`}
            >
              {size.replace('inch', t('sizes.inch'))}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Category filter */}
      <div>
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">{t('cycles.filterCategory')}</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onChange('category', filters.category === cat ? '' : cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filters.category === cat
                  ? 'bg-primary text-white border border-primary'
                  : 'border border-white/10 text-gray-400 hover:border-primary/50 hover:text-white'
              }`}
            >
              {t(`cycles.categories.${cat}`, cat)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Gear filter */}
      <div>
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">{t('compare.gears')}</p>
        <div className="flex flex-wrap gap-2">
          {GEARS.map((gear) => (
            <button
              key={gear}
              onClick={() => onChange('gears', filters.gears === gear ? '' : gear)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filters.gears === gear
                  ? 'bg-primary text-white border border-primary'
                  : 'border border-white/10 text-gray-400 hover:border-primary/50 hover:text-white'
              }`}
            >
              {t(`cycles.gears.${gear}`, gear)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Price range */}
      <div>
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">{t('cycles.price')}</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">{t('cycles.min', 'Min')} (₹)</label>
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => onChange('minPrice', e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">{t('cycles.max', 'Max')} (₹)</label>
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => onChange('maxPrice', e.target.value)}
              placeholder="100000"
              className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Availability */}
      <div>
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">{t('cycles.filterAvailability', 'Availability')}</p>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.isAvailable === 'true'}
            onChange={(e) => onChange('isAvailable', e.target.checked ? 'true' : '')}
            className="sr-only"
          />
          <div className={`w-10 h-5 rounded-full transition-all duration-300 flex items-center ${
            filters.isAvailable === 'true' ? 'bg-primary' : 'bg-dark-600 border border-white/10'
          }`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
              filters.isAvailable === 'true' ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'
            }`} />
          </div>
          <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{t('cycles.inStockOnly')}</span>
        </label>
      </div>

      <div className="h-px bg-white/5" />

      {/* Sort */}
      <div>
        <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">{t('cycles.sortBy')}</p>
        <select
          value={filters.sort || '-createdAt'}
          onChange={(e) => onChange('sort', e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-dark-700 border border-white/10 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </motion.aside>
  );
}
