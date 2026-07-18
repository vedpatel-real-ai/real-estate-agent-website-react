import React from 'react';
import Spinner from './Spinner';
import './Button.css';

/**
 * Button — shared button primitive.
 *
 * Variants: primary | secondary | outline | ghost | danger
 * Sizes: small | medium | large
 *
 * Renders a native <button> by default. Pass `as="a"` with an `href`
 * (or any other valid element/component) to render as a different
 * element while keeping the same visual styling.
 */
function Button({
  children,
  variant = 'primary',
  size = 'medium',
  as = 'button',
  type = 'button',
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  ...rest
}) {
  const Component = as;
  const isDisabled = disabled || loading;

  const classNames = [
    'ui-btn',
    `ui-btn--${variant}`,
    `ui-btn--${size}`,
    fullWidth ? 'ui-btn--full' : '',
    loading ? 'ui-btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const nativeProps = Component === 'button' ? { type } : {};

  return (
    <Component
      className={classNames}
      disabled={Component === 'button' ? isDisabled : undefined}
      aria-disabled={Component !== 'button' ? isDisabled : undefined}
      aria-busy={loading || undefined}
      {...nativeProps}
      {...rest}
    >
      {loading && (
        <Spinner size="small" variant="light" className="ui-btn__spinner" />
      )}
      <span className="ui-btn__label">{children}</span>
    </Component>
  );
}

export default Button;
