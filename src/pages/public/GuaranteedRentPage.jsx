// src/pages/public/GuaranteedRentPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Handshake, Wallet, CalendarClock, BadgeCheck, Home } from 'lucide-react';
import SEOHead from '../../components/shared/SEOHead';
import WhatsAppButton from '../../components/shared/WhatsAppButton';
import Button from '../../components/ui/Button';
import { organizationSchema, breadcrumbSchema } from '../../lib/seo';
import './GuaranteedRentPage.css';

/**
 * GuaranteedRentPage (Package 4.5, new)
 *
 * Per the redesign plan's "Guaranteed Rent page (new)" spec: "Hero →
 * What is Guaranteed Rent? → How it works (3 steps) → Benefits →
 * Eligibility → FAQs → WhatsApp CTA. No DB needed — static content or
 * a CMS field in site_settings." Built as static content (no
 * `site_settings` table/column exists yet, and adding one would be an
 * out-of-scope schema change per this package's file lock) — every
 * section below is component-local copy, no Supabase query.
 *
 * Route (`/guaranteed-rent`) and the Homepage CTA linking to it are
 * both outside this package's declared "Files to Modify" list
 * (`App.jsx`, `HomePage.jsx`) — see the Pre-Implementation Validation
 * Note in IMPLEMENTATION_STATE.md for why those two minimal, additive
 * touches were necessary and how they were scoped.
 */
const HOW_IT_WORKS = [
  {
    icon: Home,
    title: '1. Property Evaluation',
    description:
      'We assess your property\u2019s location, condition, and market rate to determine a fair guaranteed rent figure.',
  },
  {
    icon: Handshake,
    title: '2. Sign the Agreement',
    description:
      'We formalize a fixed-term rental management agreement with a locked-in monthly payout, regardless of vacancy.',
  },
  {
    icon: Wallet,
    title: '3. Get Paid, Every Month',
    description:
      'You receive your guaranteed rent on schedule while we handle tenants, maintenance coordination, and paperwork.',
  },
];

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: 'Zero Vacancy Risk',
    description: 'Your payout stays fixed even during vacant months \u2014 the risk is ours, not yours.',
  },
  {
    icon: CalendarClock,
    title: 'Predictable Monthly Income',
    description: 'Plan your finances around a guaranteed figure instead of a fluctuating rental market.',
  },
  {
    icon: BadgeCheck,
    title: 'Hands-Off Management',
    description: 'We handle tenant sourcing, rent collection, and day-to-day coordination end-to-end.',
  },
];

const ELIGIBILITY = [
  'Residential or commercial property located in a supported demo market',
  'Property is in a rentable, move-in-ready condition (or can be made so)',
  'Clear title and no ongoing legal disputes',
  'Owner is willing to commit to a fixed-term management agreement',
];

const FAQS = [
  {
    question: 'How is the guaranteed rent amount decided?',
    answer:
      'We evaluate your property against comparable rentals in the area, factoring in location, size, condition, and current market demand, to arrive at a fair fixed monthly figure.',
  },
  {
    question: 'What happens if the property is vacant for a few months?',
    answer:
      'Nothing changes on your end \u2014 you still receive the full guaranteed monthly amount. Vacancy risk is absorbed by DreamSpace Properties, not the owner.',
  },
  {
    question: 'Who handles repairs and maintenance?',
    answer:
      'Day-to-day tenant coordination and maintenance scheduling are handled by our team as part of the agreement; major structural repairs are discussed with the owner separately.',
  },
  {
    question: 'How long is the typical agreement term?',
    answer:
      'Terms are discussed and finalized case-by-case based on the property and owner\u2019s preference. Reach out on WhatsApp and our team will walk you through the specifics.',
  },
];

const GUARANTEED_RENT_WHATSAPP_MESSAGE =
  "Hi, I'd like to know more about the Guaranteed Rent program.";

const GuaranteedRentPage = () => {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Guaranteed Rent', path: '/guaranteed-rent' },
  ];

  return (
    <div className="guaranteed-rent-page">
      <SEOHead
        title="Guaranteed Rent Program"
        description="Explore a fictional guaranteed-rent property management program in this portfolio demo."
        path="/guaranteed-rent"
        jsonLd={[organizationSchema(), breadcrumbSchema(breadcrumbItems)]}
      />

      {/* Hero */}
      <header className="gr-hero">
        <div className="gr-hero-overlay" aria-hidden="true"></div>
        <div className="gr-hero-content">
          <ShieldCheck size={40} className="gr-hero-icon" aria-hidden="true" />
          <h1>Earn Guaranteed Rental Income</h1>
          <p>
            Let us manage your property end-to-end and receive a fixed, guaranteed
            rental payout \u2014 every month, regardless of vacancy.
          </p>
          <WhatsAppButton
            variant="inline"
            message={GUARANTEED_RENT_WHATSAPP_MESSAGE}
            label="WhatsApp Us"
          />
        </div>
      </header>

      <main className="gr-container">
        {/* What is Guaranteed Rent? */}
        <section className="gr-section" aria-labelledby="gr-what-heading">
          <h2 id="gr-what-heading">What is Guaranteed Rent?</h2>
          <p>
            Guaranteed Rent is a property management program where DreamSpace Properties
            Space takes over the responsibility of renting out and managing your
            property, and pays you a fixed monthly amount \u2014 whether or not the
            property is currently occupied by a tenant. You get the predictability
            of a fixed income; we take on the day-to-day work and the vacancy risk.
          </p>
        </section>

        {/* How it works */}
        <section className="gr-section" aria-labelledby="gr-how-heading">
          <h2 id="gr-how-heading">How It Works</h2>
          <div className="gr-steps">
            {HOW_IT_WORKS.map((step) => {
              const Icon = step.icon;
              return (
                <div className="gr-step-card" key={step.title}>
                  <Icon size={28} className="gr-step-icon" aria-hidden="true" />
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Benefits */}
        <section className="gr-section" aria-labelledby="gr-benefits-heading">
          <h2 id="gr-benefits-heading">Benefits</h2>
          <div className="gr-benefits">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div className="gr-benefit-card" key={benefit.title}>
                  <Icon size={24} className="gr-benefit-icon" aria-hidden="true" />
                  <div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Eligibility */}
        <section className="gr-section" aria-labelledby="gr-eligibility-heading">
          <h2 id="gr-eligibility-heading">Eligibility</h2>
          <ul className="gr-eligibility-list">
            {ELIGIBILITY.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* FAQs */}
        <section className="gr-section" aria-labelledby="gr-faq-heading">
          <h2 id="gr-faq-heading">Frequently Asked Questions</h2>
          <div className="gr-faq-list">
            {FAQS.map((faq) => (
              <details className="gr-faq-item" key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* WhatsApp CTA band */}
        <section className="gr-cta-band" aria-labelledby="gr-cta-heading">
          <h2 id="gr-cta-heading">Ready to Earn Guaranteed Rent?</h2>
          <p>Talk to our team on WhatsApp and get a free property evaluation.</p>
          <div className="gr-cta-actions">
            <WhatsAppButton
              variant="inline"
              message={GUARANTEED_RENT_WHATSAPP_MESSAGE}
              label="WhatsApp Us"
            />
            <Button as={Link} to="/contact-us" variant="outline">
              Contact Us Instead
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GuaranteedRentPage;
