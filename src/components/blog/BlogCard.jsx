// src/components/blog/BlogCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import { CATEGORY_META, DEFAULT_CATEGORY_META } from './blogCategories';
import { getReadingTime, getExcerpt, formatBlogDate } from './blogText';
import './BlogCard.css';

/**
 * BlogCard (Package 4.4)
 *
 * Grid-item card for the public blog listing (`pages/Blog.jsx`). Links
 * to the post's slug (falling back to its numeric id for any post that
 * doesn't have a slug backfilled yet — mirrors the same slug-first,
 * id-fallback pattern already used by `PropertyCard` and
 * `PropertyDetailPage`/`useProperty`, so old-style numeric links kept
 * working through 4.2/4.3 the same way they will here).
 */
function BlogCard({ post }) {
  if (!post) return null;

  const categoryMeta = CATEGORY_META[post.category] || DEFAULT_CATEGORY_META;
  const identifier = post.slug || post.id;
  const readingTime = getReadingTime(post);
  const excerpt = getExcerpt(post);

  return (
    <article className="blog-card">
      <Link to={`/blog/${identifier}`} className="blog-card__image-link" tabIndex={-1} aria-hidden="true">
        {post.image_url ? (
          <img
            src={post.image_url}
            alt=""
            className="blog-card__image"
            loading="lazy"
          />
        ) : (
          <div className="blog-card__image blog-card__image--placeholder" />
        )}
        <span
          className="blog-card__category-badge"
          style={{ backgroundColor: categoryMeta.color }}
        >
          {categoryMeta.label}
        </span>
      </Link>

      <div className="blog-card__body">
        <div className="blog-card__meta">
          <span className="blog-card__meta-item">
            <Calendar size={13} aria-hidden="true" />
            {formatBlogDate(post.created_at)}
          </span>
          {readingTime && (
            <span className="blog-card__meta-item">
              <Clock size={13} aria-hidden="true" />
              {readingTime} min read
            </span>
          )}
        </div>

        <h3 className="blog-card__title">
          <Link to={`/blog/${identifier}`}>{post.title}</Link>
        </h3>

        <p className="blog-card__excerpt">{excerpt}</p>

        <Link to={`/blog/${identifier}`} className="blog-card__read-more">
          Read More <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}

export default BlogCard;
