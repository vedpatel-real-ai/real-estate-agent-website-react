// src/hooks/useBlogPost.js
import { useQuery } from '@tanstack/react-query';
import { demoBlogs } from '../demo';
import { isDemoMode, supabase } from '../lib/supabaseClient';
import { blogKeys } from './useBlogPosts';

const isNumericId = (value) => /^\d+$/.test(String(value ?? '').trim());

/**
 * fetchBlogPostByIdentifier
 *
 * Slug-first lookup with a legacy numeric `id` fallback, mirroring
 * `useProperty`'s pattern — gap item #29 calls out `Blog.jsx`/
 * `BlogDetail.jsx`'s current numeric `/blog/:id` routing as something
 * Phase 4 replaces with slugs, so old links need to keep resolving.
 */
export async function fetchBlogPostByIdentifier(identifier) {
  if (!identifier) {
    throw new Error('A blog post slug or id is required.');
  }

  const trimmed = String(identifier).trim();
  const demoPost = demoBlogs.find((post) => post.slug === trimmed || String(post.id) === trimmed);
  if (isDemoMode && demoPost) return demoPost;

  const { data: bySlug, error: slugError } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', trimmed)
    .maybeSingle();
  if (slugError) {
    if (demoPost) return demoPost;
    throw slugError;
  }
  if (bySlug) return bySlug;

  if (isNumericId(trimmed)) {
    const { data: byId, error: idError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', Number(trimmed))
      .maybeSingle();
    if (idError) {
      if (demoPost) return demoPost;
      throw idError;
    }
    if (byId) return byId;
  }

  if (demoPost) return demoPost;
  throw new Error('Blog post not found.');
}

/**
 * @param {string|number} identifier - a blog post `slug` or legacy numeric `id`
 * @param {import('@tanstack/react-query').UseQueryOptions} [options]
 */
export function useBlogPost(identifier, options = {}) {
  return useQuery({
    queryKey: blogKeys.detail(identifier),
    queryFn: () => fetchBlogPostByIdentifier(identifier),
    enabled: Boolean(identifier) && options.enabled !== false,
    staleTime: 60_000,
    ...options,
  });
}

export default useBlogPost;
