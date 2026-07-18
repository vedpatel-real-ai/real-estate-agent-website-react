// src/pages/public/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, Home, Building2 } from 'lucide-react';
import SEOHead from '../../components/shared/SEOHead';
import Button from '../../components/ui/Button';
import './NotFoundPage.css';

/**
 * NotFoundPage (Package 6.2, new)
 *
 * Per Blueprint gap item #33 (Section 8 — "No dedicated 404 page;
 * silently redirects to home"): a real 404 page mounted at the `*`
 * catch-all route in App.jsx, replacing the previous fallthrough to
 * `HomePage`. `noindex` is set on `SEOHead` so search engines don't
 * index the wildcard route.
 */
const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <SEOHead
        title="Page Not Found"
        description="The page you're looking for doesn't exist or may have been moved."
        path="/404"
        noindex
      />

      <div className="nf-content">
        <SearchX size={56} className="nf-icon" aria-hidden="true" />
        <p className="nf-code">404</p>
        <h1>Page Not Found</h1>
        <p className="nf-message">
          The page you're looking for doesn't exist, may have been moved, or
          the link you followed might be outdated.
        </p>
        <div className="nf-actions">
          <Button as={Link} to="/" variant="primary">
            <Home size={16} aria-hidden="true" />
            Back to Home
          </Button>
          <Button as={Link} to="/properties" variant="outline">
            <Building2 size={16} aria-hidden="true" />
            Browse Properties
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;