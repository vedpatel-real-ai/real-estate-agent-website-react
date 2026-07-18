// src/hooks/useGuestFavourites.js
//
// New (Auth & Favourites Architecture Plan §3) — localStorage-backed
// favourites for signed-out visitors. Fixes the "resets on refresh" bug
// for guests with zero backend involvement, and doubles as the source
// for the guest -> account merge-on-login (see `mergeGuestFavourites`
// in useFavourites.js and `usePostAuthRedirect`).
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'guestFavourites';

function readGuestFavourites() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeGuestFavourites(ids) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — fail
    // silently, same as the previous local-state-only heart icon had no
    // persistence guarantee either.
  }
}

/**
 * useGuestFavourites
 *
 * @returns {{
 *   guestFavouriteIds: (string|number)[],
 *   isFavourite: (propertyId: string|number) => boolean,
 *   toggleFavourite: (propertyId: string|number) => void,
 * }}
 */
export function useGuestFavourites() {
  const [ids, setIds] = useState(() => readGuestFavourites());

  // Keep in sync if guestFavourites changes in another tab.
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) setIds(readGuestFavourites());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isFavourite = useCallback(
    (propertyId) => ids.includes(propertyId),
    [ids],
  );

  const toggleFavourite = useCallback((propertyId) => {
    setIds((prev) => {
      const next = prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId];
      writeGuestFavourites(next);
      return next;
    });
  }, []);

  return { guestFavouriteIds: ids, isFavourite, toggleFavourite };
}

// Exported standalone (not tied to component render) so Login.jsx /
// Signup.jsx / usePostAuthRedirect can read-and-clear synchronously
// right after a session appears, without needing a mounted
// useGuestFavourites() consumer in that same tree.
export function readGuestFavouriteIds() {
  return readGuestFavourites();
}

export function clearGuestFavourites() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}

export default useGuestFavourites;
