// src/pages/ContactUs.jsx
import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import ContactForm from '../components/forms/ContactForm';
import WhatsAppButton from '../components/shared/WhatsAppButton';
import SEOHead from '../components/shared/SEOHead';
import { organizationSchema, breadcrumbSchema, ORGANIZATION } from '../lib/seo';
import './ContactUs.css';

/**
 * ContactUs (Package 4.5)
 *
 * Rebuilt as the site's single canonical source of contact details.
 * Previously, this page and `AboutUs.jsx` each hardcoded their own
 * phone number and office address, and the two had drifted out of
 * sync (Blueprint Section 10, item 30 / `lib/seo.js`'s own header
 * comment flagged this exact discrepancy as "Phase 4 scope"). This
 * package resolves it: every contact detail below is read from
 * `ORGANIZATION` in `lib/seo.js`, which already matched this page's
 * numbers (not AboutUs's) — the same address/phone already wired
 * site-wide via `WhatsAppButton`'s `WHATSAPP_NUMBER` and the JSON-LD
 * `organizationSchema()`. AboutUs.jsx now links here instead of
 * duplicating the form or the details.
 *
 * The form itself is delegated to the new shared `ContactForm`
 * component (`components/forms/ContactForm.jsx`) instead of
 * hand-rolled markup, and the two previously-separate phone numbers/
 * click targets are now real `tel:`/`mailto:` links (redesign plan's
 * "no click-to-call" gap).
 */
const ContactUs = () => {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Contact Us', path: '/contact-us' },
  ];

  const telHref = `tel:+${ORGANIZATION.telephone.replace(/[^\d]/g, '')}`;
  const fullAddress = `${ORGANIZATION.streetAddress}, ${ORGANIZATION.addressLocality}, ${ORGANIZATION.addressRegion} ${ORGANIZATION.postalCode}`;

  return (
    <div className="contact-us-page">
      <SEOHead
        title="Contact Us"
        description="Get in touch with DreamSpace Properties for property viewings, listings, and partnership inquiries."
        path="/contact-us"
        jsonLd={[organizationSchema(), breadcrumbSchema(breadcrumbItems)]}
      />

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content container fade-in">
          <h1>Contact DreamSpace Properties</h1>
          <p>
            Ready to find your dream property? Our expert team is here to guide
            you every step of the way.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="contact-form-section container">
        <div className="form-container">
          <ContactForm />

          {/* Contact Details */}
          <div className="contact-details" aria-labelledby="contact-info-heading">
            <h3 id="contact-info-heading">Contact Information</h3>
            <p>
              <strong>Phone:</strong>{' '}
              <a href={telHref} className="contact-details__link">
                {ORGANIZATION.telephone}
              </a>
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${ORGANIZATION.email}`} className="contact-details__link">
                {ORGANIZATION.email}
              </a>
            </p>

            <h4>
              <MapPin size={16} aria-hidden="true" /> Office Address
            </h4>
            <p>{fullAddress}</p>

            <h4>
              <Clock size={16} aria-hidden="true" /> Business Hours
            </h4>
            <p>
              Mon - Fri: 9:00 AM - 6:00 PM
              <br />
              Sat: 10:00 AM - 4:00 PM
              <br />
              Sun: Closed
            </p>

            <WhatsAppButton
              variant="inline"
              message="Hi, I'd like to get in touch about DreamSpace Properties listings."
              label="Chat on WhatsApp"
              className="contact-details__whatsapp"
            />

            <div className="map-container">
              <div
                role="img"
                aria-label="Our Office Location"
                style={{
                  borderRadius: '8px',
                  height: '200px',
                  display: 'grid',
                  placeItems: 'center',
                  background: '#f5f1ea',
                  color: '#2f3a36',
                  fontWeight: 700,
                }}
              >
                Our Office Location
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
