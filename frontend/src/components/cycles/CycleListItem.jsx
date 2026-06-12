import { Link } from 'react-router-dom';
import { GitCompare, MessageCircle, Eye } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { useTranslation } from 'react-i18next';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919848116926';
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230A1628'/%3E%3Ccircle cx='120' cy='200' r='60' fill='none' stroke='%230066FF' stroke-width='6' opacity='0.5'/%3E%3Ccircle cx='280' cy='200' r='60' fill='none' stroke='%230066FF' stroke-width='6' opacity='0.5'/%3E%3Cpath d='M120 200L170 120H240L275 180' fill='none' stroke='%2300D4FF' stroke-width='5' opacity='0.4'/%3E%3Ctext x='200' y='280' text-anchor='middle' fill='%23334466' font-size='14' font-family='Inter'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function CycleListItem({ cycle }) {
  const { t } = useTranslation();
  const { addToCompare, isInCompare } = useCompare();
  
  const imageUrl = cycle.images?.[0]?.url || PLACEHOLDER_IMAGE;
  const whatsappMsg = encodeURIComponent(
    `Hello Laxmi Cycles Store,\nI am interested in the ${cycle.brand} ${cycle.name}.\nPlease provide more details.`
  );
  
  const sizeLabel = cycle.specifications?.wheelSize || cycle.specifications?.frameSize || cycle.size;
  const gearLabel = cycle.specifications?.gears;
  const typeLabel = cycle.category;
  
  const getAvailabilityText = (availability, isAvailable) => {
    const status = availability || (isAvailable ? 'available' : 'out_of_stock');
    if (status === 'available') return t('cycles.inStock');
    if (status === 'limited_stock') return t('collection.limitedStock', 'Limited Stock');
    return t('cycles.outOfStock');
  };
    
  const availabilityClass = (cycle.availability || (cycle.isAvailable ? 'available' : 'out_of_stock')) === 'available'
    ? 'text-green-400 bg-green-500/10 border-green-500/20'
    : (cycle.availability || (cycle.isAvailable ? 'available' : 'out_of_stock')) === 'limited_stock'
    ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    : 'text-red-400 bg-red-500/10 border-red-500/20';

  return (
    <div className="flex p-3 bg-dark-900/30 gap-3 hover:bg-dark-900/50 transition-colors">
      {/* Left Column: Image */}
      <div className="w-[100px] h-[100px] min-w-[100px] rounded-lg overflow-hidden bg-dark-700 relative border border-white/5 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={cycle.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
        />
      </div>

      {/* Right Column: Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Line 1: Brand + Name */}
          <h4 className="font-bold text-sm text-white leading-snug truncate">
            {cycle.brand} {cycle.name}
          </h4>

          {/* Line 2: Short Description */}
          <p className="text-[11px] text-gray-400 line-clamp-1 leading-normal mt-0.5">
            {cycle.description}
          </p>

          {/* Line 4: Price */}
          <p className="font-bold text-sm text-white mt-1">
            ₹{cycle.price?.toLocaleString('en-IN')}
          </p>

          {/* Line 5: Availability */}
          <div className="mt-1">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${availabilityClass}`}>
              {getAvailabilityText(cycle.availability, cycle.isAvailable)}
            </span>
          </div>

          {/* Line 6: Specs badges */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {sizeLabel && (
              <span className="text-[9px] px-1.5 py-0.5 rounded border border-white/10 bg-dark-800 text-gray-300">
                {t('cycles.filterSize')}: {sizeLabel.replace('inch', t('sizes.inch'))}
              </span>
            )}
            {typeLabel && (
              <span className="text-[9px] px-1.5 py-0.5 rounded border border-white/10 bg-dark-800 text-gray-300">
                {t(`cycles.categories.${typeLabel}`, typeLabel)}
              </span>
            )}
            {gearLabel && (
              <span className="text-[9px] px-1.5 py-0.5 rounded border border-white/10 bg-dark-800 text-gray-300">
                {t(`cycles.gears.${gearLabel}`, gearLabel)}
              </span>
            )}
          </div>
        </div>

        {/* Line 7: Buttons */}
        <div className="flex gap-2 mt-3 pt-2 border-t border-white/[0.04]">
          <button
            onClick={() => addToCompare(cycle)}
            className={`flex-1 py-1 rounded text-[10px] font-bold flex items-center justify-center gap-1 border transition-all ${
              isInCompare(cycle._id)
                ? 'border-accent/40 bg-accent/20 text-accent'
                : 'border-white/10 text-gray-300 bg-white/5 hover:border-primary/50'
            }`}
          >
            <GitCompare size={10} />
            {isInCompare(cycle._id) ? t('compare.added') : t('compare.compareBarTitle')}
          </button>
          
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-1 rounded text-[10px] font-bold flex items-center justify-center gap-1 bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25"
          >
            <MessageCircle size={10} />
            {t('compare.whatsapp', 'WhatsApp')}
          </a>

          <Link
            to={`/cycles/${cycle._id}`}
            className="flex-1 py-1 rounded text-[10px] font-bold flex items-center justify-center gap-1 border border-white/10 text-gray-300 bg-white/5 hover:border-primary/50 text-center"
          >
            <Eye size={10} />
            {t('cycles.checkOutDetails')}
          </Link>
        </div>
      </div>
    </div>
  );
}
