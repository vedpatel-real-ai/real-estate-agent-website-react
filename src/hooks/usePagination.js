// src/hooks/usePagination.js
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * usePagination
 *
 * Shared page-state hook to pair with the `ui/Pagination.jsx` component
 * and the server-side `page`/`pageSize` params consumed by
 * `useProperties`/`useBlogPosts`. Replaces the ad hoc
 * `currentPage`/`propertiesPerPage`/`indexOfFirst`/`indexOfLast` state
 * duplicated in `Properties.jsx` with one reusable implementation.
 *
 * This hook only owns page-number state; it does not fetch data itself
 * and does not sync to the URL — Package 3.4 (PropertyFilters) is
 * expected to combine this with `useSearchParams` for that.
 *
 * @param {object} [params]
 * @param {number} [params.initialPage=1]
 * @param {number} [params.pageSize=6]
 * @param {number} [params.totalCount=0] - total row count from the current query (e.g. `useProperties`'s `count`)
 */
export function usePagination({
  initialPage = 1,
  pageSize = 6,
  totalCount = 0,
} = {}) {
  const [currentPage, setCurrentPage] = useState(Math.max(1, initialPage));

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / pageSize) || 1),
    [totalCount, pageSize],
  );

  // If a filter change shrinks the result set out from under the current
  // page (e.g. going from page 4 to a 1-page result), clamp back into range
  // instead of showing an empty page.
  useEffect(() => {
    setCurrentPage((prev) => (prev > totalPages ? totalPages : prev));
  }, [totalPages]);

  const goToPage = useCallback(
    (page) => {
      setCurrentPage((prev) => {
        const next = Math.min(Math.max(1, page), totalPages);
        return next === prev ? prev : next;
      });
    },
    [totalPages],
  );

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const resetPage = useCallback(() => setCurrentPage(1), []);

  const offset = (currentPage - 1) * pageSize;

  return {
    currentPage,
    pageSize,
    totalPages,
    totalCount,
    offset,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetPage,
    setCurrentPage: goToPage,
  };
}

export default usePagination;