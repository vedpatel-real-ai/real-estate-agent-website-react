// src/hooks/useBlogPosts.js
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { demoBlogs } from '../demo';
import { isDemoMode, supabase } from '../lib/supabaseClient';

/**
 * useBlogPosts
 *
 * Central data-fetching hook for blog listings, replacing the direct
 * `supabase.from('blog_posts').select('*')` calls in `Blog.jsx` and
 * `BlogPostsModule.jsx` (gap item #20/#29). Uses the real `excerpt`,
 * `category`, and `is_published` columns added in 2.1, rather than the
 * previous content-substring "excerpt" workaround.
 */

export const blogKeys = {
  all: ['blogPosts'],
  lists: () => [...blogKeys.all, 'list'],
  list: (filters) => [...blogKeys.lists(), filters],
  details: () => [...blogKeys.all, 'detail'],
  detail: (identifier) => [...blogKeys.details(), identifier],
};

export const DEFAULT_BLOG_PAGE_SIZE = 6;

/**
 * @param {object} filters
 * @param {number} [filters.page=1]
 * @param {number} [filters.pageSize=6]
 * @param {string} [filters.category] - matches `category`; 'all' is treated as no filter
 * @param {string} [filters.search] - matches `title`, `excerpt`, `content`
 * @param {'newest'|'oldest'} [filters.sortBy='newest']
 * @param {boolean} [filters.includeUnpublished=false] - admin usage only; public pages must never set this
 */
export async function fetchBlogPosts(filters = {}) {
  const {
    page = 1,
    pageSize = DEFAULT_BLOG_PAGE_SIZE,
    category,
    search,
    sortBy = 'newest',
    includeUnpublished = false,
  } = filters;

  if (isDemoMode) return filterDemoBlogs(filters);

  let query = supabase.from('blog_posts').select('*', { count: 'exact' });

  if (!includeUnpublished) {
    query = query.eq('is_published', true);
  }
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  if (search) {
    const term = search.trim();
    if (term) {
      query = query.or(
        `title.ilike.%${term}%,excerpt.ilike.%${term}%,content.ilike.%${term}%`,
      );
    }
  }

  query = query.order('created_at', { ascending: sortBy === 'oldest' });

  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) return filterDemoBlogs(filters);

  return { data: data ?? [], count: count ?? 0 };
}

function filterDemoBlogs(filters = {}) {
  const { page = 1, pageSize = DEFAULT_BLOG_PAGE_SIZE, category, search, sortBy = 'newest' } = filters;
  const term = search?.trim().toLowerCase();
  let rows = demoBlogs.filter((post) => {
    if (category && category !== 'all' && post.category !== category) return false;
    if (term && ![post.title, post.excerpt, post.content].join(' ').toLowerCase().includes(term)) return false;
    return post.is_published !== false;
  });
  rows = rows.sort((a, b) => {
    const diff = new Date(a.created_at) - new Date(b.created_at);
    return sortBy === 'oldest' ? diff : -diff;
  });
  const count = rows.length;
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  return { data: rows.slice(from, from + pageSize), count };
}

export function useBlogPosts(filters = {}, options = {}) {
  return useQuery({
    queryKey: blogKeys.list(filters),
    queryFn: () => fetchBlogPosts(filters),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    ...options,
  });
}

export default useBlogPosts;
