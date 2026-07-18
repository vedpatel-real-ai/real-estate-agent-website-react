import React from 'react';
import './Spinner.css';

/**
 * Spinner — shared loading indicator.
 *
 * Sizes: small | medium | large
 * Variants: primary | light | dark | accent
 *
 * Replaces the plain "Loading..." text scattered across pages/modules
 * (Section 9K). Pass `label` to render accompanying text next to the
 * spinner; the label is always available to screen readers even if
 * visually hidden.
 */
function Spinner({
  size = 'medium',
  variant = 'primary',
  label = 'Loading...',
  showLabel = false,
  className = '',
}) {
  const classNames = [
    'ui-spinner-wrap',
    showLabel ? 'ui-spinner-wrap--with-label' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} role="status" aria-live="polite">
      <span
        className={`ui-spinner ui-spinner--${size} ui-spinner--${variant}`}
        aria-hidden="true"
      />
      {showLabel ? (
        <span className="ui-spinner__label">{label}</span>
      ) : (
        <span className="ui-sr-only">{label}</span>
      )}
    </span>
  );
}

export default Spinner;
