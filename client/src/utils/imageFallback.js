/**
 * Image Fallback Utilities
 * Resolves category-specific placeholders and handles image load errors
 */

export const getFallbackImage = (category) => {
  const cleanCategory = (category || '').toLowerCase();
  
  if (cleanCategory.includes('elect')) {
    return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=60';
  }
  if (cleanCategory.includes('cloth') || cleanCategory.includes('wear')) {
    return 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=60';
  }
  if (cleanCategory.includes('groc') || cleanCategory.includes('food')) {
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60';
  }
  if (cleanCategory.includes('furn') || cleanCategory.includes('home') || cleanCategory.includes('kitchen')) {
    return 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&auto=format&fit=crop&q=60';
  }
  if (cleanCategory.includes('book') || cleanCategory.includes('read')) {
    return 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=60';
  }
  
  return 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60'; // Default gadget mix
};

export const handleImageError = (e, category) => {
  e.target.onerror = null;
  e.target.src = getFallbackImage(category);
};
