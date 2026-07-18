// src/pages/AboutUs.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SEOHead from "../components/shared/SEOHead";
import { organizationSchema, breadcrumbSchema } from "../lib/seo";
import Button from "../components/ui/Button";
import TestimonialCarousel from "../components/shared/TestimonialCarousel";
import "./AboutUs.css";
import { demoLogo, placeholderImage } from "../demo";
const offerImageOne = placeholderImage("Property Buying", 900, 700);
const offerImageTwo = placeholderImage("Rental Advisory", 900, 700);
const offerImageThree = placeholderImage("Commercial Spaces", 900, 700);
import {
  Target,
  Eye,
  ShieldCheck,
  MessageSquareText,
  Users,
  Award,
  Handshake,
} from "lucide-react";

/**
 * AboutUs (Package 4.5 → content refresh)
 *
 * Content refresh (this pass):
 *  - "Our Story" now carries the client-provided brand narrative in full
 *    (six paragraphs), replacing the placeholder copy.
 *  - The generic "Who We Are" placeholder section has been removed and
 *    replaced with a "Mission & Vision" section and a "Core Values"
 *    section, both sourced verbatim from the client-provided content.
 *  - A short brand tagline banner ("Building Trust. Creating Futures.")
 *    has been added ahead of the closing Contact CTA, and the hero
 *    subtitle now carries the same tagline instead of generic marketing
 *    copy.
 *  - "What We Offer", "Client Testimonials", and the single canonical
 *    Contact CTA (see history below) are carried over unchanged.
 *
 * Earlier history — two fixes drove the Package 4.5 rebuild, per the
 * redesign plan's audit ("Inconsistent contact details. Broken video
 * placeholder.") and the Blueprint's completion criterion ("Duplicate
 * contact form removed from About"):
 *
 *  1. The full contact form + contact-details + map block (a second,
 *     drifted copy of `ContactUs.jsx`'s content) was removed entirely,
 *     replaced with a single CTA linking to `/contact-us` — the one
 *     canonical place for contact details and the contact form
 *     (Package 4.5's shared `ContactForm` component).
 *  2. The empty, non-functional `<div className="aboutus-video-placeholder">`
 *     (a black box that never rendered any video) was removed; no video
 *     asset exists to replace it with, so the copy above it was adjusted
 *     to no longer promise a video that isn't there.
 *
 * The parallax scroll effect and existing CSS class names are otherwise
 * carried over unchanged to avoid unrelated churn outside this pass's
 * mandate.
 */
