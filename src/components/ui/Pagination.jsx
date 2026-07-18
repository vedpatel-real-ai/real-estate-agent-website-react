import React from 'react';
import './Pagination.css';

/**
 * Pagination — shared page-number control.
 *
 * Generalizes the inline pagination markup in `Properties.jsx` (Section
 * 9F/13) so future packages (4.2 Properties rebuild, 6.x) can reuse it
 * instead of re-implementing prev/next + page-number buttons by hand.
 * Collapses long page ranges with ellipses once there are more than 7
 * pages.
 */
function getPageList(currentPage, totalPages) {
  const pages = [];
  const siblingCount = 1;

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    return pages;
  }

  const left = Math.max(2, currentPage - siblingCount);
  const right = Math.min(totalPages - 1, currentPage + siblingCount);

  pages.push(1);
  if (left > 2) pages.push('ellipsis-left');
  for (let i = left; i <= right; i += 1) pages.push(i);
  if (right < totalPages - 1) pages.push('ellipsis-right');
  pages.push(totalPages);

  return pages;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = getPageList(currentPage, totalPages);

  return (
    <nav
      className={`ui-pagination ${className}`}
      aria-label="Pagination"
    >
      <button
        type="button"
        className="ui-pagination__btn ui-pagination__btn--nav"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        &laquo;
      </button>

      {pages.map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={page}
            type="button"
            className={`ui-pagination__btn ${
              page === currentPage ? 'ui-pagination__btn--active' : ''
            }`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        ) : (
          <span key={`${page}-${index}`} className="ui-pagination__ellipsis">
            &hellip;
          </span>
        )
      )}

      <button
        type="button"
        className="ui-pagination__btn ui-pagination__btn--nav"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        &raquo;
      </button>
    </nav>
  );
}

export default Pagination;
