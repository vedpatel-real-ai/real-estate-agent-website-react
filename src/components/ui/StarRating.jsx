import React from 'react';
import { Star } from 'lucide-react';
import './StarRating.css';

/**
 * StarRating — shared star display/input primitive.
 *
 * Generalizes the filled/empty-star rendering previously duplicated as
 * a local `renderStars()` helper in `Testimonial.jsx` and the raw
 * numeric `stars` field editing in `TestimonialsModule.jsx` (Section
 * 9F). Read-only by default; pass `onChange` to make it interactive
 * (e.g. for an admin edit form or a future review-submission form).
 */
function StarRating({
  rating = 0,
  max = 5,
  size = 20,
  readOnly = true,
  onChange,
  className = '',
}) {
  const stars = Array.from({ length: max }, (_, index) => index + 1);

  return (
    <span
      className={`ui-star-rating ${readOnly ? '' : 'ui-star-rating--interactive'} ${className}`}
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={readOnly ? `Rated ${rating} out of ${max} stars` : 'Star rating'}
    >
      {stars.map((starValue) => {
        const filled = starValue <= Math.round(rating);

        if (readOnly) {
          return (
            <Star
              key={starValue}
              size={size}
              className={`ui-star-rating__star ${filled ? 'ui-star-rating__star--filled' : ''}`}
              aria-hidden="true"
              fill={filled ? 'currentColor' : 'none'}
            />
          );
        }

        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={starValue === rating}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            className="ui-star-rating__btn"
            onClick={() => onChange?.(starValue)}
          >
            <Star
              size={size}
              className={`ui-star-rating__star ${filled ? 'ui-star-rating__star--filled' : ''}`}
              fill={filled ? 'currentColor' : 'none'}
            />
          </button>
        );
      })}
    </span>
  );
}

export default StarRating;
