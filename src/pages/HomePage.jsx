// src/pages/HomePage.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Phone,
  ArrowRight,
  Building2,
  Award,
  Users,
  MessageCircle,
  TrendingUp,
  Network,
  ShieldCheck,
} from "lucide-react";

const PropertyStatIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="homepage-hero-stat-icon-svg"
    aria-hidden="true"
  >
    <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-3v-6H8v6H5a1 1 0 0 1-1-1z" />
  </svg>
);

const GuidanceStatIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="homepage-hero-stat-icon-svg"
    aria-hidden="true"
  >
    <path d="M12 3 4 6.5v5.2c0 4.4 2.7 8.2 8 9.3 5.3-1.1 8-4.9 8-9.3V6.5L12 3Zm0 3.2 5 2.1v3.7c0 3.1-1.8 5.9-5 6.9-3.2-1-5-3.8-5-6.9V8.3l5-2.1Z" />
    <path d="M12 8.4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Zm0 5.4c-1.4 0-2.6.8-3.2 2h6.4c-.6-1.2-1.8-2-3.2-2Z" />
  </svg>
);

const ReraStatIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="homepage-hero-stat-icon-svg"
    aria-hidden="true"
  >
    <path d="M12 2 4 5v6c0 4.7 2.8 8.8 8 11 5.2-2.2 8-6.3 8-11V5l-8-3Zm-1 5.2 2.2 2.2 3.4-3.5 1.4 1.4-4.8 4.9-3.6-3.6 1.4-1.4Z" />
  </svg>
);

import { useProperties } from "../hooks/useProperties";
import { useBlogPosts } from "../hooks/useBlogPosts";
import {
  LISTING_TYPE_OPTIONS,
  propertyFiltersToParams,
} from "../components/property/PropertyFilters";
import PropertyCard from "../components/PropertyCard";
import TestimonialCarousel from "../components/shared/TestimonialCarousel";
import WhatsAppButton from "../components/shared/WhatsAppButton";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import Skeleton from "../components/ui/Skeleton";
import { ORGANIZATION } from "../lib/seo";
import "./HomePage.css";

import { demoLogo, placeholderImage } from "../demo";

const propertyImage = placeholderImage("Property Advisory", 1200, 800);
const urbanEdgeLogo = demoLogo;
const whyChooseUs = placeholderImage("Real Estate Service", 1200, 800);

/* ------------------------------------------------------------------ */
/* Shared scroll-reveal helpers (kept from the previous implementation —
   still used by every section below, no bug here). */
/* ------------------------------------------------------------------ */

const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const current = ref.current;
    if (!current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold },
    );
    observer.observe(current);
    return () => observer.unobserve(current);
  }, [threshold]);

  return { ref, isVisible };
};

