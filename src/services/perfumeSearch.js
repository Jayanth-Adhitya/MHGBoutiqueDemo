import perfumeData from '../data/perfumes.json';

/**
 * Search perfumes by various criteria
 * @param {Object} params - Search parameters
 * @param {string} params.scentType - Type of scent (ocean, floral, woody, etc.)
 * @param {string} params.scentFamily - Scent family category
 * @param {string} params.priceRange - Price range (budget, mid, luxury)
 * @param {string[]} params.notes - Specific notes to search for
 * @param {string} params.gender - Gender preference (masculine, feminine, unisex)
 * @param {string} params.query - Free text search query
 * @param {string[]} params.tags - Tags to search for (occasions, moods, etc.)
 * @param {string} params.occasion - Occasion (date night, office, wedding, etc.)
 * @param {string} params.mood - Mood/vibe (sexy, cozy, confident, etc.)
 * @param {string} params.season - Season (summer, winter, spring, fall)
 * @param {string} params.intensity - Intensity level (light, moderate, strong)
 * @returns {Object} Search results with matching perfumes
 */
export function searchPerfumes(params = {}) {
  const {
    scentType,
    scentFamily,
    priceRange,
    notes,
    gender,
    query,
    tags,
    occasion,
    mood,
    season,
    intensity
  } = params;

  let results = [...perfumeData.perfumes];

  // Search by scent type (exact or keyword match)
  if (scentType) {
    const searchTerm = scentType.toLowerCase();
    results = results.filter(perfume => {
      // Direct match on scentType
      if (perfume.scentType.toLowerCase().includes(searchTerm)) {
        return true;
      }
      // Check scent family keywords
      const family = perfumeData.scentFamilies.find(f =>
        f.name === perfume.scentFamily
      );
      if (family && family.keywords.some(kw => kw.includes(searchTerm) || searchTerm.includes(kw))) {
        return true;
      }
      // Check description
      if (perfume.description.toLowerCase().includes(searchTerm)) {
        return true;
      }
      // Check tags
      if (perfume.tags && perfume.tags.some(tag => tag.includes(searchTerm) || searchTerm.includes(tag))) {
        return true;
      }
      return false;
    });
  }

  // Search by scent family
  if (scentFamily) {
    const familyLower = scentFamily.toLowerCase();
    results = results.filter(perfume =>
      perfume.scentFamily.toLowerCase().includes(familyLower)
    );
  }

  // Filter by price range
  if (priceRange) {
    results = results.filter(perfume =>
      perfume.priceRange === priceRange.toLowerCase()
    );
  }

  // Search by specific notes
  if (notes && notes.length > 0) {
    const searchNotes = notes.map(n => n.toLowerCase());
    results = results.filter(perfume => {
      const allNotes = [
        ...perfume.notes.top,
        ...perfume.notes.middle,
        ...perfume.notes.base
      ].map(n => n.toLowerCase());

      return searchNotes.some(searchNote =>
        allNotes.some(note => note.includes(searchNote) || searchNote.includes(note))
      );
    });
  }

  // Filter by gender
  if (gender) {
    const genderLower = gender.toLowerCase();
    results = results.filter(perfume =>
      perfume.gender === genderLower || perfume.gender === 'unisex'
    );
  }

  // Search by tags (general tag search)
  if (tags && tags.length > 0) {
    const searchTags = tags.map(t => t.toLowerCase());
    results = results.filter(perfume => {
      if (!perfume.tags) return false;
      const perfumeTags = perfume.tags.map(t => t.toLowerCase());
      return searchTags.some(searchTag =>
        perfumeTags.some(tag => tag.includes(searchTag) || searchTag.includes(tag))
      );
    });
  }

  // Search by occasion
  if (occasion) {
    const occasionLower = occasion.toLowerCase();
    results = results.filter(perfume => {
      if (!perfume.tags) return false;
      return perfume.tags.some(tag =>
        tag.toLowerCase().includes(occasionLower) ||
        occasionLower.includes(tag.toLowerCase())
      );
    });
  }

  // Search by mood
  if (mood) {
    const moodLower = mood.toLowerCase();
    results = results.filter(perfume => {
      if (!perfume.tags) return false;
      return perfume.tags.some(tag =>
        tag.toLowerCase().includes(moodLower) ||
        moodLower.includes(tag.toLowerCase())
      );
    });
  }

  // Search by season
  if (season) {
    const seasonLower = season.toLowerCase();
    results = results.filter(perfume => {
      if (!perfume.tags) return false;
      return perfume.tags.some(tag =>
        tag.toLowerCase().includes(seasonLower) ||
        seasonLower.includes(tag.toLowerCase())
      );
    });
  }

  // Filter by intensity
  if (intensity) {
    results = results.filter(perfume =>
      perfume.intensity === intensity.toLowerCase()
    );
  }

  // Free text search across all fields including tags
  if (query) {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/);

    results = results.filter(perfume => {
      const searchableText = [
        perfume.name,
        perfume.brand,
        perfume.scentType,
        perfume.scentFamily,
        perfume.description,
        ...perfume.notes.top,
        ...perfume.notes.middle,
        ...perfume.notes.base,
        ...(perfume.tags || [])
      ].join(' ').toLowerCase();

      // Check if any query word matches
      return queryWords.some(word => searchableText.includes(word));
    });
  }

  return {
    success: true,
    count: results.length,
    perfumes: results,
    searchParams: params
  };
}

/**
 * Get a single perfume by ID
 * @param {string} id - Perfume ID
 * @returns {Object|null} Perfume object or null
 */
export function getPerfumeById(id) {
  return perfumeData.perfumes.find(p => p.id === id) || null;
}

/**
 * Get all available scent families
 * @returns {Array} List of scent families
 */
export function getScentFamilies() {
  return perfumeData.scentFamilies;
}

/**
 * Get perfumes by scent family
 * @param {string} familyName - Name of the scent family
 * @returns {Array} List of perfumes in that family
 */
export function getPerfumesByFamily(familyName) {
  return perfumeData.perfumes.filter(p =>
    p.scentFamily.toLowerCase().includes(familyName.toLowerCase())
  );
}

/**
 * Get all unique scent types
 * @returns {Array} List of unique scent types
 */
export function getAllScentTypes() {
  const types = new Set(perfumeData.perfumes.map(p => p.scentType));
  return Array.from(types);
}

/**
 * Get all unique tags from perfumes
 * @returns {Array} List of unique tags
 */
export function getAllTags() {
  const tags = new Set();
  perfumeData.perfumes.forEach(p => {
    if (p.tags) {
      p.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
}

/**
 * Get available occasions
 * @returns {Array} List of occasions
 */
export function getOccasions() {
  return perfumeData.occasions || [];
}

/**
 * Get available moods
 * @returns {Array} List of moods
 */
export function getMoods() {
  return perfumeData.moods || [];
}

/**
 * Get available seasons
 * @returns {Array} List of seasons
 */
export function getSeasons() {
  return perfumeData.seasons || [];
}

/**
 * Format perfume results for display in chat
 * @param {Array} perfumes - Array of perfume objects
 * @returns {string} Formatted text description
 */
export function formatPerfumeResults(perfumes) {
  if (perfumes.length === 0) {
    return "I couldn't find any perfumes matching your criteria. Would you like to try a different search?";
  }

  const count = perfumes.length;
  const noun = count === 1 ? 'perfume' : 'perfumes';

  return `I found ${count} ${noun} that match your preferences!`;
}
