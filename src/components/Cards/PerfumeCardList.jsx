import React from 'react';
import PerfumeCard from './PerfumeCard';

/**
 * PerfumeCardList Component
 * Horizontal scrollable list of perfume cards for chat
 * Overflow is contained to this component only
 */
export default function PerfumeCardList({ perfumes }) {
  if (!perfumes || perfumes.length === 0) {
    return null;
  }

  // Limit to max 2 cards to avoid overwhelming users
  const displayPerfumes = perfumes.slice(0, 2);

  return (
    <div className="w-full overflow-hidden">
      <p className="text-xs text-gray-500 mb-2">
        {perfumes.length > 2
          ? `Showing top 2 of ${perfumes.length} matches`
          : `Found ${perfumes.length} perfume${perfumes.length > 1 ? 's' : ''}`
        }
      </p>
      <div className="overflow-x-auto overflow-y-hidden pb-2 -mx-1 px-1">
        <div className="flex gap-3 w-max">
          {displayPerfumes.map((perfume) => (
            <div key={perfume.id} className="w-52 flex-shrink-0">
              <PerfumeCard perfume={perfume} compact />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