const AnimateOnScroll = ({ children, className = "", direction = "none" }) => {
  const { ref, isVisible } = useInView();
  const directionClass = direction !== "none" ? `slide-${direction}` : "";
  return (
    <div
      ref={ref}
      className={`scroll-animate ${directionClass} ${className} ${isVisible ? "in-view" : ""}`}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Hero — full-bleed photo, headline, Buy/Rent/Commercial tabs + keyword
   search that hands off to Properties.jsx's own URL <-> filter mapping
   (Package 3.4's `propertyFiltersToParams`), and a trust strip with a
   real, live property count. */
/* ------------------------------------------------------------------ */

// Hero shows exactly the three listing-type tabs from the redesign spec
// (no "All" tab) — reusing 3.4's canonical `LISTING_TYPE_OPTIONS` values
// so the tab a visitor picks here maps to the exact same `listing_type`
// value Properties.jsx's server-side filter (Package 4.2) will use.
const HERO_LISTING_TABS = LISTING_TYPE_OPTIONS.filter(
  (opt) => opt.value !== "all",
);

const HeroSection = () => {
  const navigate = useNavigate();
  const [activeListingType, setActiveListingType] = useState(
    HERO_LISTING_TABS[0]?.value ?? "buy",
  );
  const [keyword, setKeyword] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    const params = propertyFiltersToParams({
      listingType: activeListingType,
      search: keyword.trim() || undefined,
    });
    const query = new URLSearchParams(params).toString();
    navigate(query ? `/properties?${query}` : "/properties");
  };

  return (
    <section className="homepage-hero" aria-label="Hero Section">
      <div className="homepage-hero-overlay" aria-hidden="true" />
      <AnimateOnScroll className="homepage-hero-content">
        <h1>Find Your Next Space</h1>
        <p>
          Explore demo residential and commercial listings with polished portfolio content.
        </p>

        <form
          className="homepage-hero-search"
          onSubmit={handleSearch}
          role="search"
        >
          <div
            className="homepage-hero-tabs"
            role="tablist"
            aria-label="Listing type"
          >
            {HERO_LISTING_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={activeListingType === tab.value}
                className={`homepage-hero-tab ${
                  activeListingType === tab.value
                    ? "homepage-hero-tab--active"
                    : ""
                }`}
                onClick={() => setActiveListingType(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="homepage-hero-search-row">
            <div className="homepage-hero-search-field">
              <Search
                className="homepage-hero-search-icon"
                size={18}
                aria-hidden="true"
              />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by locality, project, or keyword"
                aria-label="Search properties"
              />
            </div>
            <Button type="submit" variant="primary" size="medium">
              Search
            </Button>
          </div>
        </form>

        <dl className="homepage-hero-stats">
          <div className="homepage-hero-stat">
            <div className="homepage-hero-stat-icon" aria-hidden="true">
              <PropertyStatIcon />
            </div>
            <dt>51+</dt>
            <dd>Properties</dd>
          </div>
          <div className="homepage-hero-stat">
            <div className="homepage-hero-stat-icon" aria-hidden="true">
              <GuidanceStatIcon />
            </div>
            <dt>Trusted</dt>
            <dd>Property Guidance</dd>
          </div>
          <div className="homepage-hero-stat">
            <div className="homepage-hero-stat-icon" aria-hidden="true">
              <ReraStatIcon />
            </div>
            <dt>100%</dt>
            <dd>RERA Registered</dd>
          </div>
        </dl>
      </AnimateOnScroll>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Featured Properties — server-fetched via `useProperties`, falling
   back to the newest listings if nothing is flagged `is_featured` yet
   so the section is never empty. `PropertyCard` itself is out of scope
   for this package (shared with Package 4.2 — see IMPLEMENTATION_STATE
   "Locked Files"), so the "Featured" badge is added here as a wrapper
   overlay instead of inside that component. */
/* ------------------------------------------------------------------ */

const FEATURED_SKELETON_COUNT = 4;
const FEATURED_SECTION_MIN = 4;
const FEATURED_FETCH_LIMIT = 20;

function FeaturedPropertiesSkeleton() {
  return (
    <>
      {Array.from({ length: FEATURED_SKELETON_COUNT }).map((_, i) => (
        <div className="homepage-property-card-wrap" key={i}>
          <div className="property-card">
            <div className="card-image">
              <Skeleton variant="rect" className="card-image-skeleton" />
            </div>
            <div className="property-details">
              <Skeleton variant="text" width="70%" height={20} />
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

const FeaturedPropertiesSection = () => {
  const { data: featuredData, isLoading: loadingFeatured } = useProperties({
    isFeatured: true,
    pageSize: FEATURED_FETCH_LIMIT,
    sortBy: "newest",
  });

  const featuredProperties = featuredData?.data ?? [];
  const featuredCount = featuredProperties.length;
  const fillerCount = Math.max(FEATURED_SECTION_MIN - featuredCount, 0);

  const { data: fillerData, isLoading: loadingFiller } = useProperties(
    { isFeatured: false, pageSize: fillerCount, sortBy: "newest" },
    { enabled: !loadingFeatured && fillerCount > 0 },
  );

  const fillerProperties = fillerData?.data ?? [];
  const properties = [...featuredProperties, ...fillerProperties];
  const isLoading = loadingFeatured || (fillerCount > 0 && loadingFiller);

  return (
    <AnimateOnScroll className="homepage-featured-properties homepage-box">
      <h2 className="homepage-section-title">Featured Properties</h2>
      <div className="homepage-property-list">
        {isLoading ? (
          <FeaturedPropertiesSkeleton />
        ) : properties.length ? (
          properties.map((prop) => (
            <div
              key={prop.id}
              className="card-hover homepage-property-card-wrap"
            >
              {prop.is_featured && (
                <Badge variant="accent" className="homepage-featured-badge">
                  Featured
                </Badge>
              )}
              <PropertyCard
                property={{ ...prop, image: prop.image_url || propertyImage }}
                showWhatsApp={false}
              />
            </div>
          ))
        ) : (
          <p>No properties available right now.</p>
        )}
      </div>
      <div className="homepage-cta-container">
        <Button as={Link} to="/properties" variant="secondary" size="medium">
          View All Properties
        </Button>
      </div>
    </AnimateOnScroll>
  );
};

/* ------------------------------------------------------------------ */
/* Why Choose Us — 8 original points retained, plus the redesign plan's
   new "RERA registered projects only" data point. */
/* ------------------------------------------------------------------ */

const WHY_CHOOSE_POINTS = [
  {
    icon: Award,
    title: "Proven Track Record",
    text: "A consistent history of successful sales, rentals, and satisfied clients.",
  },
  {
    icon: Users,
    title: "Personalized Service",
    text: "Every client gets a tailored search, not a generic listing dump.",
  },
  {
    icon: MessageCircle,
    title: "Transparent Communication",
    text: "Clear updates at every step — no surprises, no hidden terms.",
  },
  {
    icon: TrendingUp,
    title: "Expert Negotiation",
    text: "We work to get you the best possible terms on every deal.",
  },
  {
    icon: Network,
    title: "Trusted Network",
    text: "A vetted circle of legal, financial, and construction partners.",
  },
  {
    icon: ShieldCheck,
    title: "RERA Registered Projects Only",
    text: "Every project we list is verified and compliant, for your peace of mind.",
  },
];

/* ------------------------------------------------------------------ */
/* Blog Preview — server-fetched via `useBlogPosts`, cards link to the
   real per-post slug (falling back to id) instead of the generic
   `/blog` link the old section used for every card. */
/* ------------------------------------------------------------------ */

const BLOG_PREVIEW_SKELETON_COUNT = 3;

function BlogPreviewSkeleton() {
  return (
    <>
      {Array.from({ length: BLOG_PREVIEW_SKELETON_COUNT }).map((_, i) => (
        <div className="homepage-news-item" key={i}>
          <Skeleton
            variant="rect"
            height={190}
            className="homepage-news-image"
          />
          <div className="homepage-news-content">
            <Skeleton variant="text" width="30%" height={20} />
            <Skeleton variant="text" width="80%" height={22} />
            <Skeleton variant="text" lines={2} />
          </div>
        </div>
      ))}
    </>
  );
}

const BlogPreviewSection = () => {
  const { data, isLoading } = useBlogPosts({ pageSize: 3, sortBy: "newest" });
  const posts = data?.data ?? [];

  return (
    <AnimateOnScroll className="homepage-latest-news homepage-box">
      <h2 className="homepage-section-title">Latest Blog Posts</h2>
      <div className="homepage-news-grid">
        {isLoading ? (
          <BlogPreviewSkeleton />
        ) : posts.length ? (
          posts.map((post) => (
            <Link
              to={`/blog/${post.slug || post.id}`}
              key={post.id}
              className="homepage-news-item card-hover"
            >
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="homepage-news-image"
                  loading="lazy"
                />
              )}
              <div className="homepage-news-content">
                {post.category && (
                  <Badge
                    variant="primary"
                    size="small"
                    className="homepage-news-category"
                  >
                    {post.category}
                  </Badge>
                )}
                <h3>{post.title}</h3>
                <p>{(post.excerpt || post.content || "").slice(0, 110)}...</p>
                <div className="homepage-news-meta">
                  <span>
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="homepage-news-readmore">
                    Read More <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No blog posts available yet.</p>
        )}
      </div>
    </AnimateOnScroll>
  );
};

/* ------------------------------------------------------------------ */
/* Page assembly — all 8 homepage sections. */
/* ------------------------------------------------------------------ */

const HomePage = () => {
  const guaranteedRentMessage =
    "Hi, I'd like to know more about the Guaranteed Rent program.";
  const contactMessage =
    "Hi, I'm interested in DreamSpace Properties listings.";
  const telHref = `tel:${ORGANIZATION.telephone.replace(/[^+\d]/g, "")}`;

  return (
    <div className="homepage-container">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Welcome */}
      <AnimateOnScroll className="homepage-welcome-section homepage-box">
        <div className="homepage-welcome-image logo-container">
          <img
            src={urbanEdgeLogo}
            alt="DreamSpace Properties Logo"
            className="homepage-logo"
            loading="lazy"
          />
        </div>
        <div className="homepage-welcome-content">
          <h2>Welcome to DreamSpace Properties</h2>
          <p className="text-background-overlay">
            At DreamSpace Properties, we are committed to providing you with a
            curated selection of premium properties and unparalleled service.
            Our expert team is here to guide you every step of the way.
          </p>
          <Button as={Link} to="/about-us" variant="primary" size="medium">
            Learn More About Us
          </Button>
        </div>
      </AnimateOnScroll>

      {/* 3. Featured Properties */}
      <FeaturedPropertiesSection />

      {/* 4. Why Choose Us */}
      <div className="homepage-why-choose homepage-box">
        <AnimateOnScroll
          direction="right"
          className="homepage-why-choose-content"
        >
          <div className="text-border connected-right">
            <h2>Why Choose Us?</h2>
            <div className="homepage-why-choose-grid">
              {WHY_CHOOSE_POINTS.map(({ icon: Icon, title, text }) => (
                <div className="homepage-why-choose-item" key={title}>
                  <span className="homepage-why-choose-icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll direction="left" className="homepage-why-choose-image">
          <img
            src={whyChooseUs}
            alt="Why Choose Us"
            className="card-hover"
            loading="lazy"
          />
        </AnimateOnScroll>
      </div>

      {/* 5. Guaranteed Rent CTA (NEW) */}
      <AnimateOnScroll className="homepage-guaranteed-rent-band">
        <div className="homepage-guaranteed-rent-inner">
          <Building2
            size={36}
            className="homepage-guaranteed-rent-icon"
            aria-hidden="true"
          />
          <h2>Earn Guaranteed Rental Income</h2>
          <p>
            Let us manage your property end-to-end and receive a fixed,
            guaranteed rental payout — every month, regardless of vacancy.
          </p>
          <div className="homepage-guaranteed-rent-actions">
            {/* Package 4.5 built the dedicated Guaranteed Rent page;
                "Learn More" now points there instead of the interim
                Contact Us fallback. HomePage.jsx is not in 4.5's
                declared file-lock scope — flagged as an unavoidable
                minimal touch in IMPLEMENTATION_STATE.md (same pattern
                as App.jsx's route registration above). */}
            <Button
              as={Link}
              to="/guaranteed-rent"
              variant="primary"
              size="medium"
            >
              Learn More
            </Button>
            <WhatsAppButton
              variant="inline"
              message={guaranteedRentMessage}
              label="WhatsApp Us"
            />
          </div>
        </div>
      </AnimateOnScroll>

      {/* 6. Testimonials */}
      <AnimateOnScroll className="homepage-testimonials homepage-box">
        <h2 className="homepage-section-title">What Our Clients Say</h2>
        <TestimonialCarousel />
      </AnimateOnScroll>

      {/* 7. Blog Preview */}
      <BlogPreviewSection />

      {/* 8. Contact CTA band */}
      <AnimateOnScroll className="homepage-contact-cta-band">
        <div className="homepage-contact-cta-inner">
          <h2>Ready to find your property?</h2>
          <p>
            Talk to our team today — we're here to help you buy, rent, or invest
            with confidence.
          </p>
          <div className="homepage-contact-cta-actions">
            <a href={telHref} className="homepage-contact-cta-phone">
              <Phone size={18} aria-hidden="true" />
              <span>{ORGANIZATION.telephone}</span>
            </a>
            <WhatsAppButton
              variant="inline"
              message={contactMessage}
              label="WhatsApp Us"
            />
          </div>
        </div>
      </AnimateOnScroll>

      {/* Floating WhatsApp button, present on the homepage per the
          redesign plan's site-wide floating-button requirement. */}
      <WhatsAppButton variant="floating" message={contactMessage} />
    </div>
  );
};

export default HomePage;
