import React from 'react';
import './Card.css';

/**
 * Card — generic content container.
 *
 * Unifies the ad-hoc card markup previously duplicated across
 * PropertyCard, PropertyModule's "Existing Properties" list,
 * TestimonialsModule's inline-styled card, and HomePage's inline
 * "news-card" blog markup (Section 9F). This is the generic shell;
 * domain-specific cards (e.g. `PropertyCard`) can compose it or keep
 * their own markup — unifying those call sites is out of this
 * package's scope (they belong to their respective Phase 3/4 packages).
 */
function Card({
  children,
  header,
  footer,
  image,
  imageAlt = '',
  hoverable = false,
  padded = true,
  className = '',
  ...rest
}) {
  const classNames = [
    'ui-card',
    hoverable ? 'ui-card--hoverable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...rest}>
      {image && (
        <div className="ui-card__image-wrap">
          <img src={image} alt={imageAlt} className="ui-card__image" loading="lazy" />
        </div>
      )}
      {header && <div className="ui-card__header">{header}</div>}
      <div className={padded ? 'ui-card__body' : 'ui-card__body ui-card__body--flush'}>
        {children}
      </div>
      {footer && <div className="ui-card__footer">{footer}</div>}
    </div>
  );
}

export default Card;