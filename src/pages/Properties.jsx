// src/pages/Properties.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, List, SearchX } from 'lucide-react';

import { useProperties, DEFAULT_PROPERTIES_PAGE_SIZE } from '../hooks/useProperties';
import { useFavouriteState } from '../hooks/useFavouriteState';
import PropertyFilters, {
  usePropertyFiltersFromUrl,
  DEFAULT_SORT_BY,
} from '../components/property/PropertyFilters';
import PropertyCard from '../components/PropertyCard';
import WhatsAppButton from '../components/shared/WhatsAppButton';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import Pagination from '../components/ui/Pagination';
import './Properties.css';

/**
 * Properties (Package 4.2)
 *
 * Rebuilt listing page. Replaces the previous client-side-only
 * filter/search/sort/pagination implementation (Part A Section 3d/3e -
 * `applyFilters`, `sortProperties`, `.slice()` pagination over a single
 * unfiltered `supabase.from('properties').select('*')` call) with:
 *  - `PropertyFilters` (3.4) as the single filter UI + URL<->filter
 *    mapping, reused as-is (it already renders both the desktop sidebar
 *    and the mobile floating-trigger + bottom-sheet drawer via CSS
 *    breakpoints, so this page does not re-implement either).
 *  - `useProperties` (3.3) as the single data-fetching call, so every
 *    filter/search/sort/page combination becomes a real server-side
 *    Supabase query (`is_published`, `listing_type`, `property_type`,
 *    `bhk_min`/`max`, `locality`, `price`, full-text `search`, `sortBy`,
 *    `page`/`pageSize`) instead of an in-memory `.filter()`/`.sort()`
 *    over every row.
 *  - `Pagination` (1.3) for page-number controls instead of the
 *    hand-rolled prev/next + page-button markup.
 *
 * Listing-type tabs use the real `listing_type` column via
 * `PropertyFilters`' own `LISTING_TYPE_OPTIONS` (buy/rent/commercial),
 * not substring matching against `property_type` the way the old
 * `propertyCategory` toggle did (`.includes('rental')`) - satisfying
 * 4.2's own completion criterion on this point.
 */

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const SKELETON_COUNT = 6;
const HERO_SEARCH_DEBOUNCE_MS = 400;

