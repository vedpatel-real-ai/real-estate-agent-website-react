// src/components/blog/BlogReader.jsx
import React, { useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { Clock, Calendar, Share2, Link as LinkIcon, Check } from 'lucide-react';
import { CATEGORY_META, DEFAULT_CATEGORY_META } from './blogCategories';
import { getReadingTime, formatBlogDate } from './blogText';
import './BlogReader.css';

/**
 * BlogReader (Package 4.4)
 *
 * Renders a single blog post's rich-HTML body safely and its
 * category/date/reading-time meta row and share actions. Content comes
 * from `blog_posts.content`, authored via the admin's rich-text editor
 * (Phase 5 / gap item — the admin side isn't rebuilt yet, but the
 * column already stores HTML per the redesign plan's schema note), so
 * it's run through DOMPurify before being handed to
 * `dangerouslySetInnerHTML` — per the redesign plan's own stated
 * approach for this exact spot ("render HTML safely ... using
 * DOMPurify").
 *
 * Kept as its own component (rather than inlined into
 * `pages/BlogDetail.jsx`) so the sanitize-then-render path has a single
 * call site, and so a future package (e.g. a related-posts preview
 * needing the same safe rendering) can reuse it without duplicating
 * the DOMPurify config.
 */

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
    'h2', 'h3', 'h4', 'blockquote',
    'ul', 'ol', 'li',
    'a', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'hr', 'span', 'div',
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class'],
};

function BlogReader({ post, shareUrl }) {
  const [copied, setCopied] = useState(false);

  const sanitizedContent = useMemo(() => {
    if (!post?.content) return '';
    return DOMPurify.sanitize(post.content, SANITIZE_CONFIG);
  }, [post?.content]);

  if (!post) return null;

  const categoryMeta = CATEGORY_META[post.category] || DEFAULT_CATEGORY_META;
  const readingTime = getReadingTime(post);

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `${post.title} — ${shareUrl || ''}`,
  )}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. non-HTTPS/older browser) — the
      // copy button simply won't confirm; no further fallback needed
      // for this package's scope.
    }
  };

  return (
    <div className="blog-reader">
      <div className="blog-reader__meta">
        <span
          className="blog-reader__category-badge"
          style={{ backgroundColor: categoryMeta.color }}
        >
          {categoryMeta.label}
        </span>
        <span className="blog-reader__meta-item">
          <Calendar size={14} aria-hidden="true" />
          {formatBlogDate(post.created_at)}
        </span>
        {readingTime && (
          <span className="blog-reader__meta-item">
            <Clock size={14} aria-hidden="true" />
            {readingTime} min read
          </span>
        )}
      </div>

      <div
        className="blog-reader__content"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />

      <div className="blog-reader__share" role="group" aria-label="Share this post">
        <span className="blog-reader__share-label">
          <Share2 size={16} aria-hidden="true" /> Share
        </span>
        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="blog-reader__share-btn blog-reader__share-btn--whatsapp"
        >
          WhatsApp
        </a>
        <button
          type="button"
          className="blog-reader__share-btn blog-reader__share-btn--copy"
          onClick={handleCopyLink}
        >
          {copied ? (
            <>
              <Check size={14} aria-hidden="true" /> Copied
            </>
          ) : (
            <>
              <LinkIcon size={14} aria-hidden="true" /> Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default BlogReader;
