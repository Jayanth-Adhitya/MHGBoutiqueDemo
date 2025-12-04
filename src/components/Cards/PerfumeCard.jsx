import React from 'react';

/**
 * PerfumeCard Component
 * Displays a single perfume - supports compact mode for chat
 */
export default function PerfumeCard({ perfume, compact = false }) {
  const { name, brand, scentType, scentFamily, notes, price, description, imageUrl, gender, intensity } = perfume;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price);

  // Compact card for chat
  if (compact) {
    return (
      <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-[#11d452]/30 transition-all duration-300 group">
        {/* Image */}
        <div className="relative h-32 overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102216] via-transparent to-transparent" />
          <span className="absolute top-2 right-2 text-xs font-bold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {formattedPrice}
          </span>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-white truncate">{name}</h3>
          <p className="text-xs text-gray-500 mb-2">{brand}</p>

          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#11d452]/20 text-[#11d452] capitalize">
              {scentType}
            </span>
            <span className="text-[10px] text-gray-500">{scentFamily}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {notes.top.slice(0, 2).map((note, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400">
                {note}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full card
  const getPriceRangeColor = () => {
    if (price < 70) return 'bg-[#11d452]/20 text-[#11d452]';
    if (price < 150) return 'bg-amber-500/20 text-amber-400';
    return 'bg-rose-500/20 text-rose-400';
  };

  const getIntensityDots = () => {
    const levels = { light: 1, moderate: 2, strong: 3 };
    const level = levels[intensity] || 2;
    return Array(3).fill(0).map((_, i) => (
      <span
        key={i}
        className={`w-1.5 h-1.5 rounded-full ${i < level ? 'bg-[#11d452]' : 'bg-white/20'}`}
      />
    ));
  };

  return (
    <div className="perfume-card bg-black/20 rounded-xl overflow-hidden border border-white/10 hover:border-[#11d452]/30 transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-[#11d452]/10 to-[#102216]/50">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102216] via-transparent to-transparent" />

        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriceRangeColor()}`}>
            {formattedPrice}
          </span>
        </div>

        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-gray-300 capitalize backdrop-blur-sm">
            {gender}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-base font-semibold text-white truncate">{name}</h3>
          <p className="text-sm text-gray-400">{brand}</p>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 rounded-md text-xs bg-[#11d452]/20 text-[#11d452] capitalize">
            {scentType}
          </span>
          <span className="text-xs text-gray-600">•</span>
          <span className="text-xs text-gray-400">{scentFamily}</span>
        </div>

        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{description}</p>

        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {notes.top.slice(0, 2).map((note, i) => (
              <span key={`top-${i}`} className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400">
                {note}
              </span>
            ))}
            {notes.middle.slice(0, 1).map((note, i) => (
              <span key={`mid-${i}`} className="px-2 py-0.5 rounded text-xs bg-teal-500/10 text-teal-400">
                {note}
              </span>
            ))}
            {notes.base.slice(0, 1).map((note, i) => (
              <span key={`base-${i}`} className="px-2 py-0.5 rounded text-xs bg-cyan-500/10 text-cyan-400">
                {note}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 mr-1">Intensity:</span>
            {getIntensityDots()}
          </div>
          <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#11d452]/20 text-[#11d452] hover:bg-[#11d452] hover:text-[#102216] transition-all duration-300">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