function ResultsSkeleton({ viewMode }) {
  return (
    <div className={`properties-grid properties-grid--${viewMode}`}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div className="property-skeleton-card" key={i}>
          <Skeleton variant="rect" height={220} />
          <div className="property-skeleton-card__body">
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="properties-empty-state">
      <SearchX size={48} className="properties-empty-state__icon" aria-hidden="true" />
      <h3>No properties found for your filters.</h3>
      <p>Try adjusting or clearing your filters to see more results.</p>
      <Button variant="primary" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}

const Properties = () => {
  const [filters, setFilters] = usePropertyFiltersFromUrl();
  const [viewMode, setViewMode] = React.useState('grid');
  const [heroSearch, setHeroSearch] = React.useState(filters.search || '');

  // Keep the hero search box in sync if the URL changes from elsewhere
  // (PropertyFilters' own search field, browser back/forward, a homepage
  // hand-off link, etc.) - same single source of truth, not a second
  // independent piece of state.
  React.useEffect(() => {
    setHeroSearch(filters.search || '');
  }, [filters.search]);

  // Live search: commits as the person types (debounced), same pattern
  // and timing as PropertyFilters' own sidebar search field, so results
  // update without needing to press the Search button. An empty box
  // clears `search` entirely, which falls back to showing every
  // property (unchanged existing behavior - see `search: heroSearch ||
  // undefined` below).
  const heroSearchDebounceRef = React.useRef(null);
  React.useEffect(() => {
    if (heroSearchDebounceRef.current) clearTimeout(heroSearchDebounceRef.current);
    heroSearchDebounceRef.current = setTimeout(() => {
      if (heroSearch !== (filters.search || '')) {
        setFilters({ search: heroSearch || undefined });
      }
    }, HERO_SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(heroSearchDebounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroSearch]);

  const { data, isLoading, isFetching, error } = useProperties({
    ...filters,
    pageSize: DEFAULT_PROPERTIES_PAGE_SIZE,
  });

  // Auth & Favourites Architecture Plan §6: this was the second call
  // site that never passed isFavourite/onToggleFavourite down to
  // PropertyCard (the props already existed on the component, just
  // unused). useFavouriteState picks Supabase vs localStorage based on
  // whether the visitor is signed in.
  const { isFavourite, toggleFavourite } = useFavouriteState();

  const properties = data?.data ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / DEFAULT_PROPERTIES_PAGE_SIZE));

  // The button/Enter still works for anyone who prefers pressing search -
  // it just commits immediately instead of waiting out the debounce above.
  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearchDebounceRef.current) clearTimeout(heroSearchDebounceRef.current);
    setFilters({ search: heroSearch || undefined });
  };

  const handleSortChange = (e) => {
    setFilters({ sortBy: e.target.value }, { resetPage: false });
  };

  const handlePageChange = (page) => {
    setFilters({ page }, { resetPage: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetAll = () => {
    setFilters({
      listingType: 'all',
      propertyTypes: [],
      bhk: [],
      city: undefined,
      locality: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      isFeatured: false,
      search: undefined,
      sortBy: DEFAULT_SORT_BY,
    });
  };

  const rangeStart = totalCount === 0 ? 0 : (filters.page - 1) * DEFAULT_PROPERTIES_PAGE_SIZE + 1;
  const rangeEnd = Math.min(filters.page * DEFAULT_PROPERTIES_PAGE_SIZE, totalCount);

  return (
    <div className="properties-page">
      {/* Compact hero banner */}
      <header className="properties-hero" role="banner">
        <div className="hero-overlay" />
        <div className="hero-content">
          <nav className="properties-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">&rsaquo;</span>
            <span aria-current="page">Properties</span>
          </nav>
          <h1>
            {isLoading ? 'Demo Properties' : `${totalCount} Demo Propert${totalCount === 1 ? 'y' : 'ies'}`}
          </h1>
          <form className="hero-search" onSubmit={handleHeroSearchSubmit}>
            <input
              type="text"
              placeholder="Search by location, type, features..."
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              aria-label="Search properties"
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </header>

      <main className="container properties-main">
        <aside className="properties-sidebar">
          <PropertyFilters />
        </aside>

        <section className="results-section">
          <div className="results-info">
            <div className="results-count">
              {totalCount === 0 && !isLoading ? (
                'No properties found'
              ) : (
                <>
                  Showing <strong>{rangeStart}-{rangeEnd}</strong> of{' '}
                  <strong>{totalCount}</strong> propert{totalCount === 1 ? 'y' : 'ies'}
                </>
              )}
            </div>
            <div className="results-controls">
              <div className="results-sorting">
                <label htmlFor="sort-options">Sort by:</label>
                <select
                  id="sort-options"
                  value={filters.sortBy}
                  onChange={handleSortChange}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="view-toggle" role="group" aria-label="Toggle grid or list view">
                <button
                  type="button"
                  className={`view-toggle__btn ${viewMode === 'grid' ? 'is-active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  type="button"
                  className={`view-toggle__btn ${viewMode === 'list' ? 'is-active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-pressed={viewMode === 'list'}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <ResultsSkeleton viewMode={viewMode} />
          ) : error ? (
            <div className="properties-error">
              Failed to load properties. Please try again later.
            </div>
          ) : properties.length === 0 ? (
            <EmptyState onReset={handleResetAll} />
          ) : (
            <div
              className={`properties-grid properties-grid--${viewMode} ${isFetching ? 'is-refetching' : ''}`}
            >
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  viewMode={viewMode}
                  isFavourite={isFavourite(property.id)}
                  onToggleFavourite={() => toggleFavourite(property.id)}
                />
              ))}
            </div>
          )}

          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="properties-pagination"
          />
        </section>
      </main>

      <WhatsAppButton variant="floating" />
    </div>
  );
};

export default Properties;
