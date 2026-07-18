// src/components/shared/WhatsAppButton.jsx
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppButton.css';

/**
 * WhatsAppButton (Package 4.1)
 *
 * Shared WhatsApp CTA primitive, replacing the ad hoc `<a href="https://wa.me/...">`
 * markup duplicated locally in `NavigationBar.jsx` and `Footer.jsx` (Package 3.1)
 * and the missing floating button flagged as the top-priority gap in Part A/B
 * (Section 9, "No WhatsApp anywhere on the site" — critical). Those two existing
 * call sites are left as-is (outside this package's file scope) but every new
 * WhatsApp CTA from this point forward — the homepage floating button and inline
 * band CTA (4.1), and the property/detail/blog/about/contact placements planned
 * for 4.2–4.5 and 5.x/6.x — should import this component instead of re-declaring
 * the number and `wa.me` URL locally.
 *
 * The phone number below is the same temporary hardcode already used in
 * `NavigationBar.jsx`/`Footer.jsx`, carried over here rather than invented fresh.
 * It is intentionally exported so it can be swapped for the `site_settings
 * .whatsapp_number`-backed value in one place once Package 3.6 (Site Settings
 * admin module) lands — no consumer of this component will need to change.
 *
 * Variants:
 *  - 'floating': fixed bottom-right circular button (per redesign plan's
 *    "56px circle, green with WhatsApp icon" spec).
 *  - 'inline': pill button with icon + label, for use inside page content
 *    (e.g. the homepage Guaranteed Rent band and Contact CTA band).
 */

export const WHATSAPP_NUMBER = '919876543210';
export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi, I'm interested in DreamSpace Properties listings.";

export function buildWhatsAppHref(message = DEFAULT_WHATSAPP_MESSAGE, number = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function WhatsAppButton({
  variant = 'floating',
  message = DEFAULT_WHATSAPP_MESSAGE,
  number = WHATSAPP_NUMBER,
  label = 'WhatsApp Us',
  className = '',
  ...rest
}) {
  const href = buildWhatsAppHref(message, number);
  const showLabel = variant !== 'floating';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`wa-btn wa-btn--${variant} ${className}`}
      aria-label={
        showLabel
          ? undefined
          : 'Chat with DreamSpace Properties on WhatsApp (opens in a new tab)'
      }
      {...rest}
    >
      <FaWhatsapp className="wa-btn__icon" aria-hidden="true" />
      {showLabel && <span className="wa-btn__label">{label}</span>}
    </a>
  );
}

export default WhatsAppButton;
