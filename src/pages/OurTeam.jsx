// src/pages/OurTeam.jsx
import React from 'react';
import SEOHead from '../components/shared/SEOHead';
import { organizationSchema, breadcrumbSchema } from '../lib/seo';
import './OurTeam.css';
import { demoAgents } from '../demo';

/**
 * OurTeam (Package 4.5)
 *
 * Fixes the redesign plan's two flagged issues for this page:
 *  - "Broken image for Riya": the previous `image: '/images/team/riya.jpg'`
 *    pointed at a path that has never existed in `public/`. No real
 *    photo asset was provided for this package, so rather than ship
 *    another broken `<img src>`, a member with no `image` now renders
 *    an initials avatar instead — a real, working fallback rather than
 *    a silently-broken one. Swap in an actual photo asset for Riya
 *    whenever one becomes available; no code change will be needed
 *    beyond adding an `image` value to her entry below.
 *  - "Not in main nav": already resolved in Package 3.1 (`NavigationBar.jsx`
 *    already links to `/our-team`); nothing left to do here.
 *
 * Also fixes a real (if invisible) bug: this file's own `.container`
 * and `.section-title` class names were declared with zero scoping in
 * a plain global stylesheet, silently colliding with the *different*
 * `.section-title` rules in `AboutUs.css`/`HomePage.css` (`section-title`
 * is not a CSS Module here — whichever page's CSS loaded last would win
 * for every page). Renamed to `.our-team-*` prefixed names, matching
 * the collision-avoidance precedent already applied by `tokens.css` (1.2).
 */
const teamMembers = demoAgents.map((agent) => ({
  ...agent,
  description:
    'A fictional portfolio-demo profile representing the professional roles a real estate team can showcase.',
}));

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

const OurTeam = () => {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Our Team', path: '/our-team' },
  ];

  return (
    <section className="our-team-section">
      <SEOHead
        title="Our Team"
        description="Meet the fictional DreamSpace Properties team used in this real estate portfolio demo."
        path="/our-team"
        jsonLd={[organizationSchema(), breadcrumbSchema(breadcrumbItems)]}
      />

      <div className="our-team-container">
        <div className="our-team-header">
          <h1 className="our-team-title">Our Core Team</h1>
          <p className="our-team-subtitle">
            Meet the people who lead our vision, innovation, and client success.
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <div className="team-card" key={member.name}>
              <div className="team-card-image">
                {member.image ? (
                  <img src={member.image} alt={member.name} loading="lazy" />
                ) : (
                  <div className="team-card-avatar-fallback" role="img" aria-label={member.name}>
                    {getInitials(member.name)}
                  </div>
                )}
              </div>
              <div className="team-card-details">
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-description">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
