// src/pages/BlogDetail.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { useBlogPost } from '../hooks/useBlogPost';
import { useBlogPosts } from '../hooks/useBlogPosts';
import BlogReader from '../components/blog/BlogReader';
import BlogCard from '../components/blog/BlogCard';
import SEOHead from '../components/shared/SEOHead';
import { organizationSchema, breadcrumbSchema, blogPostingSchema, getSiteUrl } from '../lib/seo';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import './BlogDetail.css';

/**
 * BlogDetail (Package 4.4)
 *
 * Rebuilt public blog post page. Replaces the previous plain
 * `supabase.from('blog_posts').select('*').eq('id', id).single()` +
 * `.split('\n')` plain-paragraph rendering with:
 *  - `useBlogPost` (3.3) for slug-first lookup with legacy numeric-`id`
 *    fallback — the route itself (`/blog/:id` in `App.jsx`) needed no
 *    change, exactly mirroring how 4.3 handled `/properties/:id`.
 *  - `BlogReader` (new, this package) for DOMPurify-sanitized rich-HTML
 *    content rendering, category/date/reading-time meta, and WhatsApp +
 *    copy-link share actions.
 *  - `SEOHead` with a `BlogPosting` JSON-LD schema (`lib/seo.js`,
 *    extended this package — see its own header comment, which already
 *    forward-referenced an "Article schema on blog posts") plus a
 *    `BreadcrumbList` schema alongside a visible breadcrumb.
 *  - A "Related Posts" section (same `category`, excluding the current
 *    post) reusing `BlogCard` and `useBlogPosts`, satisfying the
 *    redesign plan's blog-detail spec without a new data hook.
 *
 * No author byline is rendered: the redesign plan's blog-detail spec
 * calls for one, but `blog_posts` has no `author` column in the live
 * schema (2.1's migration didn't add one, and this package cannot
 * invent schema changes). Logged as a Known Deviation for whichever
 * future package next touches the blog schema/admin module.
 */

function BlogDetailSkeleton() {
  return (
    <div className="blog-detail-page">
      <div className="container blog-detail-container">
        <Skeleton variant="rect" height={360} className="blog-detail-skeleton__hero" />
        <div className="blog-detail-skeleton__body">
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="70%" height={36} />
          <Skeleton variant="text" lines={4} />
        </div>
      </div>
    </div>
  );
}

function BlogDetail() {
  const { id } = useParams();
  const { data: post, isLoading, isError } = useBlogPost(id);

  const { data: relatedData } = useBlogPosts(
    { category: post?.category, pageSize: 4 },
    { enabled: Boolean(post?.category) },
  );

  if (isLoading) {
    return <BlogDetailSkeleton />;
  }

  if (isError || !post) {
    return (
      <div className="blog-detail-page">
        <div className="container blog-detail-error">
          <SEOHead title="Post Not Found" noindex />
          <h1>Post Not Found</h1>
          <p>This blog post may have been removed or is no longer available.</p>
          <Button as={Link} to="/blog">
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const identifier = post.slug || post.id;
  const shareUrl = `${getSiteUrl()}/blog/${identifier}`;
  const relatedPosts = (relatedData?.data ?? [])
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${identifier}` },
  ];

  return (
    <div className="blog-detail-page">
      <SEOHead
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt}
        path={`/blog/${identifier}`}
        image={post.image_url}
        type="article"
        jsonLd={[
          organizationSchema(),
          blogPostingSchema(post, { path: `/blog/${identifier}` }),
          breadcrumbSchema(breadcrumbItems),
        ]}
      />

      <div className="container blog-detail-container">
        <Link to="/blog" className="blog-detail-back-link">
          <ArrowLeft size={16} aria-hidden="true" /> Back to Blog
        </Link>

        <nav className="blog-detail-breadcrumb" aria-label="Breadcrumb">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.path}>
              {index > 0 && <span aria-hidden="true">&rsaquo;</span>}
              {index === breadcrumbItems.length - 1 ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link to={item.path}>{item.name}</Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        <article className="blog-detail-article">
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="blog-detail-hero-image"
              loading="eager"
              fetchpriority="high"
            />
          )}

          <h1 className="blog-detail-title">{post.title}</h1>

          <BlogReader post={post} shareUrl={shareUrl} />
        </article>

        {relatedPosts.length > 0 && (
          <section className="blog-detail-related" aria-labelledby="related-posts-heading">
            <h2 id="related-posts-heading">Related Posts</h2>
            <div className="blog-detail-related__grid">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default BlogDetail;