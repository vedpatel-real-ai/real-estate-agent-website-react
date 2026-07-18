import React from 'react';
import './Badge.css';

/**
 * Badge — small status/label pill.
 *
 * Variants: neutral | primary | accent | success | warning | danger | info
 * Sizes: small | medium
 */
function Badge({
  children,
  variant = 'neutral',
  size = 'medium',
  outline = false,
  className = '',
  ...rest
}) {
  const classNames = [
    'ui-badge',
    `ui-badge--${variant}`,
    `ui-badge--${size}`,
    outline ? 'ui-badge--outline' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} {...rest}>
      {children}
    </span>
  );
}

export default Badge;
