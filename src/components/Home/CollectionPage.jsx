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
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${filter === cat
                  ? 'bg-[#11d452] text-[#102216]'
                  : 'bg-black/20 text-gray-300 border border-white/10 hover:bg-[#11d452]/20 hover:text-[#11d452] hover:border-[#11d452]/30'
                }
              `}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPerfumes.map((perfume) => (
            <div
              key={perfume.id}
              className="bg-black/20 rounded-xl overflow-hidden border border-white/10 hover:border-[#11d452]/30 transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={perfume.imageUrl}
                  alt={perfume.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102216] via-transparent to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <span className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white">
                    ${perfume.price}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-[#11d452]/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#11d452]">
                    {perfume.scentFamily}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-white">{perfume.name}</h3>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">{perfume.brand}</p>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {perfume.description}
                </p>

                {/* Notes */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {perfume.notes.top.slice(0, 2).map((note, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded">
                      {note}
                    </span>
                  ))}
                  {perfume.notes.middle.slice(0, 1).map((note, i) => (
                    <span key={`mid-${i}`} className="text-xs px-2 py-1 bg-teal-500/10 text-teal-400 rounded">
                      {note}
                    </span>
                  ))}
                </div>

                <button
                  className="w-full py-3 rounded-lg bg-[#D4A373]/20 text-[#D4A373] font-bold text-sm hover:bg-[#D4A373] hover:text-[#102216] transition-all duration-300"
                >
                  Add to Cart
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
