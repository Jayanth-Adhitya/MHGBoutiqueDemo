import React, { useState } from 'react';
import perfumesData from '../../data/perfumes.json';

export default function CollectionPage({ onStartChat }) {
  const [filter, setFilter] = useState('all');
  const allPerfumes = perfumesData.perfumes;

  // Get unique categories for filter
  const categories = ['all', ...new Set(allPerfumes.map(p => p.scentFamily))];

  const filteredPerfumes = filter === 'all'
    ? allPerfumes
    : allPerfumes.filter(p => p.scentFamily === filter);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-[960px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            The Collection
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base">
            Explore our complete library of nature-inspired fragrances.
            From fresh ocean breezes to deep woody notes, find the scent that speaks to your soul.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 mb-6 md:mb-10 px-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`
                px-2 py-1 md:px-4 md:py-2 rounded md:rounded-lg text-[10px] md:text-sm font-medium transition-all duration-300
                ${filter === cat
                  ? 'bg-[#11d452] text-[#102216]'
                  : 'bg-black/20 text-gray-300 border border-white/10 hover:bg-[#11d452]/20 hover:text-[#11d452] hover:border-[#11d452]/30'
                }
              `}
            >
              {cat === 'all' ? 'All' : cat.split('/')[0]}
            </button>
          ))}
        </div>

        {/* Grid - 3 columns on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
          {filteredPerfumes.map((perfume) => (
            <div
              key={perfume.id}
              className="bg-black/20 rounded-lg md:rounded-xl overflow-hidden border border-white/10 hover:border-[#11d452]/30 transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative aspect-square md:h-48 lg:h-56 overflow-hidden">
                <img
                  src={perfume.imageUrl}
                  alt={perfume.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102216] via-transparent to-transparent"></div>
                {/* Price - hidden on mobile */}
                <div className="hidden md:block absolute top-3 right-3">
                  <span className="bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-bold text-white">
                    ${perfume.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-2 md:p-4">
                <div className="mb-1 md:mb-2">
                  <h3 className="text-xs md:text-base font-bold text-white truncate">{perfume.name}</h3>
                  <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wider truncate">{perfume.brand}</p>
                </div>

                {/* Price on mobile */}
                <p className="md:hidden text-[#D4A373] text-xs font-bold mb-1">${perfume.price}</p>

                {/* Description - hidden on mobile */}
                <p className="hidden md:block text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                  {perfume.description}
                </p>

                {/* Notes - hidden on mobile */}
                <div className="hidden md:flex flex-wrap gap-1.5 mb-4">
                  {perfume.notes.top.slice(0, 2).map((note, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">
                      {note}
                    </span>
                  ))}
                </div>

                <button
                  className="w-full py-1.5 md:py-2.5 rounded md:rounded-lg bg-[#D4A373]/20 text-[#D4A373] font-bold text-[10px] md:text-sm hover:bg-[#D4A373] hover:text-[#102216] transition-all duration-300"
                >
                  <span className="md:hidden">Add</span>
                  <span className="hidden md:inline">Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredPerfumes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No perfumes found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
