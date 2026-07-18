// src/hooks/usePostAuthRedirect.js
//
// New (Auth & Favourites Architecture Plan §2/§3) — shared "what happens
// right after a session appears" logic for Login.jsx and Signup.jsx:
// merges any guest-favourited properties into the now-known user's
// `favourites` rows, then redirects to /admin (if admin_users marks this
// user as an admin) or /dashboard (or wherever the person was headed
// before being sent to /login). Also fires after a Google OAuth or
// magic-link redirect lands back on /login with a session already set,
// since those don't go through Login.jsx's own submit handler.
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { readGuestFavouriteIds, clearGuestFavourites } from './useGuestFavourites';
import { mergeGuestFavourites } from './useFavourites';

export function usePostAuthRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return undefined;
    let cancelled = false;

    (async () => {
      const guestIds = readGuestFavouriteIds();
      if (guestIds.length) {
        await mergeGuestFavourites(user.id, guestIds);
        clearGuestFavourites();
      }

      const { data: adminRow } = await supabase
        .from('admin_users')
        .select('is_admin')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cancelled) return;

      const fallback = location.state?.from?.pathname || '/dashboard';
      navigate(adminRow?.is_admin ? '/admin' : fallback, { replace: true });
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, user?.id]);
}

export default usePostAuthRedirect;
