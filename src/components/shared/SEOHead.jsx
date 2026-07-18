// src/components/shared/SEOHead.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { buildMeta, organizationSchema, SITE_NAME } from '../../lib/seo';

/**
 * SEOHead — per-route SEO metadata via react-helmet-async.
 *
 * Renders `<title>`, meta description, canonical link, Open Graph +
 * Twitter Card tags, and JSON-LD structured data. Every field has a
 * sensible site-wide default (see `lib/seo.js`), so pages can render
 * `<SEOHead />` with no props at all and still get correct, non-empty
 * tags — or override individual fields as needed:
 *
 *   <SEOHead
 *     title="Sunrise Heights — 3 BHK in Kudasan, Gandhinagar"
 *     description={property.seo_description || property.about_property}
 *     path={`/properties/${property.slug}`}
 *     image={property.cover_image_url}
 *     jsonLd={[organizationSchema(), realEstateListingSchema(property)]}
 *   />
 *
 * `jsonLd` accepts a single schema.org object or an array of them
 * (e.g. a page that needs both a BreadcrumbList and a
 * RealEstateListing schema). When omitted, the site-wide
 * Organization/RealEstateAgent schema is used so every page still
 * carries baseline structured data.
 */
function SEOHead({
  title,
  description,
  path,
  image,
  type,
  noindex = false,
  jsonLd,
}) {
  const meta = buildMeta({ title, description, path, image, type, noindex });
  const schemas = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [organizationSchema()];

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.canonical} />
      {meta.noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={meta.type} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.canonical} />
      {meta.image && <meta property="og:image" content={meta.image} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={meta.twitterCard} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      {meta.image && <meta name="twitter:image" content={meta.image} />}

      {/* Structured data */}
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export default SEOHead;