const AboutUs = () => {
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector(".aboutus-hero");
      if (hero) {
        hero.style.backgroundPositionY = `${window.pageYOffset * 0.5}px`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about-us" },
  ];

  return (
    <div className="aboutus-page">
      <SEOHead
        title="About Us"
        description="Learn about DreamSpace Properties, a fictional real estate portfolio demo built with professional property-template content."
        path="/about-us"
        jsonLd={[organizationSchema(), breadcrumbSchema(breadcrumbItems)]}
      />

      {/* Hero Section */}
      <header
        className="aboutus-hero"
        role="banner"
        aria-label="About DreamSpace Properties"
      >
        <div className="aboutus-hero-overlay" aria-hidden="true"></div>
        <div className="aboutus-hero-content fade-in" tabIndex="0">
          <h1>About DreamSpace Properties</h1>
          <p className="aboutus-hero-subtitle">
            Building Trust. Creating Futures.
          </p>
          <Button as={Link} to="/properties" variant="primary">
            Explore Listings
          </Button>
        </div>
      </header>

      <main>
        {/* Our Story */}
        <section
          className="aboutus-story-section aboutus-container"
          aria-labelledby="our-story-heading"
        >
          <div className="aboutus-story-header">
            <h2 id="our-story-heading" className="section-title">
              Our Story
            </h2>
            <p className="aboutus-story-lead">
              At DreamSpace Properties, we believe that every property
              represents more than just a space—it represents dreams,
              aspirations, opportunities, and a brighter future.
            </p>
          </div>

          <div className="aboutus-story-body">
            <div className="aboutus-story-image">
              <img
                src={demoLogo}
                alt="DreamSpace Properties logo"
                loading="lazy"
              />
            </div>
            <div className="aboutus-story-content">
              <p>
                Founded with a vision to redefine the real estate experience,
                DreamSpace Properties was built on the principles of trust,
                transparency, integrity, and customer satisfaction. From the
                very beginning, our goal has been to simplify the property
                journey by providing honest guidance, market expertise, and
                personalized solutions for every client.
              </p>
              <p>
                Whether it's helping first-time homebuyers find their dream
                home, assisting investors in making smart decisions,
                supporting families in upgrading their lifestyle, or
                connecting businesses with the right commercial spaces, we are
                committed to delivering value at every stage.
              </p>
              <span className="aboutus-story-divider" aria-hidden="true"></span>
              <p>
                Our team combines deep market knowledge with a customer-first
                approach to ensure every transaction is smooth, transparent,
                and rewarding. We understand that buying or selling a property
                is one of life's most significant decisions, and we treat
                every client with the care, professionalism, and attention
                they deserve.
              </p>
              <p>
                At DreamSpace Properties, we don't measure our success by the
                number of transactions we complete—we measure it by the trust
                we earn, the relationships we build, and the smiles we create.
              </p>
            </div>
          </div>

          <div className="aboutus-story-closing">
            <p>
              As we continue to grow, our commitment remains unchanged: to
              provide exceptional real estate services, embrace innovation,
              and become the most trusted real estate partner for
              individuals, families, and businesses.
            </p>
            <Button as={Link} to="/contact-us" variant="primary">
              Request Consultation
            </Button>
          </div>
        </section>

        {/* Mission & Vision */}
        <section
          className="aboutus-mv-section aboutus-container"
          aria-labelledby="mission-vision-heading"
        >
          <h2 id="mission-vision-heading" className="section-title">
            Our Mission &amp; Vision
          </h2>
          <div className="aboutus-mv-cards">
            <article className="aboutus-mv-card">
              <div className="aboutus-mv-icon" aria-hidden="true">
                <Target size={32} strokeWidth={1.75} />
              </div>
              <h3>Our Mission</h3>
              <p>
                To simplify real estate by providing transparent, reliable, and
                customer-focused solutions that help people make confident
                property decisions.
              </p>
            </article>
            <article className="aboutus-mv-card">
              <div className="aboutus-mv-icon" aria-hidden="true">
                <Eye size={32} strokeWidth={1.75} />
              </div>
              <h3>Our Vision</h3>
              <p>
                To become one of India's most trusted and respected real estate
                brands by delivering excellence, innovation, and long-term value
                in every client relationship.
              </p>
            </article>
          </div>
        </section>

        {/* Core Values */}
        <section
          className="aboutus-values-section aboutus-container"
          aria-labelledby="core-values-heading"
        >
          <h2 id="core-values-heading" className="section-title">
            Our Core Values
          </h2>
          <div className="aboutus-values-grid">
            <article className="aboutus-value-card">
              <div className="aboutus-value-icon" aria-hidden="true">
                <ShieldCheck size={28} strokeWidth={1.75} />
              </div>
              <h3>Integrity</h3>
              <p>We always do what's right.</p>
            </article>
            <article className="aboutus-value-card">
              <div className="aboutus-value-icon" aria-hidden="true">
                <MessageSquareText size={28} strokeWidth={1.75} />
              </div>
              <h3>Transparency</h3>
              <p>Honest advice and clear communication.</p>
            </article>
            <article className="aboutus-value-card">
              <div className="aboutus-value-icon" aria-hidden="true">
                <Users size={28} strokeWidth={1.75} />
              </div>
              <h3>Customer First</h3>
              <p>Your goals are our priority.</p>
            </article>
            <article className="aboutus-value-card">
              <div className="aboutus-value-icon" aria-hidden="true">
                <Award size={28} strokeWidth={1.75} />
              </div>
              <h3>Excellence</h3>
              <p>We strive for the highest standards in everything we do.</p>
            </article>
            <article className="aboutus-value-card">
              <div className="aboutus-value-icon" aria-hidden="true">
                <Handshake size={28} strokeWidth={1.75} />
              </div>
              <h3>Long-Term Relationships</h3>
              <p>We build trust that lasts beyond every transaction.</p>
            </article>
          </div>
        </section>

        {/* What We Offer */}
        <section
          className="aboutus-offer-section aboutus-container"
          aria-labelledby="what-we-offer-heading"
        >
          <h2 id="what-we-offer-heading" className="section-title">
            What We Offer
          </h2>
          <div className="aboutus-offer-cards">
            <article className="aboutus-offer-card">
              <img
                src={offerImageOne}
                alt="Property management services"
                loading="lazy"
              />
              <h3>Property Management</h3>
              <p>Seamless management services for hassle-free living.</p>
            </article>
            <article className="aboutus-offer-card">
              <img
                src={offerImageTwo}
                alt="Rental solutions and leasing support"
                loading="lazy"
              />
              <h3>Rental Solutions</h3>
              <p>Flexible rental options to suit both landlords and tenants.</p>
            </article>
            <article className="aboutus-offer-card">
              <img
                src={offerImageThree}
                alt="Luxury leasing for premium homes"
                loading="lazy"
              />
              <h3>Luxury Leasing</h3>
              <p>Exclusive properties with premium amenities and services.</p>
            </article>
          </div>
        </section>

        {/* Testimonials */}
        <section
          className="aboutus-testimonials"
          aria-labelledby="testimonials-heading"
        >
          <div className="aboutus-container">
            <h2 id="testimonials-heading" className="section-title">
              Client Testimonials
            </h2>
            <TestimonialCarousel className="aboutus-testimonial-carousel" />
          </div>
        </section>

        {/* Brand Tagline Banner */}
        <section className="aboutus-tagline-banner" aria-label="Brand tagline">
          <p className="aboutus-tagline-brand">DreamSpace Properties</p>
          <p className="aboutus-tagline-text">
            Building Trust. Creating Futures.
          </p>
        </section>

        {/* Contact CTA — links to the single canonical Contact Us page
            instead of duplicating its form/details here. */}
        <section
          className="aboutus-contact-cta aboutus-container"
          aria-labelledby="contact-cta-heading"
        >
          <h2 id="contact-cta-heading">Ready to Get Started?</h2>
          <p>Reach out and our team will help you find the right property.</p>
          <Button as={Link} to="/contact-us" variant="primary">
            Contact Us
          </Button>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
