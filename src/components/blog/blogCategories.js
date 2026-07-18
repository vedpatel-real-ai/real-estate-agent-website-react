// src/components/blog/blogCategories.js
//
// Shared category metadata for the blog components (Package 4.4).
// `blog_posts.category` stores one of the three values documented in
// the redesign plan's schema block: 'buying-guide' | 'market-trends' |
// 'area-guides'. Colors reuse the same gold/teal/indigo brand triad
// `PropertyCard.css` already established for its listing-type badges
// (Package 4.2), for visual consistency across the app — scoped locally
// here rather than added to `styles/tokens.css`, which is locked
// outside Package 1.2, matching the precedent set in 4.3.

export const CATEGORY_META = {
  'buying-guide': { label: 'Buying Guide', color: '#c4a542' },
  'market-trends': { label: 'Market Trends', color: '#0f8b8d' },
  'area-guides': { label: 'Area Guides', color: '#4b3f8f' },
};

export const DEFAULT_CATEGORY_META = { label: 'Insights', color: '#02066F' };

export const CATEGORY_FILTER_OPTIONS = [
  { value: 'all', label: 'All Posts' },
  { value: 'buying-guide', label: 'Buying Guide' },
  { value: 'market-trends', label: 'Market Trends' },
  { value: 'area-guides', label: 'Area Guides' },
];
