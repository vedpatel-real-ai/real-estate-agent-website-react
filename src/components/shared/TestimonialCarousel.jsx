// src/components/shared/TestimonialCarousel.jsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { demoTestimonials } from '../../demo';
import { isDemoMode, supabase } from '../../lib/supabaseClient';
import StarRating from '../ui/StarRating';
import Skeleton from '../ui/Skeleton';
import './TestimonialCarousel.css';

/**
 * TestimonialCarousel (Package 4.1)
 *
 * Replaces the homepage's old testimonials section. Previously
 * `HomePage.jsx` mapped over a hardcoded, permanently empty `TESTIMONIALS`
 * array and rendered `<Testimonial testimonial={t} />` for each entry — but
 * `Testimonial.jsx` actually ignores that prop and fetches its own data
 * internally, so with a `[]` array nothing ever rendered and the section
 * was silently empty (Part A/B, gap item; Blueprint row 562). This
 * component fetches the `testimonials` table directly (the same query
 * `Testimonial.jsx`/`TestimonialsModule.jsx` already use — `name`, `role`,
 * `feedback`, `stars`, `image_url`) and is the only thing that reads it
 * on the homepage now.
 *
 * Shows 3 cards at a time on desktop / 1 on mobile via CSS flex-basis
 * (single shared DOM + scroll-snap track, not two separate layouts), so it
 * also supports touch swipe for free. Auto-advances every 6s, pausing on
 * hover/focus, and wraps back to the start at the end — fixing the
 * "testimonial carousel doesn't actually advance" complaint, since there
 * was previously no live data for any carousel to advance through.
 */
function TestimonialCarousel({ className = '' }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const autoplayRef = useRef(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const fetchTestimonials = async () => {
      if (isDemoMode) {
        setTestimonials(demoTestimonials);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (cancelled) return;
      if (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials(demoTestimonials);
      } else {
        setTestimonials(data ?? []);
      }
      setLoading(false);
    };

    fetchTestimonials();
    return () => {
      cancelled = true;
    };
  }, []);

  const getCardsPerView = useCallback(() => {
    if (typeof window === 'undefined') return 3;
    return window.matchMedia('(min-width: 992px)').matches ? 3 : 1;
  }, []);

  const recomputePageCount = useCallback(() => {
    const cardsPerView = getCardsPerView();
    setPageCount(Math.max(1, Math.ceil(testimonials.length / cardsPerView)));
  }, [getCardsPerView, testimonials.length]);

  useEffect(() => {
    recomputePageCount();
    window.addEventListener('resize', recomputePageCount);
    return () => window.removeEventListener('resize', recomputePageCount);
  }, [recomputePageCount]);

  const scrollToPage = useCallback(
    (pageIndex) => {
      const track = trackRef.current;
      const cardsPerView = getCardsPerView();
      const targetCard = cardRefs.current[pageIndex * cardsPerView];
      if (track && targetCard) {
        track.scrollTo({ left: targetCard.offsetLeft, behavior: 'smooth' });
      }
    },
    [getCardsPerView],
  );

  const goToPage = useCallback(
    (pageIndex) => {
      setPageCount((currentPageCount) => {
        const total = Math.max(1, currentPageCount);
        const next = ((pageIndex % total) + total) % total;
        setActivePage(next);
        scrollToPage(next);
        return currentPageCount;
      });
    },
    [scrollToPage],
  );

  const goNext = useCallback(() => goToPage(activePage + 1), [activePage, goToPage]);
  const goPrev = useCallback(() => goToPage(activePage - 1), [activePage, goToPage]);

  // Autoplay: advances every 6s, paused while the pointer or focus is
  // inside the carousel, cleared on unmount or when there's nothing to
  // advance through.
  useEffect(() => {
    if (pageCount <= 1) return undefined;

    autoplayRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        goNext();
      }
    }, 6000);

    return () => clearInterval(autoplayRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCount, activePage]);

  const pause = () => {
    isPausedRef.current = true;
  };
  const resume = () => {
    isPausedRef.current = false;
  };

  if (loading) {
    return (
      <div className={`testimonial-carousel ${className}`}>
        <div className="testimonial-carousel__track">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="testimonial-carousel__card" key={i}>
              <Skeleton variant="text" width={90} height={18} />
              <Skeleton variant="text" lines={3} />
              <div className="testimonial-carousel__author">
                <Skeleton variant="circle" className="testimonial-carousel__photo" />
                <div>
                  <Skeleton variant="text" width={110} />
                  <Skeleton variant="text" width={80} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={`testimonial-carousel testimonial-carousel--status ${className}`}>
        <p>Unable to load testimonials right now. Please check back soon.</p>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className={`testimonial-carousel testimonial-carousel--status ${className}`}>
        <p>No testimonials yet — check back soon.</p>
      </div>
    );
  }

  return (
    <div
      className={`testimonial-carousel ${className}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <div className="testimonial-carousel__track" ref={trackRef}>
        {testimonials.map((t, i) => (
          <div
            className="testimonial-carousel__card"
            key={t.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
          >
            <StarRating rating={t.stars || 0} size={18} />
            <blockquote className="testimonial-carousel__quote">&ldquo;{t.feedback}&rdquo;</blockquote>
            <div className="testimonial-carousel__author">
              {t.image_url && (
                <img
                  src={t.image_url}
                  alt=""
                  className="testimonial-carousel__photo"
                  loading="lazy"
                  width={48}
                  height={48}
                />
              )}
              <div>
                <p className="testimonial-carousel__name">{t.name}</p>
                {t.role && <p className="testimonial-carousel__role">{t.role}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <>
          <button
            type="button"
            className="testimonial-carousel__nav testimonial-carousel__nav--prev"
            onClick={goPrev}
            aria-label="Show previous testimonials"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="testimonial-carousel__nav testimonial-carousel__nav--next"
            onClick={goNext}
            aria-label="Show next testimonials"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
          <div className="testimonial-carousel__dots" role="tablist" aria-label="Testimonial pages">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activePage}
                aria-label={`Go to testimonial page ${i + 1}`}
                className={`testimonial-carousel__dot ${
                  i === activePage ? 'testimonial-carousel__dot--active' : ''
                }`}
                onClick={() => goToPage(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default TestimonialCarousel;
