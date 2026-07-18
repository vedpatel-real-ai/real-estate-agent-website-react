import React, { useEffect, useState } from 'react';
import { demoTestimonials } from '../demo';
import { isDemoMode, supabase } from '../lib/supabaseClient';
import './Testimonial.css';

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const showPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const showNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  // Helper function to display stars with filled/empty characters
  const renderStars = (num) => {
    const maxStars = 5;
    const filledStars = '★'.repeat(num);
    const emptyStars = '☆'.repeat(maxStars - num);
    return filledStars + emptyStars;
  };

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials(demoTestimonials);
    } else {
      setTestimonials(data);
    }
  };

  useEffect(() => {
    if (isDemoMode) {
      setTestimonials(demoTestimonials);
      return;
    }

    fetchTestimonials();
  }, []);


  // Render the current testimonial (if any) in its own box
  return (
    <div className="testimonial-container">
      <h2>Client Testimonials</h2>
      {testimonials.length > 0 ? (
        <div className="testimonial-box transition">
          {testimonials[currentIndex].image_url && (
            <img
              src={testimonials[currentIndex].image_url}
              alt={testimonials[currentIndex].name}
              className="testimonial-photo"
              loading="lazy"
              width={80}
              height={80}
            />
          )}
          <div className="testimonial-rating">
            {renderStars(testimonials[currentIndex].stars || 0)}
          </div>
          <blockquote className="testimonial-text">
            "{testimonials[currentIndex].feedback}"
          </blockquote>
          <h4 className="testimonial-author">
            {testimonials[currentIndex].name}
          </h4>
          {testimonials[currentIndex].role && (
            <p className="testimonial-role">
              {testimonials[currentIndex].role}
            </p>
          )}
        </div>
      ) : (
        <p>No testimonials available.</p>
      )}
      {/* Show navigation controls only if there's more than one testimonial */}
      {testimonials.length > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Show previous testimonial"
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ccc',
              borderRadius: '6px',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            ‹ Previous
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Show next testimonial"
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ccc',
              borderRadius: '6px',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
};

export default Testimonial;
