// src/components/blog/blogText.js
//
// Shared display-text helpers for the blog components (Package 4.4).
// Kept dependency-free and framework-free so they're easy to reason
// about and reuse between `BlogCard` and `BlogReader`.

const WORDS_PER_MINUTE = 200;

/**
 * Strips HTML tags from a rich-text `content` string, for word-counting
 * and excerpt-fallback purposes only. This is NOT a security sanitizer
 * — it never touches innerHTML and its output is only ever used as
 * plain text (excerpt fallback, reading-time word count). Actual
 * rendering of `content` as HTML goes through `BlogReader`'s DOMPurify
 * pass, not through this function.
 */
function stripHtml(html) {
  if (!html) return '';
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Reading time in whole minutes (minimum 1). Prefers the admin-set
 * `reading_time_minutes` column (2.1) when present and positive;
 * otherwise estimates from the post's `content` word count at 200
 * words/minute, so posts created before that column was backfilled
 * still satisfy 4.4's "read-time display correctly" completion
 * criterion instead of silently showing nothing.
 */
export function getReadingTime(post) {
  const stored = Number(post?.reading_time_minutes);
  if (Number.isFinite(stored) && stored > 0) {
    return Math.round(stored);
  }

  const text = stripHtml(post?.content);
  if (!text) return null;

  const wordCount = text.split(' ').filter(Boolean).length;
  if (wordCount === 0) return null;

  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

/**
 * Card/preview excerpt. Prefers the admin-written `excerpt` column
 * (2.1) — the redesign plan's intended source for cards — and falls
 * back to a truncated, tag-stripped slice of `content` for any post
 * where `excerpt` hasn't been filled in yet.
 */
export function getExcerpt(post, maxLength = 140) {
  const raw = post?.excerpt?.trim() || stripHtml(post?.content);
  if (!raw) return '';
  if (raw.length <= maxLength) return raw;
  const truncated = raw.slice(0, maxLength - 1);
  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength - 1)}…`;
}

export function formatBlogDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
