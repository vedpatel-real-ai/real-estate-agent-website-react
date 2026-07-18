import React from 'react';
import './Skeleton.css';

/**
 * Skeleton — shimmering placeholder for async content.
 *
 * Variants: text | circle | rect
 *
 * This primitive exists so Phase 6's "Loading Skeletons Rollout" package
 * (6.1) has a component to swap in for the plain "Loading..." text
 * currently used across the app (Section 9K) — rollout itself is out of
 * this package's scope.
 */
function Skeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  className = '',
  style = {},
}) {
  const baseStyle = {
    width,
    height,
    ...style,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <span className={`ui-skeleton-group ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <span
            key={index}
            className="ui-skeleton ui-skeleton--text"
            style={{
              ...baseStyle,
              width: index === lines - 1 ? '70%' : baseStyle.width || '100%',
            }}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      className={`ui-skeleton ui-skeleton--${variant} ${className}`}
      style={baseStyle}
    />
  );
}

export default Skeleton;
