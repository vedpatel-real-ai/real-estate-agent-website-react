// src/pages/Blog.jsx
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Newspaper } from 'lucide-react';

import { useBlogPosts } from '../hooks/useBlogPosts';
import BlogCard from '../components/blog/BlogCard';
import { CATEGORY_FILTER_OPTIONS } from '../components/blog/blogCategories';
import SEOHead from '../components/shared/SEOHead';
import { organizationSchema, breadcrumbSchema } from '../lib/seo';
import Skeleton from '../components/ui/Skeleton';
import Pagination from '../components/ui/Pagination';
import './Blog.css';

/**
 * Blog (Package 4.4)
 *
 * Rebuilt public blog listing page. Replaces the previous single
 * unfiltered `supabase.from('blog_posts').select('*')` client-side call
 * with `useBlogPosts` (3.3), which already applies `is_published`
 * filtering, `category`, `search`, `sortBy`, and server-side pagination
 * — so every filter/search/page combination here is a real Supabase
 * query, matching the same pattern 4.2's `Properties.jsx` established
 * for the properties listing.
 *
 * Category filter chips and the hero search box use `useSearchParams`
 * directly (no shared URL-sync hook exists for blog — `usePropertyFiltersFromUrl`
 * is property-specific and out of this package's scope), scoped
 * entirely within this file so filter state is shareable/back-button
 * friendly without touching any locked file.
 */

const BLOG_PAGE_SIZE = 9;
const SKELETON_COUNT = 6;

function BlogSkeletonGrid() {
  return (
    <div className="blog-grid">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div className="blog-skeleton-card" key={i}>
          <Skeleton variant="rect" height={180} />
          <div className="blog-skeleton-card__body">
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" lines={2} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasFilters, onReset }) {
  return (
    <div className="blog-empty-state">
      <Newspaper size={44} className="blog-empty-state__icon" aria-hidden="true" />
      <h3>{hasFilters ? 'No posts match your filters.' : 'No blog posts available yet.'}</h3>
      <p>
        {hasFilters
          ? 'Try a different category or search term.'
          : 'Check back soon — new insights and market updates are on the way.'}
      </p>
      {hasFilters && (
        <button type="button" className="blog-empty-state__reset" onClick={onReset}>
          Clear Filters
        </button>
      )}
    </div>
  );
}

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('q') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);

  const [searchInput, setSearchInput] = React.useState(search);
  React.useEffect(() => setSearchInput(search), [search]);

  const updateParams = (updates, { resetPage = true } = {}) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || value === 'all') {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });
    if (resetPage) next.delete('page');
    setSearchParams(next);
  };

  const { data, isLoading, isFetching, error } = useBlogPosts({
    page,
    pageSize: BLOG_PAGE_SIZE,
    category,
    search,
    sortBy: 'newest',
  });

  const posts = data?.data ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / BLOG_PAGE_SIZE));
  const hasActiveFilters = category !== 'all' || Boolean(search);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ q: searchInput.trim() || undefined });
  };

  const handleCategoryClick = (value) => {
    updateParams({ category: value === 'all' ? undefined : value });
  };

  const handlePageChange = (nextPage) => {
    updateParams({ page: nextPage }, { resetPage: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="blog-page">
      <SEOHead
        title="Blog"
        description="Insights, buying guides, market trends, and area guides for a fictional real estate portfolio demo."
        path="/blog"
        jsonLd={[
          organizationSchema(),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
        ]}
      />

      <header className="blog-hero">
        <div className="blog-hero__overlay" />
        <div className="blog-hero__content">
          <nav className="blog-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">&rsaquo;</span>
            <span aria-current="page">Blog</span>
          </nav>
          <h1>Insights &amp; Market Trends</h1>
          <p>Explore buying guides, market updates, and area guides for demo real estate content.</p>
          <form className="blog-hero__search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search blog posts"
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </header>

      <main className="container blog-main">
        <div className="blog-category-chips" role="group" aria-label="Filter by category">
          {CATEGORY_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`blog-category-chip ${category === opt.value ? 'is-active' : ''}`}
              onClick={() => handleCategoryClick(opt.value)}
              aria-pressed={category === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <BlogSkeletonGrid />
        ) : error ? (
          <div className="blog-error">Failed to load blog posts. Please try again later.</div>
        ) : posts.length === 0 ? (
          <EmptyState hasFilters={hasActiveFilters} onReset={handleResetFilters} />
        ) : (
          <div className={`blog-grid ${isFetching ? 'is-refetching' : ''}`}>
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="blog-pagination"
        />
      </main>
    </div>
  );
};

export default Blog;
