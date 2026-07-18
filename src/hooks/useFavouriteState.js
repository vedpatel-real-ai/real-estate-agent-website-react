// src/hooks/useFavouriteState.js
//
// New — small combinator so page components (HomePage, Properties) don't
// need their own if/else between the signed-in and guest favourites
// backends. Both underlying hooks are called unconditionally (required
// by the Rules of Hooks); only the *result* used is picked based on
// auth state. Matches Plan §6: "the component doesn't need to know
// whether it's talking to Supabase or localStorage; that's the hook's
// job" — this just extends that one level up, to the page components.
import { useAuth } from '../context/AuthContext';
import { useFavourites } from './useFavourites';
import { useGuestFavourites } from './useGuestFavourites';

/**
 * @returns {{
 *   isFavourite: (propertyId: number) => boolean,
 *   toggleFavourite: (propertyId: number) => void,
 * }}
 */
export function useFavouriteState() {
  const { isAuthenticated } = useAuth();
  const authed = useFavourites();
  const guest = useGuestFavourites();

  return isAuthenticated
    ? { isFavourite: authed.isFavourite, toggleFavourite: authed.toggleFavourite }
    : { isFavourite: guest.isFavourite, toggleFavourite: guest.toggleFavourite };
}

export default useFavouriteState;
