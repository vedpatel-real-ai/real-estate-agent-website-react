// src/lib/seo.js
//
// Shared SEO constants and helpers, consumed by
// `components/shared/SEOHead.jsx` and (from Phase 4 onward) by
// individual pages that need to build page-specific JSON-LD (e.g. the
// `RealEstateListing` schema on the property detail page, or the
// `Article` schema on blog posts).
//
// Kept dependency-free (no react-helmet-async import here) so it can
// be unit-tested or reused outside of a component context.

export const SITE_NAME = "DreamSpace Properties";

export const DEFAULT_TITLE =
  "DreamSpace Properties | Real Estate Portfolio Demo";

export const DEFAULT_DESCRIPTION =
  "DreamSpace Properties is a fictional real estate portfolio demo showcasing residential and commercial property templates.";

export const DEFAULT_OG_IMAGE = "/og-image.svg";

// Organization contact details, sourced from the office address/phone/
// email already shown on ContactUs.jsx (see Known Deviations in
// IMPLEMENTATION_STATE.md — AboutUs.jsx currently shows a different,
// conflicting office address; unifying the two is Phase 4 scope per
// Blueprint Section 10, item 30, not this package).
export const ORGANIZATION = {
  name: SITE_NAME,
  telephone: "+91-98765-43210",
  email: "hello@dreamspace.example",
  streetAddress: "Suite 402, Meridian Business Centre",
  addressLocality: "Ahmedabad",
  addressRegion: "Gujarat",
  postalCode: "380015",
  addressCountry: "IN",
};

const DEFAULT_OG_TYPE = "website";
const DEFAULT_TWITTER_CARD = "summary_large_image";

/**
 * Resolves the site's own origin, used to build absolute canonical/OG
 * URLs. Prefers an explicit VITE_SITE_URL (useful once a production
 * domain is provisioned) and falls back to the browser's current
 * origin, so this works correctly in dev, preview, and prod without
 * requiring any new env var to be set up front.
 */
export function getSiteUrl() {
  const configured = import.meta.env.VITE_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "";
}

/**
 * Builds an absolute URL for the given path against the site's origin.
 * Accepts already-absolute URLs (e.g. a Supabase-hosted image URL) and
 * returns them unchanged.
 */
export function resolveUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = getSiteUrl();
  if (!base) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Builds the `<title>` for a page. Pass just the page-specific part —
 * this appends the site name unless the page already supplies a
 * fully-formed title (e.g. the property detail page's
 * "{Name} — {BHK} BHK in {Area} | DreamSpace" format).
 */
export function buildTitle(pageTitle) {
  if (!pageTitle) return DEFAULT_TITLE;
  return pageTitle.includes(SITE_NAME)
    ? pageTitle
    : `${pageTitle} | ${SITE_NAME}`;
}

/**
 * Truncates a description to a search-result-friendly length without
 * cutting a word in half.
 */
export function truncateDescription(text, maxLength = 160) {
  if (!text) return DEFAULT_DESCRIPTION;
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const truncated = clean.slice(0, maxLength - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength - 1)}…`;
}

/**
 * Assembles the full set of resolved values SEOHead needs, applying
 * defaults for anything the caller doesn't supply.
 */
export function buildMeta({
  title,
  description,
  path = typeof window !== "undefined" ? window.location.pathname : "/",
  image,
  type = DEFAULT_OG_TYPE,
  noindex = false,
} = {}) {
  return {
    title: buildTitle(title),
    description: truncateDescription(description || DEFAULT_DESCRIPTION),
    canonical: resolveUrl(path),
    image: image ? resolveUrl(image) : resolveUrl(DEFAULT_OG_IMAGE),
    type,
    twitterCard: DEFAULT_TWITTER_CARD,
    noindex,
  };
}

/** JSON-LD: Organization/LocalBusiness schema — safe to use on every page. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: ORGANIZATION.name,
    telephone: ORGANIZATION.telephone,
    email: ORGANIZATION.email,
    url: getSiteUrl(),
    address: {
      "@type": "PostalAddress",
      streetAddress: ORGANIZATION.streetAddress,
      addressLocality: ORGANIZATION.addressLocality,
      addressRegion: ORGANIZATION.addressRegion,
      postalCode: ORGANIZATION.postalCode,
      addressCountry: ORGANIZATION.addressCountry,
    },
  };
}

/**
 * JSON-LD: BreadcrumbList schema. `items` is an ordered array of
 * `{ name, path }`, e.g. [{ name: 'Home', path: '/' }, { name: 'Properties', path: '/properties' }].
 */
export function breadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: resolveUrl(item.path),
    })),
  };
}

/**
 * JSON-LD: BlogPosting (Article) schema — added in Package 4.4, per this
 * file's own top-of-file forward reference ("the `Article` schema on
 * blog posts"). Additive-only export, mirroring the pattern already
 * established by `realEstateListingSchema` in 4.3: no existing export
 * touched, no signature changes.
 */
export function blogPostingSchema(post = {}, { path } = {}) {
  const publishedDate = post?.created_at
    ? new Date(post.created_at).toISOString()
    : undefined;
  const modifiedDate = post?.updated_at
    ? new Date(post.updated_at).toISOString()
    : publishedDate;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post?.title || SITE_NAME,
    description: post?.seo_description || post?.excerpt || DEFAULT_DESCRIPTION,
    url: resolveUrl(path || `/blog/${post?.slug || post?.id}`),
    ...(post?.image_url ? { image: resolveUrl(post.image_url) } : {}),
    ...(publishedDate ? { datePublished: publishedDate } : {}),
    ...(modifiedDate ? { dateModified: modifiedDate } : {}),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

export function realEstateListingSchema(property = {}, { path } = {}) {
  const priceType = property?.price_type;
  const priceValue =
    typeof property?.price === "number"
      ? property.price
      : Number(property?.price);
  const hasPrice = Number.isFinite(priceValue) && priceValue > 0;
  const offers =
    hasPrice && priceType !== "on_request"
      ? {
          "@type": "Offer",
          priceCurrency: "INR",
          price: String(priceValue),
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property?.name || SITE_NAME,
    description:
      property?.about_property || property?.description || DEFAULT_DESCRIPTION,
    url: resolveUrl(path || `/properties/${property?.slug || property?.id}`),
    ...(offers ? { offers } : {}),
    ...(property?.location
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: property.location,
          },
        }
      : {}),
  };
}
